"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import type { ChessPiece } from "@/types/chess";

interface ChessPieceProps {
  piece: ChessPiece;
  isSelected: boolean;
  canMove: boolean;
  isInCheck?: boolean;
}

const pieceSymbols: Record<string, Record<string, string>> = {
  white: {
    king: "♔",
    queen: "♕",
    rook: "♖",
    bishop: "♗",
    knight: "♘",
    pawn: "♙",
  },
  black: {
    king: "♔",
    queen: "♕",
    rook: "♖",
    bishop: "♗",
    knight: "♘",
    pawn: "♙",
  },
};

export function ChessPieceComponent({
  piece,
  isSelected,
  canMove,
  isInCheck,
}: ChessPieceProps) {
  const pieceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pieceRef.current) {
      gsap.fromTo(
        pieceRef.current,
        { scale: 0.5, opacity: 0, rotateY: 180 },
        { scale: 1, opacity: 1, rotateY: 0, duration: 0.4, ease: "back.out(1.7)" }
      );
    }
  }, [piece]);

  useEffect(() => {
    if (isSelected && pieceRef.current) {
      gsap.to(pieceRef.current, {
        y: -6,
        scale: 1.1,
        duration: 0.2,
        ease: "back.out(1.7)",
      });
    } else if (pieceRef.current) {
      gsap.to(pieceRef.current, {
        y: 0,
        scale: 1,
        duration: 0.2,
        ease: "power2.out",
      });
    }
  }, [isSelected]);

  // Add pulsing animation for king in check
  useEffect(() => {
    if (isInCheck && piece.type === "king" && pieceRef.current) {
      gsap.to(pieceRef.current, {
        scale: 1.2,
        duration: 0.5,
        yoyo: true,
        repeat: -1,
        ease: "power2.inOut",
      });
    } else if (pieceRef.current) {
      gsap.killTweensOf(pieceRef.current);
      gsap.set(pieceRef.current, { scale: isSelected ? 1.1 : 1 });
    }
  }, [isInCheck, piece.type]);

  return (
    <motion.div
      ref={pieceRef}
      className={`text-4xl select-none transition-all duration-200 ${
        "text-5xl select-none transition-all duration-300 font-bold",
        canMove ? "cursor-pointer" : "cursor-default",
        isSelected ? "drop-shadow-2xl" : "drop-shadow-lg",
          ? "text-red-300"
          : piece.color === "white"
          ? "text-white"
          : "text-slate-900"
      }`}
      whileHover={canMove ? { scale: 1.1, y: -2 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      style={{
        filter: isSelected
          ? "brightness(1.3) drop-shadow(0 0 15px rgba(59, 130, 246, 0.8))"
          : isInCheck && piece.type === "king"
          ? "brightness(1.4) drop-shadow(0 0 20px rgba(239, 68, 68, 0.9))"
          : "drop-shadow(0 2px 8px rgba(0,0,0,0.5))",
        textShadow:
          isInCheck && piece.type === "king"
            ? "0 0 20px rgba(239, 68, 68, 1), 0 0 40px rgba(239, 68, 68, 0.5)"
            : isSelected
            ? "0 0 15px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.4)"
            : "0 4px 8px rgba(0,0,0,0.6), 0 2px 4px rgba(0,0,0,0.3)",
      }}
    >
      {pieceSymbols[piece.color][piece.type]}
    </motion.div>
  );
}
