"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import type {
  ChessPiece,
  Position,
  Player,
  Move,
  GameState,
  PieceType,
  TimeControl,
} from "@/types/chess";
import { ChessEngine } from "@/lib/chess-engine";

const initialBoard = (): (ChessPiece | null)[][] => {
  const board: (ChessPiece | null)[][] = Array(8)
    .fill(null)
    .map(() => Array(8).fill(null));

  // Place pawns
  for (let col = 0; col < 8; col++) {
    board[1][col] = { type: "pawn", color: "black" };
    board[6][col] = { type: "pawn", color: "white" };
  }

  // Place other pieces
  const pieceOrder: ChessPiece["type"][] = [
    "rook",
    "knight",
    "bishop",
    "queen",
    "king",
    "bishop",
    "knight",
    "rook",
  ];

  for (let col = 0; col < 8; col++) {
    board[0][col] = { type: pieceOrder[col], color: "black" };
    board[7][col] = { type: pieceOrder[col], color: "white" };
  }

  return board;
};

export function useChessGame() {
  const [gameState, setGameState] = useState<GameState>({
    board: initialBoard(),
    currentPlayer: "white",
    gameStatus: "playing",
    moveHistory: [],
    capturedPieces: { white: [], black: [] },
  });

  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null);
  const [validMoves, setValidMoves] = useState<Position[]>([]);
  const [promotionPosition, setPromotionPosition] = useState<Position | null>(
    null
  );
  const [pendingMove, setPendingMove] = useState<{
    from: Position;
    to: Position;
  } | null>(null);
  const [selectedTimeControl, setSelectedTimeControl] = useState<TimeControl | null>(null);
  const [isTimerEnabled, setIsTimerEnabled] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateRef = useRef<number>(Date.now());

  const chessEngine = useMemo(() => new ChessEngine(), []);

  // Timer effect
  useEffect(() => {
    if (!isTimerEnabled || !gameState.timer?.isActive || gameState.gameStatus !== "playing") {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastUpdateRef.current;
      lastUpdateRef.current = now;

      setGameState(prevState => {
        if (!prevState.timer) return prevState;

        const newTimer = { ...prevState.timer };
        const currentPlayerTime = newTimer[prevState.currentPlayer];
        
        if (currentPlayerTime <= 0) {
          // Hết thời gian
          return {
            ...prevState,
            gameStatus: "checkmate", // Người chơi hết thời gian thua
            timer: {
              ...newTimer,
              isActive: false,
            }
          };
        }

        newTimer[prevState.currentPlayer] = Math.max(0, currentPlayerTime - elapsed);

        return {
          ...prevState,
          timer: newTimer,
        };
      });
    }, 100); // Cập nhật mỗi 100ms để hiển thị mượt

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isTimerEnabled, gameState.timer?.isActive, gameState.gameStatus]);

  // Khởi tạo timer khi chọn time control
  const initializeTimer = useCallback((timeControl: TimeControl) => {
    if (timeControl.initialTime === 0) {
      // Unlimited time
      setIsTimerEnabled(false);
      setGameState(prevState => ({
        ...prevState,
        timer: undefined,
      }));
    } else {
      const initialTimeMs = timeControl.initialTime * 60 * 1000;
      setIsTimerEnabled(true);
      setGameState(prevState => ({
        ...prevState,
        timer: {
          white: initialTimeMs,
          black: initialTimeMs,
          increment: timeControl.increment * 1000, // Convert to milliseconds
          isActive: false, // Sẽ được kích hoạt khi bắt đầu game
        },
      }));
    }
    setSelectedTimeControl(timeControl);
  }, []);

  // Bắt đầu timer
  const startTimer = useCallback(() => {
    if (gameState.timer) {
      setGameState(prevState => ({
        ...prevState,
        timer: prevState.timer ? {
          ...prevState.timer,
          isActive: true,
        } : undefined,
      }));
      lastUpdateRef.current = Date.now();
    }
  }, [gameState.timer]);

  // Tạm dừng timer
  const pauseTimer = useCallback(() => {
    if (gameState.timer) {
      setGameState(prevState => ({
        ...prevState,
        timer: prevState.timer ? {
          ...prevState.timer,
          isActive: false,
        } : undefined,
      }));
    }
  }, [gameState.timer]);

  // Kiểm tra xem tốt có thể phong cấp không
  const canPromotePawn = (piece: ChessPiece, position: Position): boolean => {
    if (piece.type !== "pawn") return false;
    return (
      (piece.color === "white" && position.row === 0) ||
      (piece.color === "black" && position.row === 7)
    );
  };

  // Xử lý phong cấp tốt
  const handlePromotion = useCallback(
    (pieceType: PieceType) => {
      if (!pendingMove || !promotionPosition) return;

      const { from, to } = pendingMove;
      const movingPiece = gameState.board[from.row][from.col]!;
      const capturedPiece = gameState.board[to.row][to.col];

      // Tạo bàn cờ mới với quân đã phong cấp
      const newBoard = gameState.board.map((row) => [...row]);
      newBoard[to.row][to.col] = {
        type: pieceType,
        color: movingPiece.color,
        hasMoved: true,
      };
      newBoard[from.row][from.col] = null;

      // Tạo bản ghi nước đi
      const move: Move = {
        from,
        to,
        piece: movingPiece,
        capturedPiece: capturedPiece || undefined,
        timestamp: new Date(),
        promotedTo: pieceType,
      };

      // Cập nhật quân bị bắt
      const newCapturedPieces = { ...gameState.capturedPieces };
      if (capturedPiece) {
        newCapturedPieces[capturedPiece.color].push(capturedPiece);
      }

      // Kiểm tra trạng thái trò chơi
      const nextPlayer: Player =
        gameState.currentPlayer === "white" ? "black" : "white";
      const newGameStatus = chessEngine.getGameStatus(newBoard, nextPlayer);

      // Cập nhật timer nếu có
      let newTimer = gameState.timer;
      if (newTimer && newTimer.isActive) {
        newTimer = {
          ...newTimer,
          [gameState.currentPlayer]: newTimer[gameState.currentPlayer] + newTimer.increment,
        };
      }

      setGameState({
        board: newBoard,
        currentPlayer: nextPlayer,
        gameStatus: newGameStatus,
        moveHistory: [...gameState.moveHistory, move],
        capturedPieces: newCapturedPieces,
        timer: newTimer,
      });

      // Reset các state
      setPromotionPosition(null);
      setPendingMove(null);
      setSelectedSquare(null);
      setValidMoves([]);
    },
    [gameState, pendingMove, promotionPosition, chessEngine]
  );

  const handleSquareClick = useCallback(
    (position: Position) => {
      // Nếu trò chơi đã kết thúc, không cho phép di chuyển
      if (
        gameState.gameStatus === "checkmate" ||
        gameState.gameStatus === "stalemate"
      ) {
        return;
      }

      const piece = gameState.board[position.row][position.col];

      // If no square is selected
      if (!selectedSquare) {
        if (piece && piece.color === gameState.currentPlayer) {
          setSelectedSquare(position);
          const lastMove =
            gameState.moveHistory[gameState.moveHistory.length - 1];
          const moves = chessEngine.getValidMoves(
            gameState.board,
            position,
            gameState.currentPlayer,
            lastMove
          );
          setValidMoves(moves);
        }
        return;
      }

      // If clicking the same square, deselect
      if (
        selectedSquare.row === position.row &&
        selectedSquare.col === position.col
      ) {
        setSelectedSquare(null);
        setValidMoves([]);
        return;
      }

      // If clicking a valid move
      const isValidMove = validMoves.some(
        (move) => move.row === position.row && move.col === position.col
      );

      if (isValidMove) {
        const movingPiece =
          gameState.board[selectedSquare.row][selectedSquare.col]!;

        // Kiểm tra phong cấp tốt
        if (canPromotePawn(movingPiece, position)) {
          setPromotionPosition(position);
          setPendingMove({ from: selectedSquare, to: position });
          return;
        }

        const capturedPiece = gameState.board[position.row][position.col];
        const lastMove =
          gameState.moveHistory[gameState.moveHistory.length - 1];
        let newBoard: (ChessPiece | null)[][];
        let isEnPassant = false;
        let enPassantCapturedPiece: ChessPiece | null = null;

        // Kiểm tra nước nhập thành
        if (
          chessEngine.isCastlingMove(gameState.board, selectedSquare, position)
        ) {
          newBoard = chessEngine.executeCastling(
            gameState.board,
            selectedSquare,
            position
          );
        } else if (
          lastMove &&
          chessEngine.isEnPassantMove(
            gameState.board,
            selectedSquare,
            position,
            lastMove
          )
        ) {
          // Nước đi bắt tốt qua đường
          isEnPassant = true;
          enPassantCapturedPiece =
            gameState.board[lastMove.to.row][lastMove.to.col];
          newBoard = chessEngine.executeEnPassant(
            gameState.board,
            selectedSquare,
            position,
            lastMove
          );
        } else {
          // Nước đi thường
          newBoard = gameState.board.map((row) => [...row]);
          newBoard[position.row][position.col] = {
            ...movingPiece,
            hasMoved: true,
          };
          newBoard[selectedSquare.row][selectedSquare.col] = null;
        }

        // Create move record
        const move: Move = {
          from: selectedSquare,
          to: position,
          piece: movingPiece,
          capturedPiece: isEnPassant
            ? enPassantCapturedPiece || undefined
            : capturedPiece || undefined,
          timestamp: new Date(),
          isEnPassant,
        };

        // Update captured pieces
        const newCapturedPieces = { ...gameState.capturedPieces };
        const actualCapturedPiece = isEnPassant
          ? enPassantCapturedPiece
          : capturedPiece;
        if (actualCapturedPiece) {
          newCapturedPieces[actualCapturedPiece.color].push(
            actualCapturedPiece
          );
        }

        // Check game status
        const nextPlayer: Player =
          gameState.currentPlayer === "white" ? "black" : "white";
        const newGameStatus = chessEngine.getGameStatus(
          newBoard,
        // Cập nhật timer nếu có
        let newTimer = gameState.timer;
        if (newTimer && newTimer.isActive) {
          newTimer = {
            ...newTimer,
            [gameState.currentPlayer]: newTimer[gameState.currentPlayer] + newTimer.increment,
          };
        }

          nextPlayer,
          move
        );

        setGameState({
          board: newBoard,
          currentPlayer: nextPlayer,
          gameStatus: newGameStatus,
          moveHistory: [...gameState.moveHistory, move],
          capturedPieces: newCapturedPieces,
          timer: newTimer,
        });

        setSelectedSquare(null);
        setValidMoves([]);
      } else if (piece && piece.color === gameState.currentPlayer) {
        // Select new piece
        setSelectedSquare(position);
        const lastMove =
          gameState.moveHistory[gameState.moveHistory.length - 1];
        const moves = chessEngine.getValidMoves(
          gameState.board,
          position,
          gameState.currentPlayer,
          lastMove
        );
        setValidMoves(moves);
      } else {
        // Invalid move, deselect
        setSelectedSquare(null);
        setValidMoves([]);
      }
    },
    [gameState, selectedSquare, validMoves, chessEngine]
  );

  const resetGame = useCallback(() => {
    setGameState({
      board: initialBoard(),
      currentPlayer: "white",
      gameStatus: "playing",
      moveHistory: [],
      capturedPieces: { white: [], black: [] },
      timer: selectedTimeControl && selectedTimeControl.initialTime > 0 ? {
        white: selectedTimeControl.initialTime * 60 * 1000,
        black: selectedTimeControl.initialTime * 60 * 1000,
        increment: selectedTimeControl.increment * 1000,
        isActive: false,
      } : undefined,
    });
    setSelectedSquare(null);
    setValidMoves([]);
    setPromotionPosition(null);
    setPendingMove(null);
  }, [selectedTimeControl]);

  const undoMove = useCallback(() => {
    if (gameState.moveHistory.length === 0) return;

    const lastMove = gameState.moveHistory[gameState.moveHistory.length - 1];
    const newBoard = gameState.board.map((row) => [...row]);

    // Kiểm tra xem có phải là nước nhập thành không
    const wasCastling = chessEngine.isCastlingMove(
      gameState.board,
      lastMove.from,
      lastMove.to
    );

    if (wasCastling) {
      // Hoàn tác nhập thành
      const king = newBoard[lastMove.to.row][lastMove.to.col]!;
      const row = lastMove.to.row;

      // Đưa vua về vị trí ban đầu
      newBoard[lastMove.from.row][lastMove.from.col] = {
        ...king,
        hasMoved: false,
      };
      newBoard[lastMove.to.row][lastMove.to.col] = null;

      // Đưa xe về vị trí ban đầu
      if (lastMove.to.col === 6) {
        // Nhập thành phía vua
        const rook = newBoard[row][5]!;
        newBoard[row][7] = { ...rook, hasMoved: false };
        newBoard[row][5] = null;
      } else if (lastMove.to.col === 2) {
        // Nhập thành phía hậu
        const rook = newBoard[row][3]!;
        newBoard[row][0] = { ...rook, hasMoved: false };
        newBoard[row][3] = null;
      }
    } else if (lastMove.isEnPassant) {
      // Hoàn tác bắt tốt qua đường
      // Đưa tốt về vị trí ban đầu
      newBoard[lastMove.from.row][lastMove.from.col] = lastMove.piece;
      newBoard[lastMove.to.row][lastMove.to.col] = null;

      // Khôi phục tốt bị bắt về vị trí của nó
      if (lastMove.capturedPiece) {
        const capturedPawnRow =
          lastMove.piece.color === "white"
            ? lastMove.to.row + 1
            : lastMove.to.row - 1;
        newBoard[capturedPawnRow][lastMove.to.col] = lastMove.capturedPiece;
      }
    } else if (lastMove.promotedTo) {
      // Hoàn tác phong cấp tốt
      newBoard[lastMove.from.row][lastMove.from.col] = {
        type: "pawn",
        color: lastMove.piece.color,
        hasMoved: lastMove.piece.hasMoved,
      };
      newBoard[lastMove.to.row][lastMove.to.col] =
        lastMove.capturedPiece || null;
    } else {
      // Hoàn tác nước đi thường
      newBoard[lastMove.from.row][lastMove.from.col] = lastMove.piece;
      newBoard[lastMove.to.row][lastMove.to.col] =
        lastMove.capturedPiece || null;
    }

    // Remove captured piece from captured pieces
    const newCapturedPieces = { ...gameState.capturedPieces };
    if (lastMove.capturedPiece) {
      const capturedArray = newCapturedPieces[lastMove.capturedPiece.color];
      const index = capturedArray.findIndex(
        (p) => p.type === lastMove.capturedPiece!.type
      );
      if (index > -1) {
        capturedArray.splice(index, 1);
      }
    }

    const previousPlayer: Player =
      gameState.currentPlayer === "white" ? "black" : "white";

    setGameState({
      board: newBoard,
      currentPlayer: previousPlayer,
      gameStatus: "playing",
      moveHistory: gameState.moveHistory.slice(0, -1),
      capturedPieces: newCapturedPieces,
    });

    setSelectedSquare(null);
    setValidMoves([]);
  }, [gameState, chessEngine]);

  // Format thời gian hiển thị
  const formatTime = useCallback((timeMs: number): string => {
    if (timeMs <= 0) return "0:00";
    
    const totalSeconds = Math.ceil(timeMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    if (minutes > 0) {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `0:${seconds.toString().padStart(2, '0')}`;
    }
  }, []);

  return {
    board: gameState.board,
    currentPlayer: gameState.currentPlayer,
    gameStatus: gameState.gameStatus,
    moveHistory: gameState.moveHistory,
    capturedPieces: gameState.capturedPieces,
    timer: gameState.timer,
    selectedSquare,
    validMoves,
    handleSquareClick,
    resetGame,
    undoMove,
    promotionPosition,
    handlePromotion,
    // Timer functions
    selectedTimeControl,
    isTimerEnabled,
    initializeTimer,
    startTimer,
    pauseTimer,
    formatTime,
  };
}
