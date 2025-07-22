"use client"
import { ChessBoard } from "@/components/chess-board"
import { GameControls } from "@/components/game-controls"
import { GameHistory } from "@/components/game-history"
import { GameStatus } from "@/components/game-status"
import { useChessGame } from "@/hooks/use-chess-game"
import { Card } from "@/components/ui/card"
import { PawnPromotionModal } from "@/components/pawn-promotion-modal"

export function ChessGame() {
  const {
    board,
    currentPlayer,
    selectedSquare,
    validMoves,
    gameStatus,
    moveHistory,
    capturedPieces,
    handleSquareClick,
    resetGame,
    undoMove,
    promotionPosition,
    handlePromotion,
  } = useChessGame()

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Game Area */}
        <div className="lg:col-span-2 space-y-4">
          <GameStatus currentPlayer={currentPlayer} gameStatus={gameStatus} capturedPieces={capturedPieces} />

          <Card className="p-6 bg-slate-800/80 backdrop-blur-sm border-slate-700 shadow-xl">
            <ChessBoard
              board={board}
              selectedSquare={selectedSquare}
              validMoves={validMoves}
              onSquareClick={handleSquareClick}
              currentPlayer={currentPlayer}
              gameStatus={gameStatus}
            />
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-4">
          <GameControls
            onReset={resetGame}
            onUndo={undoMove}
            canUndo={moveHistory.length > 0}
            gameStatus={gameStatus}
          />

          <GameHistory moves={moveHistory} />
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
    </div>
  )
}
