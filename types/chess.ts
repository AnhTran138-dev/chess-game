export type Player = "white" | "black"
export type PieceType = "king" | "queen" | "rook" | "bishop" | "knight" | "pawn"
export type GameStatus = "playing" | "check" | "checkmate" | "stalemate"

export interface Position {
  row: number
  col: number
}

export interface ChessPiece {
  type: PieceType
  color: Player
  hasMoved?: boolean
}

export interface Move {
  from: Position
  to: Position
  piece: ChessPiece
  capturedPiece?: ChessPiece
  timestamp: Date
  promotedTo?: PieceType
}

export interface GameState {
  board: (ChessPiece | null)[][]
  currentPlayer: Player
  gameStatus: GameStatus
  moveHistory: Move[]
  capturedPieces: {
    white: ChessPiece[]
    black: ChessPiece[]
  }
}
