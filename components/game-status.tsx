"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Player, GameStatus as GameStatusType, ChessPiece } from "@/types/chess"
import { Crown, Swords, Trophy, AlertTriangle } from "lucide-react"

interface GameStatusProps {
  currentPlayer: Player
  gameStatus: GameStatusType
  capturedPieces: {
    white: ChessPiece[]
    black: ChessPiece[]
  }
}

export function GameStatus({ currentPlayer, gameStatus, capturedPieces }: GameStatusProps) {
  const getStatusIcon = () => {
    switch (gameStatus) {
      case "checkmate":
        return <Trophy className="w-5 h-5" />
      case "check":
        return <Swords className="w-5 h-5" />
      case "stalemate":
        return <AlertTriangle className="w-5 h-5" />
      default:
        return <Crown className="w-5 h-5" />
    }
  }

  const getStatusText = () => {
    switch (gameStatus) {
      case "checkmate":
        const winner = currentPlayer === "white" ? "Đen" : "Trắng"
        return `Chiếu bí! ${winner} thắng!`
      case "stalemate":
        return "Hòa cờ! Không còn nước đi hợp lệ."
      case "check":
        const playerInCheck = currentPlayer === "white" ? "Trắng" : "Đen"
        return `${playerInCheck} đang bị chiếu!`
      default:
        const currentPlayerName = currentPlayer === "white" ? "Trắng" : "Đen"
        return `Lượt của ${currentPlayerName}`
    }
  }

  const getStatusColor = () => {
    switch (gameStatus) {
      case "checkmate":
        return "bg-green-500 text-white"
      case "check":
        return "bg-red-500 text-white"
      case "stalemate":
        return "bg-yellow-500 text-black"
      default:
        return currentPlayer === "white" ? "bg-slate-100 text-slate-900" : "bg-slate-800 text-white"
    }
  }

  return (
    <Card className="bg-slate-800/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg text-slate-100">
          {getStatusIcon()}
          Trạng thái trò chơi
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Badge className={`${getStatusColor()} text-sm px-3 py-1`} variant="secondary">
          {getStatusText()}
        </Badge>

        {gameStatus === "check" && (
          <div className="p-3 bg-red-900/20 rounded-lg border border-red-800">
            <p className="text-sm text-red-300 font-medium">
              ⚠️ Vua đang bị tấn công! Phải di chuyển vua hoặc chặn cuộc tấn công.
            </p>
          </div>
        )}

        {gameStatus === "stalemate" && (
          <div className="p-3 bg-yellow-900/20 rounded-lg border border-yellow-800">
            <p className="text-sm text-yellow-300 font-medium">
              🤝 Hòa cờ! Không còn nước đi hợp lệ nhưng vua không bị chiếu.
            </p>
          </div>
        )}

        {/* Captured Pieces */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium mb-2 text-slate-300">Quân trắng bị bắt</h4>
            <div className="flex flex-wrap gap-1">
              {capturedPieces.white.map((piece, index) => (
                <span key={index} className="text-lg text-slate-100">
                  {piece.type === "king"
                    ? "♚"
                    : piece.type === "queen"
                      ? "♛"
                      : piece.type === "rook"
                        ? "♜"
                        : piece.type === "bishop"
                          ? "♝"
                          : piece.type === "knight"
                            ? "♞"
                            : "♟"}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2 text-slate-300">Quân đen bị bắt</h4>
            <div className="flex flex-wrap gap-1">
              {capturedPieces.black.map((piece, index) => (
                <span key={index} className="text-lg text-slate-900">
                  {piece.type === "king"
                    ? "♔"
                    : piece.type === "queen"
                      ? "♕"
                      : piece.type === "rook"
                        ? "♖"
                        : piece.type === "bishop"
                          ? "♗"
                          : piece.type === "knight"
                            ? "♘"
                            : "♙"}
                </span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
