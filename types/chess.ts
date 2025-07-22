export type Player = "white" | "black";
export type PieceType =
  | "king"
  | "queen"
  | "rook"
  | "bishop"
  | "knight"
  | "pawn";
export type GameStatus = "playing" | "check" | "checkmate" | "stalemate";

export interface Position {
  row: number;
  col: number;
}

export interface ChessPiece {
  type: PieceType;
  color: Player;
  hasMoved?: boolean;
}

export interface Move {
  from: Position;
  to: Position;
  piece: ChessPiece;
  capturedPiece?: ChessPiece;
  timestamp: Date;
  promotedTo?: PieceType;
  isEnPassant?: boolean;
}

export interface GameState {
  board: (ChessPiece | null)[][];
  currentPlayer: Player;
  gameStatus: GameStatus;
  moveHistory: Move[];
  capturedPieces: {
    white: ChessPiece[];
    black: ChessPiece[];
  };
  timer?: {
    white: number; // thời gian còn lại tính bằng milliseconds
    black: number;
    increment: number; // thời gian tăng thêm sau mỗi nước đi (Fischer increment)
    isActive: boolean;
  };
}

export type TimeControl = {
  name: string;
  initialTime: number; // phút
  increment: number; // giây
  description: string;
};

export const TIME_CONTROLS: TimeControl[] = [
  { name: "Blitz 3+2", initialTime: 3, increment: 2, description: "3 phút + 2 giây/nước" },
  { name: "Blitz 5+3", initialTime: 5, increment: 3, description: "5 phút + 3 giây/nước" },
  { name: "Rapid 10+5", initialTime: 10, increment: 5, description: "10 phút + 5 giây/nước" },
  { name: "Rapid 15+10", initialTime: 15, increment: 10, description: "15 phút + 10 giây/nước" },
  { name: "Classical 30+0", initialTime: 30, increment: 0, description: "30 phút không tăng thêm" },
  { name: "Unlimited", initialTime: 0, increment: 0, description: "Không giới hạn thời gian" },
];