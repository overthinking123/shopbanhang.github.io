
import { BoardState, PieceType, Color, Piece, BoardTheme } from './types';

export const COUNTRIES = [
  "Vietnam", "United States", "Norway", "Russia", "India", "China", "France", "Germany", "United Kingdom", "Japan"
];

export const BOARD_THEMES: BoardTheme[] = [
  { id: 'classic', name: 'Chess.com', light: '#ebecd0', dark: '#779556' },
  { id: 'wood', name: 'Walnut', light: '#dcc3a0', dark: '#916d48' },
  { id: 'blue', name: 'Sky', light: '#dee3e6', dark: '#8ca2ad' },
  { id: 'dark', name: 'Charcoal', light: '#d1d1d1', dark: '#6e6e6e' }
];

const createPiece = (type: PieceType, color: Color): Piece => ({
  type,
  color,
  id: `${color}-${type}-${Math.random().toString(36).substr(2, 9)}`
});

export const INITIAL_BOARD: BoardState = [
  [
    createPiece(PieceType.ROOK, 'black'),
    createPiece(PieceType.KNIGHT, 'black'),
    createPiece(PieceType.BISHOP, 'black'),
    createPiece(PieceType.QUEEN, 'black'),
    createPiece(PieceType.KING, 'black'),
    createPiece(PieceType.BISHOP, 'black'),
    createPiece(PieceType.KNIGHT, 'black'),
    createPiece(PieceType.ROOK, 'black'),
  ],
  Array(8).fill(null).map(() => createPiece(PieceType.PAWN, 'black')),
  Array(8).fill(null), Array(8).fill(null), Array(8).fill(null), Array(8).fill(null),
  Array(8).fill(null).map(() => createPiece(PieceType.PAWN, 'white')),
  [
    createPiece(PieceType.ROOK, 'white'),
    createPiece(PieceType.KNIGHT, 'white'),
    createPiece(PieceType.BISHOP, 'white'),
    createPiece(PieceType.QUEEN, 'white'),
    createPiece(PieceType.KING, 'white'),
    createPiece(PieceType.BISHOP, 'white'),
    createPiece(PieceType.KNIGHT, 'white'),
    createPiece(PieceType.ROOK, 'white'),
  ],
];
