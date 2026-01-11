/* =======================
   BASIC TYPES
======================= */

export type Color = 'white' | 'black';

export type Language = 'vi' | 'en-US' | 'en-UK';

/* =======================
   CHESS PIECES
======================= */

export enum PieceType {
  PAWN = 'p',
  KNIGHT = 'n',
  BISHOP = 'b',
  ROOK = 'r',
  QUEEN = 'q',
  KING = 'k'
}

export interface Piece {
  id: string;
  type: PieceType;
  color: Color;
  hasMoved: boolean;
}

/* =======================
   BOARD & POSITION
======================= */

export interface Position {
  row: number; // 0 → 7
  col: number; // 0 → 7
}

export type BoardState = (Piece | null)[][];

/* =======================
   USERS & AUTH
======================= */

export interface User {
  id: string;
  username: string;
  fullName: string;
  avatar?: string;
  rating: number;
  token?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/* =======================
   GAME MOVE
======================= */

export interface Move {
  from: Position;
  to: Position;
  piece: Piece;
  captured?: Piece | null;

  notation: string;        // e.g. e4, Nf3, O-O
  timestamp: number;

  isCheck?: boolean;
  isCheckmate?: boolean;
  isCastling?: boolean;
  isEnPassant?: boolean;
  isPromotion?: boolean;
  promotionType?: PieceType;
}

/* =======================
   GAME MODES
======================= */

export type GameMode = 'local' | 'online' | 'ai';

export type AIDifficulty = 'easy' | 'medium' | 'hard' | 'master';

/* =======================
   ONLINE ROOM
======================= */

export interface GameRoom {
  id: string;
  players: {
    white: User | null;
    black: User | null;
  };
  spectators: User[];
  status: 'waiting' | 'playing' | 'finished';
}

/* =======================
   CLOCK
======================= */

export interface ClockState {
  white: number; // milliseconds
  black: number;
}

/* =======================
   GAME STATE (CORE)
======================= */

export interface GameState {
  board: BoardState;
  turn: Color;
  history: Move[];

  status:
    | 'landing'
    | 'waiting'
    | 'playing'
    | 'promotion-pending'
    | 'checkmate'
    | 'draw'
    | 'resigned';

  winner: Color | null;

  mode: GameMode;
  aiDifficulty?: AIDifficulty;

  room: GameRoom | null;
  myColor: Color | 'spectator';

  lastMove: Move | null;

  clocks: ClockState;

  promotionPosition?: {
    from: Position;
    to: Position;
  };
}

/* =======================
   UI / VIEW
======================= */

export type View =
  | 'landing'
  | 'auth'
  | 'lobby'
  | 'play'
  | 'puzzles'
  | 'settings';

export interface BoardTheme {
  id: string;
  name: string;
  light: string;
  dark: string;
}

export interface UIState {
  theme: 'light' | 'dark';
  language: Language;
  sidebarCollapsed: boolean;
  view: View;
  boardThemeId: string;
  flippedBoard: boolean; // mobile support
}
