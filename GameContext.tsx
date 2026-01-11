import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import {
  GameState,
  Move,
  Position,
  Color,
  BoardState,
  GameMode,
  PieceType,
} from './types';
import { INITIAL_BOARD } from './constants';
import { getLegalMoves, getGameStateStatus } from './chessEngine';
import { useAuth } from './AuthContext';

/* ================= CONTEXT ================= */
interface GameContextType extends GameState {
  makeMove: (from: Position, to: Position) => boolean;
  promotePawn: (type: PieceType) => void;
  createRoom: (mode: GameMode) => void;
  joinRoom: (roomId: string) => void;
  resetGame: () => void;
  resign: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

/* ================= HELPERS ================= */
const cloneBoard = (board: BoardState): BoardState =>
  board.map(row => row.map(cell => (cell ? { ...cell } : null)));

/* ================= PROVIDER ================= */
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const timerRef = useRef<number | null>(null);

  const [state, setState] = useState<GameState>({
    board: cloneBoard(INITIAL_BOARD),
    turn: 'white',
    history: [],
    status: 'landing',
    winner: null,
    mode: 'local',
    room: null,
    myColor: 'white',
    lastMove: null,
    clocks: { white: 600, black: 600 },
    promotionPosition: undefined,
  });

  /* ================= TIMER ================= */
  useEffect(() => {
    if (state.status !== 'playing') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = window.setInterval(() => {
      setState(prev => {
        const timeLeft = prev.clocks[prev.turn];
        if (timeLeft <= 1) {
          clearInterval(timerRef.current!);
          return {
            ...prev,
            status: 'checkmate',
            winner: prev.turn === 'white' ? 'black' : 'white',
          };
        }

        return {
          ...prev,
          clocks: {
            ...prev.clocks,
            [prev.turn]: timeLeft - 1,
          },
        };
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.status, state.turn]);

  /* ================= MOVE ================= */
  const makeMove = useCallback(
    (from: Position, to: Position): boolean => {
      if (state.status !== 'playing') return false;

      const piece = state.board[from.row][from.col];
      if (!piece || piece.color !== state.turn) return false;

      const legalMoves = getLegalMoves(state.board, from, state.turn);
      const isLegal = legalMoves.some(
        m => m.row === to.row && m.col === to.col
      );

      if (!isLegal) return false;

      // Pawn promotion
      if (
        piece.type === PieceType.PAWN &&
        (to.row === 0 || to.row === 7)
      ) {
        setState(prev => ({
          ...prev,
          status: 'promotion-pending',
          promotionPosition: { from, to },
        }));
        return true;
      }

      executeMove(from, to, piece.type);
      return true;
    },
    [state]
  );

  /* ================= EXECUTE MOVE ================= */
  const executeMove = (
    from: Position,
    to: Position,
    promoteTo: PieceType
  ) => {
    setState(prev => {
      const board = cloneBoard(prev.board);
      const piece = board[from.row][from.col]!;
      let isCastling = false;

      // Castling
      if (piece.type === PieceType.KING && Math.abs(to.col - from.col) === 2) {
        isCastling = true;
        const rookFromCol = to.col === 6 ? 7 : 0;
        const rookToCol = to.col === 6 ? 5 : 3;
        const rook = board[from.row][rookFromCol]!;
        board[from.row][rookToCol] = { ...rook, hasMoved: true };
        board[from.row][rookFromCol] = null;
      }

      const captured = board[to.row][to.col];

      board[to.row][to.col] = {
        ...piece,
        type: promoteTo,
        hasMoved: true,
      };
      board[from.row][from.col] = null;

      const nextTurn: Color = prev.turn === 'white' ? 'black' : 'white';
      const engineStatus = getGameStateStatus(board, nextTurn);

      const move: Move = {
        from,
        to,
        piece,
        captured,
        isCastling,
        timestamp: Date.now(),
        notation: `${piece.type[0].toUpperCase()}${String.fromCharCode(
          97 + to.col
        )}${8 - to.row}`,
      };

      const sound = captured ? 'capture' : 'move-self';
      new Audio(
        `https://assets.chess.com/pawns/pieces/neo/sounds/${sound}.mp3`
      ).play().catch(() => {});

      return {
        ...prev,
        board,
        turn: nextTurn,
        history: [...prev.history, move],
        lastMove: move,
        promotionPosition: undefined,
        status: engineStatus === 'playing' ? 'playing' : engineStatus,
        winner: engineStatus === 'checkmate' ? prev.turn : null,
      };
    });
  };

  /* ================= PROMOTION ================= */
  const promotePawn = (type: PieceType) => {
    if (!state.promotionPosition) return;
    executeMove(
      state.promotionPosition.from,
      state.promotionPosition.to,
      type
    );
  };

  /* ================= GAME CONTROL ================= */
  const createRoom = (mode: GameMode) => {
    setState({
      board: cloneBoard(INITIAL_BOARD),
      turn: 'white',
      history: [],
      status: 'playing',
      winner: null,
      mode,
      room: null,
      myColor: 'white',
      lastMove: null,
      clocks: { white: 600, black: 600 },
      promotionPosition: undefined,
    });
  };

  const joinRoom = (roomId: string) => {
    // placeholder for realtime
  };

  const resetGame = () => createRoom(state.mode);

  const resign = () =>
    setState(prev => ({
      ...prev,
      status: 'resigned',
      winner: prev.turn === 'white' ? 'black' : 'white',
    }));

  /* ================= PROVIDER ================= */
  return (
    <GameContext.Provider
      value={{
        ...state,
        makeMove,
        promotePawn,
        createRoom,
        joinRoom,
        resetGame,
        resign,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

/* ================= HOOK ================= */
export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
};
