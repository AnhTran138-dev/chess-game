"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { History } from "lucide-react"
import type { Move } from "@/types/chess"

interface GameHistoryProps {
  moves: Move[]
}

export function GameHistory({ moves }: GameHistoryProps) {
  const formatMove = (move: Move) => {
    const fromSquare = `${String.fromCharCode(97 + move.from.col)}${8 - move.from.row}`
    const toSquare = `${String.fromCharCode(97 + move.to.col)}${8 - move.to.row}`
    const pieceSymbol = move.piece.type.charAt(0).toUpperCase()
    const captureSymbol = move.capturedPiece ? "x" : "-"

    return `${pieceSymbol}${fromSquare}${captureSymbol}${toSquare}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="bg-slate-900/90 backdrop-blur-xl border-slate-700/50 shadow-2xl ring-1 ring-white/10">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl text-slate-100 font-bold">
          <History className="w-5 h-5" />
          Lịch sử nước đi
        </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-80">
            {moves.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
              >
                <History className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                <p className="text-sm text-slate-400">Chưa có nước đi nào</p>
              </motion.div>
            ) : (
              <div className="space-y-2">
                {moves.map((move, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between text-sm p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-all duration-200 border border-slate-700/30"
                  >
                    <span className="font-mono text-slate-400 bg-slate-700/50 px-2 py-1 rounded text-xs">
                      {Math.floor(index / 2) + 1}.{index % 2 === 0 ? "" : ".."}
                    </span>
                    <span className="font-semibold text-slate-200 bg-slate-600/30 px-3 py-1 rounded-full">
                      {formatMove(move)}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  )
}
