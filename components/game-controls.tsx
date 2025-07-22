"use client"

import { motion } from "framer-motion"
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
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-slate-900/90 backdrop-blur-xl border-slate-700/50 shadow-2xl ring-1 ring-white/10">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl text-slate-100 font-bold">
          <Play className="w-5 h-5" />
          Điều khiển
        </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={onReset}
              variant="outline"
              className="w-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/50 text-slate-100 hover:bg-gradient-to-r hover:from-blue-600/30 hover:to-purple-600/30 hover:border-blue-400/70 shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
              size="lg"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Ván mới
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: canUndo && !isGameOver ? 1.02 : 1 }}
            whileTap={{ scale: canUndo && !isGameOver ? 0.98 : 1 }}
          >
            <Button
              onClick={onUndo}
              variant="outline"
              className="w-full bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border-emerald-500/50 text-slate-100 hover:bg-gradient-to-r hover:from-emerald-600/30 hover:to-teal-600/30 hover:border-emerald-400/70 shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
              size="lg"
              disabled={!canUndo || isGameOver}
            >
              <Undo2 className="w-5 h-5 mr-2" />
              Đi lại
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
