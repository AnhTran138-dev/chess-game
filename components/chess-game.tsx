"use client";
import { motion } from "framer-motion";
import { ChessBoard } from "@/components/chess-board";
import { GameControls } from "@/components/game-controls";
import { GameHistory } from "@/components/game-history";
import { GameStatus } from "@/components/game-status";
import { ChessTimer } from "@/components/chess-timer";
import { TimeControlSelector } from "@/components/time-control-selector";
import { useChessGame } from "@/hooks/use-chess-game";
import { Card } from "@/components/ui/card";
import { PawnPromotionModal } from "@/components/pawn-promotion-modal";

export function ChessGame() {
  const {
    board,
    currentPlayer,
    selectedSquare,
    validMoves,
    gameStatus,
    moveHistory,
    capturedPieces,
    timer,
    handleSquareClick,
    resetGame,
    undoMove,
    promotionPosition,
    handlePromotion,
    selectedTimeControl,
    isTimerEnabled,
    initializeTimer,
    startTimer,
    pauseTimer,
    formatTime,
  } = useChessGame();

  const gameStarted = moveHistory.length > 0 || (timer?.isActive ?? false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="container mx-auto p-4 max-w-8xl relative z-10"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-2">
          Chess Master
        </h1>
        <p className="text-slate-400 text-lg">Trải nghiệm cờ vua đỉnh cao</p>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Timer & Time Control */}
        <div className="xl:col-span-1 space-y-4 xl:space-y-6">
          {!gameStarted && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <TimeControlSelector
                selectedTimeControl={selectedTimeControl}
                onSelect={initializeTimer}
                onStart={startTimer}
                disabled={gameStarted}
              />
            </motion.div>
          )}

          {isTimerEnabled && timer && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <ChessTimer
                whiteTime={timer.white}
                blackTime={timer.black}
                currentPlayer={currentPlayer}
                isActive={timer.isActive}
                formatTime={formatTime}
              />
            </motion.div>
          )}
        </div>

        {/* Main Game Area */}
        <div className="xl:col-span-3 space-y-4 xl:space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <GameStatus
              currentPlayer={currentPlayer}
              gameStatus={gameStatus}
              capturedPieces={capturedPieces}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="p-2 sm:p-4 md:p-6 bg-slate-900/90 backdrop-blur-xl border-slate-700/50 shadow-2xl ring-1 ring-white/10">
              <div className="flex justify-center">
                <ChessBoard
                  board={board}
                  selectedSquare={selectedSquare}
                  validMoves={validMoves}
                  onSquareClick={handleSquareClick}
                  currentPlayer={currentPlayer}
                  gameStatus={gameStatus}
                />
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Side Panel */}
        <div className="xl:col-span-1 space-y-4 xl:space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <GameControls
              onReset={resetGame}
              onUndo={undoMove}
              canUndo={moveHistory.length > 0}
              gameStatus={gameStatus}
              timer={timer}
              onPauseTimer={pauseTimer}
              onStartTimer={startTimer}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <GameHistory moves={moveHistory} />
          </motion.div>
        </div>
      </div>

      {/* Pawn Promotion Modal */}
      {promotionPosition && (
        <PawnPromotionModal
          position={promotionPosition}
          color={currentPlayer === "white" ? "black" : "white"}
          onSelect={handlePromotion}
        />
      )}
    </motion.div>
  );
}
