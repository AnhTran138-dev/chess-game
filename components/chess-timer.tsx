"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Play, Pause, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Player } from "@/types/chess";

interface ChessTimerProps {
  whiteTime: number;
  blackTime: number;
  currentPlayer: Player;
  isActive: boolean;
  formatTime: (timeMs: number) => string;
  onTimeUp?: (player: Player) => void;
}

export function ChessTimer({
  whiteTime,
  blackTime,
  currentPlayer,
  isActive,
  formatTime,
  onTimeUp,
}: ChessTimerProps) {
  const whiteTimeRef = useRef(whiteTime);
  const blackTimeRef = useRef(blackTime);

  useEffect(() => {
    whiteTimeRef.current = whiteTime;
    blackTimeRef.current = blackTime;

    // Kiểm tra hết thời gian
    if (whiteTime <= 0 && onTimeUp) {
      onTimeUp("white");
    } else if (blackTime <= 0 && onTimeUp) {
      onTimeUp("black");
    }
  }, [whiteTime, blackTime, onTimeUp]);

  const isLowTime = (time: number) => time < 30000; // Dưới 30 giây
  const isCriticalTime = (time: number) => time < 10000; // Dưới 10 giây

  return (
    <div className="space-y-4">
      {/* Black Timer */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card
          className={cn(
            "relative overflow-hidden transition-all duration-300",
            currentPlayer === "black" && isActive
              ? "bg-gradient-to-r from-slate-800 to-slate-900 ring-2 ring-blue-400 shadow-lg shadow-blue-400/25"
              : "bg-slate-900/90 border-slate-700/50",
            isCriticalTime(blackTime) && currentPlayer === "black" && isActive
              ? "ring-red-400 shadow-red-400/25 animate-pulse"
              : isLowTime(blackTime) && currentPlayer === "black" && isActive
              ? "ring-yellow-400 shadow-yellow-400/25"
              : ""
          )}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-slate-900 rounded-full border-2 border-slate-600" />
                <span className="text-sm font-medium text-slate-200">Đen</span>
                {currentPlayer === "black" && isActive && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Play className="w-4 h-4 text-blue-400" />
                  </motion.div>
                )}
              </div>
              
              <div className="text-right">
                <div
                  className={cn(
                    "text-2xl font-mono font-bold transition-colors",
                    isCriticalTime(blackTime)
                      ? "text-red-400"
                      : isLowTime(blackTime)
                      ? "text-yellow-400"
                      : "text-slate-100"
                  )}
                >
                  {formatTime(blackTime)}
                </div>
                
                {isLowTime(blackTime) && (
                  <Badge
                    variant="destructive"
                    className="text-xs mt-1"
                  >
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {isCriticalTime(blackTime) ? "Nguy hiểm!" : "Sắp hết giờ"}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
          
          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
            <motion.div
              className={cn(
                "h-full transition-colors",
                isCriticalTime(blackTime)
                  ? "bg-red-400"
                  : isLowTime(blackTime)
                  ? "bg-yellow-400"
                  : "bg-blue-400"
              )}
              initial={{ width: "100%" }}
              animate={{
                width: `${Math.max(0, (blackTime / (15 * 60 * 1000)) * 100)}%`,
              }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </Card>
      </motion.div>

      {/* Timer Status */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex justify-center"
      >
        <Badge
          variant="outline"
          className={cn(
            "px-4 py-2 text-sm font-medium",
            isActive
              ? "bg-green-500/20 border-green-500/50 text-green-400"
              : "bg-slate-700/50 border-slate-600/50 text-slate-400"
          )}
        >
          <Clock className="w-4 h-4 mr-2" />
          {isActive ? "Đang chạy" : "Tạm dừng"}
        </Badge>
      </motion.div>

      {/* White Timer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card
          className={cn(
            "relative overflow-hidden transition-all duration-300",
            currentPlayer === "white" && isActive
              ? "bg-gradient-to-r from-slate-100 to-slate-200 ring-2 ring-blue-400 shadow-lg shadow-blue-400/25"
              : "bg-slate-100/90 border-slate-300/50",
            isCriticalTime(whiteTime) && currentPlayer === "white" && isActive
              ? "ring-red-400 shadow-red-400/25 animate-pulse"
              : isLowTime(whiteTime) && currentPlayer === "white" && isActive
              ? "ring-yellow-400 shadow-yellow-400/25"
              : ""
          )}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-white rounded-full border-2 border-slate-400" />
                <span className="text-sm font-medium text-slate-800">Trắng</span>
                {currentPlayer === "white" && isActive && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Play className="w-4 h-4 text-blue-600" />
                  </motion.div>
                )}
              </div>
              
              <div className="text-right">
                <div
                  className={cn(
                    "text-2xl font-mono font-bold transition-colors",
                    isCriticalTime(whiteTime)
                      ? "text-red-600"
                      : isLowTime(whiteTime)
                      ? "text-yellow-600"
                      : "text-slate-900"
                  )}
                >
                  {formatTime(whiteTime)}
                </div>
                
                {isLowTime(whiteTime) && (
                  <Badge
                    variant="destructive"
                    className="text-xs mt-1"
                  >
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {isCriticalTime(whiteTime) ? "Nguy hiểm!" : "Sắp hết giờ"}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
          
          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-300">
            <motion.div
              className={cn(
                "h-full transition-colors",
                isCriticalTime(whiteTime)
                  ? "bg-red-500"
                  : isLowTime(whiteTime)
                  ? "bg-yellow-500"
                  : "bg-blue-500"
              )}
              initial={{ width: "100%" }}
              animate={{
                width: `${Math.max(0, (whiteTime / (15 * 60 * 1000)) * 100)}%`,
              }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </Card>
      </motion.div>
    </div>
  );
}