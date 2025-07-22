"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
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
        scale: 1.08,
        duration: 0.2,
        ease: "back.out(1.7)",
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
    <motion.div
      ref={squareRef}
      className={cn(
        "w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 flex items-center justify-center cursor-pointer relative transition-all duration-300",
        isLight 
          ? "bg-gradient-to-br from-amber-100 to-amber-200 dark:from-slate-300 dark:to-slate-400" 
          : "bg-gradient-to-br from-amber-800 to-amber-900 dark:from-slate-700 dark:to-slate-800",
        isSelected && "ring-4 ring-blue-400 ring-opacity-80 shadow-lg shadow-blue-400/25",
        isValidMove && "ring-2 ring-emerald-400 ring-opacity-70 shadow-md shadow-emerald-400/20",
        isKingInCheckOnThisSquare && "ring-4 ring-red-400 ring-opacity-90 bg-red-900/40 shadow-lg shadow-red-400/30",
        isCastlingMove && "ring-2 ring-purple-400 ring-opacity-70 shadow-md shadow-purple-400/20",
        "hover:brightness-110 hover:shadow-lg",
      )}
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {piece && (
        <ChessPieceComponent
          piece={piece}
          isSelected={isSelected}
          canMove={piece.color === currentPlayer}
          isInCheck={isKingInCheckOnThisSquare}
        />
      )}

      {isValidMove && !piece && !isCastlingMove && (
        <motion.div 
          className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-emerald-400 rounded-full shadow-lg"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
        />
      )}

      {isCastlingMove && (
        <motion.div 
          className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 border-2 border-purple-400 rounded-full flex items-center justify-center shadow-lg"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
        >
          <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-purple-400 rounded-full" />
        </motion.div>
      )}

      {isValidMove && piece && (
        <motion.div 
          className="absolute inset-0 border-4 border-red-400 border-opacity-80 rounded-sm shadow-lg shadow-red-400/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.div>
  )
}
