"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RotateCcw, Undo2, Play } from "lucide-react"
import type { GameStatus } from "@/types/chess"

interface GameControlsProps {
  onReset: () => void
  onUndo: () => void
  canUndo: boolean
  gameStatus: GameStatus
}

export function GameControls({ onReset, onUndo, canUndo, gameStatus }: GameControlsProps) {
  const isGameOver = gameStatus === "checkmate" || gameStatus === "stalemate"

  return (
    <Card className="bg-slate-800/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg text-slate-100">
          <Play className="w-5 h-5" />
          Điều khiển
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          onClick={onReset}
          variant="outline"
          className="w-full bg-transparent border-slate-600 text-slate-200 hover:bg-slate-700"
          size="sm"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Ván mới
        </Button>

        <Button
          onClick={onUndo}
          variant="outline"
          className="w-full bg-transparent border-slate-600 text-slate-200 hover:bg-slate-700"
          size="sm"
          disabled={!canUndo || isGameOver}
        >
          <Undo2 className="w-4 h-4 mr-2" />
          Đi lại
        </Button>
      </CardContent>
    </Card>
  )
}
