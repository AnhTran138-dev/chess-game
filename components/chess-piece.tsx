"use client";

import { useEffect, useRef } from "react";
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
        { scale: 0.8 },
        { scale: 1, duration: 0.2, ease: "back.out(1.2)" }
      );
    }
  }, [piece]);

  useEffect(() => {
    if (isSelected && pieceRef.current) {
      gsap.to(pieceRef.current, {
        y: -4,
        duration: 0.2,
        ease: "power2.out",
      });
    } else if (pieceRef.current) {
      gsap.to(pieceRef.current, {
        y: 0,
        duration: 0.2,
        ease: "power2.out",
      });
    }
  }, [isSelected]);

  // Add pulsing animation for king in check
  useEffect(() => {
    if (isInCheck && piece.type === "king" && pieceRef.current) {
      gsap.to(pieceRef.current, {
        scale: 1.1,
        duration: 0.5,
        yoyo: true,
        repeat: -1,
        ease: "power2.inOut",
      });
    } else if (pieceRef.current) {
      gsap.killTweensOf(pieceRef.current);
      gsap.set(pieceRef.current, { scale: 1 });
    }
  }, [isInCheck, piece.type]);

  return (
    <div
      ref={pieceRef}
      className={`text-4xl select-none transition-all duration-200 ${
        canMove ? "cursor-pointer hover:scale-110" : "cursor-default"
      } ${isSelected ? "drop-shadow-lg" : ""} ${
        isInCheck && piece.type === "king"
          ? "text-red-400"
          : piece.color === "white"
          ? "text-slate-100"
          : "text-slate-950"
      }`}
      style={{
        filter: isSelected
          ? "brightness(1.2)"
          : isInCheck && piece.type === "king"
          ? "brightness(1.3)"
          : "none",
        textShadow:
          isInCheck && piece.type === "king"
            ? "0 0 10px rgba(239, 68, 68, 0.8), 2px 2px 4px rgba(0,0,0,0.3)"
            : "2px 2px 4px rgba(0,0,0,0.3)",
        transform: "rotate(0deg)",
        opacity: 1, // Đảm bảo quân cờ luôn hiển thị
      }}
    >
      {pieceSymbols[piece.color][piece.type]}
    </div>
  );
}
