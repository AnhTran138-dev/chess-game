"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Zap, Timer, Trophy, Infinity } from "lucide-react";
import { TIME_CONTROLS, type TimeControl } from "@/types/chess";

interface TimeControlSelectorProps {
  selectedTimeControl: TimeControl | null;
  onSelect: (timeControl: TimeControl) => void;
  onStart: () => void;
  disabled?: boolean;
}

export function TimeControlSelector({
  selectedTimeControl,
  onSelect,
  onStart,
  disabled = false,
}: TimeControlSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(!selectedTimeControl);

  const getTimeControlIcon = (timeControl: TimeControl) => {
    if (timeControl.initialTime === 0) return <Infinity className="w-4 h-4" />;
    if (timeControl.initialTime <= 5) return <Zap className="w-4 h-4" />;
    if (timeControl.initialTime <= 15) return <Timer className="w-4 h-4" />;
    return <Trophy className="w-4 h-4" />;
  };

  const getTimeControlColor = (timeControl: TimeControl) => {
    if (timeControl.initialTime === 0) return "bg-gradient-to-r from-purple-500 to-indigo-500";
    if (timeControl.initialTime <= 5) return "bg-gradient-to-r from-red-500 to-orange-500";
    if (timeControl.initialTime <= 15) return "bg-gradient-to-r from-yellow-500 to-amber-500";
    return "bg-gradient-to-r from-green-500 to-emerald-500";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-slate-900/90 backdrop-blur-xl border-slate-700/50 shadow-2xl ring-1 ring-white/10">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl text-slate-100 font-bold">
            <Clock className="w-5 h-5" />
            Chế độ thời gian
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Selected Time Control Display */}
          {selectedTimeControl && !isExpanded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getTimeControlIcon(selectedTimeControl)}
                  <div>
                    <h3 className="font-semibold text-slate-100">
                      {selectedTimeControl.name}
                    </h3>
                    <p className="text-sm text-slate-300">
                      {selectedTimeControl.description}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsExpanded(true)}
                  className="text-slate-300 border-slate-600 hover:bg-slate-700"
                >
                  Thay đổi
                </Button>
              </div>
            </motion.div>
          )}

          {/* Time Control Options */}
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              <div className="grid grid-cols-1 gap-3">
                {TIME_CONTROLS.map((timeControl, index) => (
                  <motion.button
                    key={timeControl.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => {
                      onSelect(timeControl);
                      setIsExpanded(false);
                    }}
                    disabled={disabled}
                    className={`
                      p-4 rounded-xl text-left transition-all duration-300 border-2
                      ${
                        selectedTimeControl?.name === timeControl.name
                          ? "border-blue-500 bg-blue-500/20 shadow-lg shadow-blue-500/25"
                          : "border-slate-600/50 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-700/50"
                      }
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${getTimeControlColor(
                            timeControl
                          )} text-white`}
                        >
                          {getTimeControlIcon(timeControl)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-100">
                            {timeControl.name}
                          </h3>
                          <p className="text-sm text-slate-400">
                            {timeControl.description}
                          </p>
                        </div>
                      </div>
                      
                      {timeControl.initialTime > 0 && (
                        <Badge
                          variant="outline"
                          className="text-slate-300 border-slate-600"
                        >
                          {timeControl.initialTime}m
                          {timeControl.increment > 0 && ` +${timeControl.increment}s`}
                        </Badge>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Start Button */}
          {selectedTimeControl && !isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                onClick={onStart}
                disabled={disabled}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 shadow-lg hover:shadow-green-500/25 transition-all duration-300"
                size="lg"
              >
                <Clock className="w-5 h-5 mr-2" />
                Bắt đầu với {selectedTimeControl.name}
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}