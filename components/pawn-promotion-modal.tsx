"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import type { Position, Player, PieceType } from "@/types/chess";

interface PawnPromotionModalProps {
  position: Position;
  color: Player;
  onSelect: (pieceType: PieceType) => void;
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
};

export function PawnPromotionModal({
  position,
  color,
  onSelect,
}: PawnPromotionModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { scale: 0.5, opacity: 0, rotateY: 90 },
        {
          scale: 1,
          opacity: 1,
          rotateY: 0,
          duration: 0.5,
          ease: "back.out(1.7)",
        }
      );
    }
  }, []);

  const pieces: PieceType[] = ["queen", "rook", "bishop", "knight"];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50"
    >
      <motion.div
        ref={modalRef}
        className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl shadow-2xl border border-blue-500/30 max-w-sm w-full mx-4 ring-1 ring-white/10"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <div className="text-center mb-4 sm:mb-6">
          <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Phong cấp tốt
          </h3>
          <p className="text-sm sm:text-base text-slate-300">
            Chọn quân cờ để phong cấp tốt của bạn
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-4">
          {pieces.map((piece) => (
            <motion.button
              key={piece}
              onClick={() => onSelect(piece)}
              className="flex flex-col items-center justify-center p-3 sm:p-6 bg-gradient-to-br from-slate-700 to-slate-800 hover:from-blue-600 hover:to-purple-600 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 border border-slate-600/50 hover:border-blue-500/50"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: pieces.indexOf(piece) * 0.1 }}
            >
              <span className="text-3xl sm:text-5xl mb-1 sm:mb-2 drop-shadow-lg">
                {pieceSymbols[color][piece]}
              </span>
              <span className="text-xs text-slate-300 font-medium capitalize">
                {piece}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
