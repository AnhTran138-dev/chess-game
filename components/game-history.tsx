"use client"

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
    <Card className="bg-slate-800/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg text-slate-100">
          <History className="w-5 h-5" />
          Lịch sử nước đi
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          {moves.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">Chưa có nước đi nào</p>
          ) : (
            <div className="space-y-1">
              {moves.map((move, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm p-2 rounded hover:bg-slate-700/50"
                >
                  <span className="font-mono text-slate-400">
                    {Math.floor(index / 2) + 1}.{index % 2 === 0 ? "" : ".."}
                  </span>
                  <span className="font-medium text-slate-200">{formatMove(move)}</span>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
