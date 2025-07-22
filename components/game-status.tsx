"use client"

import { motion } from "framer-motion"
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
        return "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/25"
      case "check":
        return "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/25"
      case "stalemate":
        return "bg-gradient-to-r from-yellow-500 to-amber-500 text-black shadow-lg shadow-yellow-500/25"
      default:
        return currentPlayer === "white" 
          ? "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-900 shadow-lg" 
          : "bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-lg"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-slate-900/90 backdrop-blur-xl border-slate-700/50 shadow-2xl ring-1 ring-white/10">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl text-slate-100 font-bold">
          {getStatusIcon()}
          Trạng thái trò chơi
        </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <Badge className={`${getStatusColor()} text-base px-4 py-2 font-semibold`} variant="secondary">
              {getStatusText()}
            </Badge>
          </motion.div>

          {gameStatus === "check" && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-gradient-to-r from-red-900/30 to-red-800/30 rounded-xl border border-red-700/50 backdrop-blur-sm"
            >
              <p className="text-sm text-red-200 font-medium flex items-center gap-2">
                <Swords className="w-4 h-4" />
                Vua đang bị tấn công! Phải di chuyển vua hoặc chặn cuộc tấn công.
              </p>
            </motion.div>
          )}

          {gameStatus === "stalemate" && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-gradient-to-r from-yellow-900/30 to-amber-800/30 rounded-xl border border-yellow-700/50 backdrop-blur-sm"
            >
              <p className="text-sm text-yellow-200 font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Hòa cờ! Không còn nước đi hợp lệ nhưng vua không bị chiếu.
              </p>
            </motion.div>
          )}

          {/* Captured Pieces */}
          <div className="grid grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-800/50 rounded-xl p-4 backdrop-blur-sm border border-slate-700/30"
            >
              <h4 className="text-sm font-bold mb-3 text-slate-200 flex items-center gap-2">
                <div className="w-3 h-3 bg-slate-100 rounded-full"></div>
                Quân trắng bị bắt
              </h4>
              <div className="flex flex-wrap gap-2">
                {capturedPieces.white.map((piece, index) => (
                  <motion.span 
                    key={index} 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-xl text-slate-100 bg-slate-700/50 rounded-lg p-1 shadow-sm"
                  >
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
                  </motion.span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-800/50 rounded-xl p-4 backdrop-blur-sm border border-slate-700/30"
            >
              <h4 className="text-sm font-bold mb-3 text-slate-200 flex items-center gap-2">
                <div className="w-3 h-3 bg-slate-900 rounded-full border border-slate-600"></div>
                Quân đen bị bắt
              </h4>
              <div className="flex flex-wrap gap-2">
                {capturedPieces.black.map((piece, index) => (
                  <motion.span 
                    key={index} 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-xl text-slate-900 bg-slate-300/90 rounded-lg p-1 shadow-sm"
                  >
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
                  </motion.span>
                ))}
              </div>
            </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
