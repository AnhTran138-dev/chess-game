"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import type { Position, Player, PieceType } from "@/types/chess"

interface PawnPromotionModalProps {
  position: Position
  color: Player
  onSelect: (pieceType: PieceType) => void
}

const pieceSymbols: Record<string, Record<string, string>> = {
  white: {
    queen: "♕",
    rook: "♖",
    bishop: "♗",
    knight: "♘",
  },
  black: {
    queen: "♛",
    rook: "♜",
    bishop: "♝",
    knight: "♞",
  },
}

export function PawnPromotionModal({ position, color, onSelect }: PawnPromotionModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" },
      )
    }
  }, [])

  const pieces: PieceType[] = ["queen", "rook", "bishop", "knight"]

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-slate-800 p-6 rounded-lg shadow-2xl border border-indigo-500/30 max-w-xs w-full"
      >
        <h3 className="text-xl font-bold text-center mb-4 text-slate-100">Phong cấp tốt</h3>
        <p className="text-slate-300 text-center mb-6">Chọn quân cờ để phong cấp tốt của bạn</p>

        <div className="grid grid-cols-4 gap-4">
          {pieces.map((piece) => (
            <button
              key={piece}
              onClick={() => onSelect(piece)}
              className="flex items-center justify-center p-4 bg-slate-700 hover:bg-indigo-600 rounded-lg transition-colors"
            >
              <span className="text-4xl">{pieceSymbols[color][piece]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
