"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ChessSquare } from "@/components/chess-square";
import type { ChessPiece, Position, Player, GameStatus } from "@/types/chess";

interface ChessBoardProps {
  board: (ChessPiece | null)[][];
  selectedSquare: Position | null;
  validMoves: Position[];
  onSquareClick: (position: Position) => void;
  currentPlayer: Player;
  gameStatus: GameStatus;
}

export function ChessBoard({
  board,
  selectedSquare,
  validMoves,
  onSquareClick,
  currentPlayer,
  gameStatus,
}: ChessBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (boardRef.current) {
      gsap.fromTo(
        boardRef.current,
        { scale: 0.9, opacity: 0, rotateY: 10 },
        { scale: 1, opacity: 1, rotateY: 0, duration: 0.8, ease: "power3.out" }
      );
    }
  }, []);

  // Hiệu ứng khi chiếu bí
  useEffect(() => {
    if (gameStatus === "checkmate" && overlayRef.current) {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: "power2.inOut" }
      );
    }
  }, [gameStatus]);

  const isSquareSelected = (row: number, col: number) => {
    return selectedSquare?.row === row && selectedSquare?.col === col;
  };

  const isValidMove = (row: number, col: number) => {
    return validMoves.some((move) => move.row === row && move.col === col);
  };

  const isSquareLight = (row: number, col: number) => {
    return (row + col) % 2 === 0;
  };

  // Check if the king at this position is in check
  const isKingInCheck = (row: number, col: number) => {
    const piece = board[row][col];
    return (
      piece?.type === "king" &&
      piece.color === currentPlayer &&
      gameStatus === "check"
    );
  };

  return (
    <motion.div
      ref={boardRef}
      className="inline-block p-6 bg-gradient-to-br from-slate-800/50 via-slate-900/50 to-slate-950/50 backdrop-blur-xl rounded-2xl shadow-2xl relative border border-slate-700/30 ring-1 ring-white/5"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Decorative corners */}
      <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-blue-400/50 rounded-tl-lg" />
      <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-blue-400/50 rounded-tr-lg" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-blue-400/50 rounded-bl-lg" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-blue-400/50 rounded-br-lg" />

      {/* Overlay khi chiếu bí */}
      {gameStatus === "checkmate" && (
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-gradient-to-r from-red-900/60 to-purple-900/60 backdrop-blur-md rounded-2xl z-10 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-black/80 p-8 rounded-xl text-center backdrop-blur-sm border border-red-500/50 shadow-2xl"
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-3">
              Chiếu Bí!
            </h2>
            <p className="text-xl text-red-300 font-medium">
              {currentPlayer === "white" ? "Đen" : "Trắng"} đã chiến thắng
            </p>
          </motion.div>
        </div>
      )}

      {/* Row numbers on the left */}
      <div className="flex">
        <div className="flex flex-col justify-around mr-1 sm:mr-2 md:mr-3 h-[320px] sm:h-[384px] md:h-[512px]">
          {[8, 7, 6, 5, 4, 3, 2, 1].map((number) => (
            <span
              key={number}
              className="text-xs sm:text-sm font-bold text-slate-300 bg-slate-800/50 rounded px-1 sm:px-2 py-0.5 sm:py-1"
            >
              {number}
            </span>
          ))}
        </div>

        <div>
          <div className="grid grid-cols-8 gap-0 border-4 border-slate-600/50 rounded-xl overflow-hidden shadow-inner bg-gradient-to-br from-slate-700/20 to-slate-800/20">
            {board.map((row, rowIndex) =>
              row.map((piece, colIndex) => (
                <ChessSquare
                  key={`${rowIndex}-${colIndex}`}
                  piece={piece}
                  position={{ row: rowIndex, col: colIndex }}
                  isLight={isSquareLight(rowIndex, colIndex)}
                  isSelected={isSquareSelected(rowIndex, colIndex)}
                  isValidMove={isValidMove(rowIndex, colIndex)}
                  onClick={() =>
                    onSquareClick({ row: rowIndex, col: colIndex })
                  }
                  currentPlayer={currentPlayer}
                  isKingInCheck={isKingInCheck(rowIndex, colIndex)}
                />
              ))
            )}
          </div>

          {/* Board coordinates */}
          <div className="flex justify-between mt-1 sm:mt-2 md:mt-3 px-1 sm:px-2">
            {["a", "b", "c", "d", "e", "f", "g", "h"].map((letter) => (
              <span
                key={letter}
                className="text-xs sm:text-sm font-bold text-slate-300 bg-slate-800/50 rounded px-1 sm:px-2 py-0.5 sm:py-1"
              >
                {letter}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
