"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ChessPieceComponent } from "@/components/chess-piece"
import type { ChessPiece, Position, Player } from "@/types/chess"
import { cn } from "@/lib/utils"

interface ChessSquareProps {
  piece: ChessPiece | null
  position: Position
  isLight: boolean
  isSelected: boolean
  isValidMove: boolean
  onClick: () => void
  currentPlayer: Player
  isKingInCheck?: boolean
}

export function ChessSquare({
  piece,
  position,
  isLight,
  isSelected,
  isValidMove,
  onClick,
  currentPlayer,
  isKingInCheck,
}: ChessSquareProps) {
  const squareRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isSelected && squareRef.current) {
      gsap.to(squareRef.current, {
        scale: 1.05,
        duration: 0.2,
        ease: "power2.out",
      })
    } else if (squareRef.current) {
      gsap.to(squareRef.current, {
        scale: 1,
        duration: 0.2,
        ease: "power2.out",
      })
    }
  }, [isSelected])

  const handleClick = () => {
    if (squareRef.current) {
      gsap.to(squareRef.current, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      })
    }
    onClick()
  }

  const isKingInCheckOnThisSquare = piece?.type === "king" && isKingInCheck

  // Kiểm tra xem có phải là nước nhập thành không
  const isCastlingMove =
    isValidMove && !piece && (position.col === 2 || position.col === 6) && (position.row === 0 || position.row === 7)

  return (
    <div
      ref={squareRef}
      className={cn(
        "w-16 h-16 flex items-center justify-center cursor-pointer relative transition-all duration-200",
        isLight ? "bg-slate-600 dark:bg-slate-700" : "bg-slate-800 dark:bg-slate-900",
        isSelected && "ring-4 ring-indigo-500 ring-opacity-70",
        isValidMove && "ring-2 ring-green-500 ring-opacity-50",
        isKingInCheckOnThisSquare && "ring-4 ring-red-500 ring-opacity-80 bg-red-900/30",
        isCastlingMove && "ring-2 ring-purple-500 ring-opacity-60",
        "hover:brightness-110",
      )}
      onClick={handleClick}
    >
      {piece && (
        <ChessPieceComponent
          piece={piece}
          isSelected={isSelected}
          canMove={piece.color === currentPlayer}
          isInCheck={isKingInCheckOnThisSquare}
        />
      )}

      {isValidMove && !piece && !isCastlingMove && <div className="w-4 h-4 bg-green-500 rounded-full opacity-60" />}

      {isCastlingMove && (
        <div className="w-6 h-6 border-2 border-purple-500 rounded-full opacity-70 flex items-center justify-center">
          <div className="w-2 h-2 bg-purple-500 rounded-full" />
        </div>
      )}

      {isValidMove && piece && (
        <div className="absolute inset-0 border-4 border-red-500 border-opacity-60 rounded-sm" />
      )}
    </div>
  )
}
