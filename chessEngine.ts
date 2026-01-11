
import { BoardState, Position, PieceType, Color } from './types';

/* ================= PATH UTILS ================= */

export const isPathClear = (board: BoardState, from: Position, to: Position): boolean => {
  const dRow = Math.sign(to.row - from.row);
  const dCol = Math.sign(to.col - from.col);
  let r = from.row + dRow;
  let c = from.col + dCol;

  if (dRow === 0 && dCol === 0) return true;

  while (r !== to.row || c !== to.col) {
    if (board[r][c]) return false;
    r += dRow;
    c += dCol;
  }
  return true;
};

/* ================= ATTACK LOGIC ================= */

const canPieceAttack = (board: BoardState, from: Position, to: Position): boolean => {
  const piece = board[from.row][from.col];
  if (!piece) return false;

  const dr = Math.abs(to.row - from.row);
  const dc = Math.abs(to.col - from.col);

  switch (piece.type) {
    case PieceType.PAWN:
      const dir = piece.color === 'white' ? -1 : 1;
      // Pawn attacks diagonally only
      return (to.row - from.row === dir) && (dc === 1);
    case PieceType.KNIGHT:
      return (dr === 2 && dc === 1) || (dr === 1 && dc === 2);
    case PieceType.KING:
      return dr <= 1 && dc <= 1;
    case PieceType.BISHOP:
      return dr === dc && isPathClear(board, from, to);
    case PieceType.ROOK:
      return (dr === 0 || dc === 0) && isPathClear(board, from, to);
    case PieceType.QUEEN:
      return (dr === dc || dr === 0 || dc === 0) && isPathClear(board, from, to);
    default:
      return false;
  }
};

export const isKingInCheck = (board: BoardState, color: Color): boolean => {
  let kingPos: Position | null = null;
  // Find King
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p?.type === PieceType.KING && p.color === color) {
        kingPos = { row: r, col: c };
        break;
      }
    }
  }
  
  if (!kingPos) return false;

  const opponentColor = color === 'white' ? 'black' : 'white';
  
  // Check if any opponent piece can attack the King
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p && p.color === opponentColor) {
        if (canPieceAttack(board, { row: r, col: c }, kingPos)) {
          return true;
        }
      }
    }
  }
  return false;
};

/* ================= MOVE GENERATION ================= */

export const getLegalMoves = (board: BoardState, pos: Position, turn: Color): Position[] => {
  const piece = board[pos.row][pos.col];
  if (!piece || piece.color !== turn) return [];

  const moves: Position[] = [];
  const isValid = (r: number, c: number) => r >= 0 && r < 8 && c >= 0 && c < 8;

  // 1. Generate Pseudo-legal moves
  if (piece.type === PieceType.PAWN) {
    const dir = piece.color === 'white' ? -1 : 1;
    const startRow = piece.color === 'white' ? 6 : 1;
    
    // Move forward 1
    if (isValid(pos.row + dir, pos.col) && !board[pos.row + dir][pos.col]) {
      moves.push({ row: pos.row + dir, col: pos.col });
      // Move forward 2
      if (pos.row === startRow && !board[pos.row + 2 * dir][pos.col]) {
        moves.push({ row: pos.row + 2 * dir, col: pos.col });
      }
    }
    // Captures
    [1, -1].forEach(dc => {
      const nr = pos.row + dir, nc = pos.col + dc;
      if (isValid(nr, nc) && board[nr][nc] && board[nr][nc]?.color !== piece.color) {
        moves.push({ row: nr, col: nc });
      }
    });
  } else if (piece.type === PieceType.KNIGHT) {
    const jumps = [[1, 2], [1, -2], [-1, 2], [-1, -2], [2, 1], [2, -1], [-2, 1], [-2, -1]];
    jumps.forEach(([dr, dc]) => {
      const nr = pos.row + dr, nc = pos.col + dc;
      if (isValid(nr, nc)) {
        const target = board[nr][nc];
        if (!target || target.color !== piece.color) {
          moves.push({ row: nr, col: nc });
        }
      }
    });
  } else if (piece.type === PieceType.KING) {
    const steps = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
    steps.forEach(([dr, dc]) => {
      const nr = pos.row + dr, nc = pos.col + dc;
      if (isValid(nr, nc)) {
         const target = board[nr][nc];
         if (!target || target.color !== piece.color) {
           moves.push({ row: nr, col: nc });
         }
      }
    });
    // Castling
    if (!piece.hasMoved && !isKingInCheck(board, turn)) {
      const row = piece.color === 'white' ? 7 : 0;
      // Kingside
      if (board[row][7]?.type === PieceType.ROOK && !board[row][7]?.hasMoved) {
        if (!board[row][5] && !board[row][6]) moves.push({ row, col: 6 });
      }
      // Queenside
      if (board[row][0]?.type === PieceType.ROOK && !board[row][0]?.hasMoved) {
        if (!board[row][1] && !board[row][2] && !board[row][3]) moves.push({ row, col: 2 });
      }
    }
  } else {
    // R, B, Q
    const directions = piece.type === PieceType.BISHOP ? [[1,1],[1,-1],[-1,1],[-1,-1]] : 
                      piece.type === PieceType.ROOK ? [[0,1],[0,-1],[1,0],[-1,0]] : 
                      [[1,1],[1,-1],[-1,1],[-1,-1],[0,1],[0,-1],[1,0],[-1,0]];
    
    directions.forEach(([dr, dc]) => {
      let nr = pos.row + dr;
      let nc = pos.col + dc;
      while (isValid(nr, nc)) {
        if (!board[nr][nc]) {
          moves.push({ row: nr, col: nc });
        } else {
          if (board[nr][nc]?.color !== piece.color) {
            moves.push({ row: nr, col: nc });
          }
          break;
        }
        nr += dr;
        nc += dc;
      }
    });
  }

  // 2. Filter moves that result in self-check
  return moves.filter(move => {
    // Castling special check: Cannot castle THROUGH check
    if (piece.type === PieceType.KING && Math.abs(move.col - pos.col) === 2) {
       const midCol = (pos.col + move.col) / 2;
       const midBoard = board.map(r => r.map(p => p ? { ...p } : null));
       midBoard[pos.row][midCol] = piece;
       midBoard[pos.row][pos.col] = null;
       if (isKingInCheck(midBoard, turn)) return false;
    }

    const nextBoard = board.map(r => r.map(p => p ? { ...p } : null));
    const movingPiece = nextBoard[pos.row][pos.col]!;
    
    nextBoard[move.row][move.col] = movingPiece;
    nextBoard[pos.row][pos.col] = null;
    
    return !isKingInCheck(nextBoard, turn);
  });
};

export const getGameStateStatus = (board: BoardState, turn: Color): 'playing' | 'checkmate' | 'draw' => {
  let hasMove = false;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c]?.color === turn) {
        if (getLegalMoves(board, { row: r, col: c }, turn).length > 0) {
          hasMove = true;
          break;
        }
      }
    }
    if (hasMove) break;
  }

  if (hasMove) return 'playing';

  return isKingInCheck(board, turn) ? 'checkmate' : 'draw';
};
