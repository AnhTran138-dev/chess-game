import type {
  ChessPiece,
  Position,
  Player,
  GameStatus,
  Move,
} from "@/types/chess";

export class ChessEngine {
  getValidMoves(
    board: (ChessPiece | null)[][],
    position: Position,
    currentPlayer: Player,
    lastMove?: Move
  ): Position[] {
    const piece = board[position.row][position.col];
    if (!piece || piece.color !== currentPlayer) return [];

    let moves: Position[] = [];

    switch (piece.type) {
      case "pawn":
        moves = this.getPawnMoves(board, position, piece.color, lastMove);
        break;
      case "rook":
        moves = this.getRookMoves(board, position, piece.color);
        break;
      case "bishop":
        moves = this.getBishopMoves(board, position, piece.color);
        break;
      case "queen":
        moves = this.getQueenMoves(board, position, piece.color);
        break;
      case "king":
        moves = this.getKingMoves(board, position, piece.color);
        // Thêm nước nhập thành cho vua
        moves.push(...this.getCastlingMoves(board, position, piece.color));
        break;
      case "knight":
        moves = this.getKnightMoves(board, position, piece.color);
        break;
      default:
        moves = [];
    }

    // Lọc ra những nước đi không làm vua bị chiếu
    return moves.filter(
      (move) =>
        !this.wouldKingBeInCheckAfterMove(
          board,
          position,
          move,
          currentPlayer,
          lastMove
        )
    );
  }

  // Kiểm tra nước nhập thành
  private getCastlingMoves(
    board: (ChessPiece | null)[][],
    kingPos: Position,
    color: Player
  ): Position[] {
    const moves: Position[] = [];
    const king = board[kingPos.row][kingPos.col];

    // Kiểm tra vua đã di chuyển chưa
    if (!king || king.hasMoved || this.isKingInCheck(board, color)) {
      return moves;
    }

    const row = color === "white" ? 7 : 0;

    // Nhập thành phía vua (kingside castling)
    if (this.canCastleKingside(board, color, row)) {
      moves.push({ row, col: 6 });
    }

    // Nhập thành phía hậu (queenside castling)
    if (this.canCastleQueenside(board, color, row)) {
      moves.push({ row, col: 2 });
    }

    return moves;
  }

  // Kiểm tra nhập thành phía vua
  private canCastleKingside(
    board: (ChessPiece | null)[][],
    color: Player,
    row: number
  ): boolean {
    // Kiểm tra xe phía vua
    const rook = board[row][7];
    if (
      !rook ||
      rook.type !== "rook" ||
      rook.color !== color ||
      rook.hasMoved
    ) {
      return false;
    }

    // Kiểm tra các ô giữa vua và xe phải trống
    for (let col = 5; col <= 6; col++) {
      if (board[row][col] !== null) {
        return false;
      }
    }

    // Kiểm tra vua không bị chiếu khi di chuyển qua các ô
    for (let col = 4; col <= 6; col++) {
      if (this.isSquareUnderAttack(board, { row, col }, color)) {
        return false;
      }
    }

    return true;
  }

  // Kiểm tra nhập thành phía hậu
  private canCastleQueenside(
    board: (ChessPiece | null)[][],
    color: Player,
    row: number
  ): boolean {
    // Kiểm tra xe phía hậu
    const rook = board[row][0];
    if (
      !rook ||
      rook.type !== "rook" ||
      rook.color !== color ||
      rook.hasMoved
    ) {
      return false;
    }

    // Kiểm tra các ô giữa vua và xe phải trống
    for (let col = 1; col <= 3; col++) {
      if (board[row][col] !== null) {
        return false;
      }
    }

    // Kiểm tra vua không bị chiếu khi di chuyển qua các ô (không cần kiểm tra ô b1/b8)
    for (let col = 2; col <= 4; col++) {
      if (this.isSquareUnderAttack(board, { row, col }, color)) {
        return false;
      }
    }

    return true;
  }

  // Kiểm tra một ô có bị tấn công không
  private isSquareUnderAttack(
    board: (ChessPiece | null)[][],
    position: Position,
    defendingColor: Player
  ): boolean {
    const attackingColor: Player =
      defendingColor === "white" ? "black" : "white";

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && piece.color === attackingColor) {
          if (this.canPieceAttackSquare(board, { row, col }, position, piece)) {
            return true;
          }
        }
      }
    }

    return false;
  }

  // Thực hiện nước nhập thành
  executeCastling(
    board: (ChessPiece | null)[][],
    kingPos: Position,
    newKingPos: Position
  ): (ChessPiece | null)[][] {
    const newBoard = board.map((row) => [...row]);
    const king = newBoard[kingPos.row][kingPos.col]!;
    const row = kingPos.row;

    // Di chuyển vua
    newBoard[newKingPos.row][newKingPos.col] = { ...king, hasMoved: true };
    newBoard[kingPos.row][kingPos.col] = null;

    // Di chuyển xe tương ứng
    if (newKingPos.col === 6) {
      // Nhập thành phía vua
      const rook = newBoard[row][7]!;
      newBoard[row][5] = { ...rook, hasMoved: true };
      newBoard[row][7] = null;
    } else if (newKingPos.col === 2) {
      // Nhập thành phía hậu
      const rook = newBoard[row][0]!;
      newBoard[row][3] = { ...rook, hasMoved: true };
      newBoard[row][0] = null;
    }

    return newBoard;
  }

  // Kiểm tra xem nước đi có phải là nhập thành không
  isCastlingMove(
    board: (ChessPiece | null)[][],
    from: Position,
    to: Position
  ): boolean {
    const piece = board[from.row][from.col];
    if (!piece || piece.type !== "king") return false;

    const colDiff = Math.abs(to.col - from.col);
    return colDiff === 2;
  }

  // Kiểm tra xem nước đi có làm vua bị chiếu không
  private wouldKingBeInCheckAfterMove(
    board: (ChessPiece | null)[][],
    from: Position,
    to: Position,
    playerColor: Player,
    lastMove?: Move
  ): boolean {
    // Kiểm tra nước nhập thành
    if (this.isCastlingMove(board, from, to)) {
      const testBoard = this.executeCastling(board, from, to);
      return this.isKingInCheck(testBoard, playerColor);
    }

    // Kiểm tra nước bắt tốt qua đường
    if (lastMove && this.isEnPassantMove(board, from, to, lastMove)) {
      const testBoard = this.executeEnPassant(board, from, to, lastMove);
      return this.isKingInCheck(testBoard, playerColor);
    }

    // Tạo bản sao bàn cờ để thử nước đi thường
    const testBoard = board.map((row) => [...row]);
    const piece = testBoard[from.row][from.col];

    // Thực hiện nước đi trên bàn cờ thử nghiệm
    testBoard[to.row][to.col] = piece;
    testBoard[from.row][from.col] = null;

    // Kiểm tra xem vua có bị chiếu sau nước đi này không
    return this.isKingInCheck(testBoard, playerColor);
  }

  private getPawnMoves(
    board: (ChessPiece | null)[][],
    position: Position,
    color: Player,
    lastMove?: Move
  ): Position[] {
    const moves: Position[] = [];
    const direction = color === "white" ? -1 : 1;
    const startRow = color === "white" ? 6 : 1;
    const { row, col } = position;

    // Forward move
    if (
      this.isValidPosition(row + direction, col) &&
      !board[row + direction][col]
    ) {
      moves.push({ row: row + direction, col });

      // Double move from starting position
      if (row === startRow && !board[row + 2 * direction][col]) {
        moves.push({ row: row + 2 * direction, col });
      }
    }

    // Diagonal captures
    for (const deltaCol of [-1, 1]) {
      const newRow = row + direction;
      const newCol = col + deltaCol;

      if (this.isValidPosition(newRow, newCol)) {
        const targetPiece = board[newRow][newCol];
        if (targetPiece && targetPiece.color !== color) {
          moves.push({ row: newRow, col: newCol });
        }
      }
    }

    // En passant capture - BẮT TỐT QUA ĐƯỜNG
    // ĐÂY KHÔNG PHẢI LÀ "ĂN NGANG"! Đây là nước bắt CHÉO đặc biệt:
    // - Quân tốt đối phương vừa di chuyển 2 ô từ vị trí ban đầu
    // - Quân tốt của ta đứng cạnh quân tốt đối phương (cùng hàng ngang)
    // - Ta di chuyển CHÉO đến ô trống phía sau quân tốt đối phương
    // - Quân tốt đối phương bị loại bỏ khỏi bàn cờ
    if (
      lastMove &&
      this.canCaptureEnPassant(board, position, color, lastMove)
    ) {
      const enPassantMoves = this.getEnPassantMoves(
        board,
        position,
        color,
        lastMove
      );
      moves.push(...enPassantMoves);
    }

    return moves;
  }

  private getRookMoves(
    board: (ChessPiece | null)[][],
    position: Position,
    color: Player
  ): Position[] {
    const moves: Position[] = [];
    const directions = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ];

    for (const [deltaRow, deltaCol] of directions) {
      let newRow = position.row + deltaRow;
      let newCol = position.col + deltaCol;

      while (this.isValidPosition(newRow, newCol)) {
        const targetPiece = board[newRow][newCol];

        if (!targetPiece) {
          moves.push({ row: newRow, col: newCol });
        } else {
          if (targetPiece.color !== color) {
            moves.push({ row: newRow, col: newCol });
          }
          break;
        }

        newRow += deltaRow;
        newCol += deltaCol;
      }
    }

    return moves;
  }

  private getBishopMoves(
    board: (ChessPiece | null)[][],
    position: Position,
    color: Player
  ): Position[] {
    const moves: Position[] = [];
    const directions = [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ];

    for (const [deltaRow, deltaCol] of directions) {
      let newRow = position.row + deltaRow;
      let newCol = position.col + deltaCol;

      while (this.isValidPosition(newRow, newCol)) {
        const targetPiece = board[newRow][newCol];

        if (!targetPiece) {
          moves.push({ row: newRow, col: newCol });
        } else {
          if (targetPiece.color !== color) {
            moves.push({ row: newRow, col: newCol });
          }
          break;
        }

        newRow += deltaRow;
        newCol += deltaCol;
      }
    }

    return moves;
  }

  private getQueenMoves(
    board: (ChessPiece | null)[][],
    position: Position,
    color: Player
  ): Position[] {
    return [
      ...this.getRookMoves(board, position, color),
      ...this.getBishopMoves(board, position, color),
    ];
  }

  private getKingMoves(
    board: (ChessPiece | null)[][],
    position: Position,
    color: Player
  ): Position[] {
    const moves: Position[] = [];
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    for (const [deltaRow, deltaCol] of directions) {
      const newRow = position.row + deltaRow;
      const newCol = position.col + deltaCol;

      if (this.isValidPosition(newRow, newCol)) {
        const targetPiece = board[newRow][newCol];
        if (!targetPiece || targetPiece.color !== color) {
          moves.push({ row: newRow, col: newCol });
        }
      }
    }

    return moves;
  }

  private getKnightMoves(
    board: (ChessPiece | null)[][],
    position: Position,
    color: Player
  ): Position[] {
    const moves: Position[] = [];
    const knightMoves = [
      [-2, -1],
      [-2, 1],
      [-1, -2],
      [-1, 2],
      [1, -2],
      [1, 2],
      [2, -1],
      [2, 1],
    ];

    for (const [deltaRow, deltaCol] of knightMoves) {
      const newRow = position.row + deltaRow;
      const newCol = position.col + deltaCol;

      if (this.isValidPosition(newRow, newCol)) {
        const targetPiece = board[newRow][newCol];
        if (!targetPiece || targetPiece.color !== color) {
          moves.push({ row: newRow, col: newCol });
        }
      }
    }

    return moves;
  }

  // Kiểm tra xem có thể bắt tốt qua đường không
  private canCaptureEnPassant(
    board: (ChessPiece | null)[][],
    position: Position,
    color: Player,
    lastMove: Move
  ): boolean {
    // Chỉ tốt mới có thể thực hiện bắt tốt qua đường
    const piece = board[position.row][position.col];
    if (!piece || piece.type !== "pawn") return false;

    // Tốt phải ở hàng thứ 5 (đối với trắng - index 3) hoặc hàng thứ 4 (đối với đen - index 4)
    const expectedRow = color === "white" ? 3 : 4;
    if (position.row !== expectedRow) return false;

    // Nước đi cuối cùng phải là tốt đối phương di chuyển 2 ô từ vị trí ban đầu
    if (lastMove.piece.type !== "pawn" || lastMove.piece.color === color)
      return false;

    // Kiểm tra nước đi có phải là di chuyển 2 ô không
    const moveDistance = Math.abs(lastMove.to.row - lastMove.from.row);
    if (moveDistance !== 2) return false;

    // Kiểm tra tốt đối phương có di chuyển từ vị trí ban đầu không
    const opponentStartRow = lastMove.piece.color === "white" ? 6 : 1;
    if (lastMove.from.row !== opponentStartRow) return false;

    // Tốt đối phương phải ở cạnh tốt hiện tại (cùng hàng ngang)
    if (lastMove.to.row !== position.row) return false;
    const colDistance = Math.abs(lastMove.to.col - position.col);
    if (colDistance !== 1) return false;

    return true;
  }

  // Lấy các nước đi bắt tốt qua đường
  // LƯU Ý: En passant KHÔNG phải là "ăn ngang" - đây là nước bắt CHÉO đặc biệt
  // Quân tốt di chuyển chéo để bắt quân tốt đối phương đã di chuyển 2 ô
  private getEnPassantMoves(
    board: (ChessPiece | null)[][],
    position: Position,
    color: Player,
    lastMove: Move
  ): Position[] {
    const moves: Position[] = [];
    const direction = color === "white" ? -1 : 1;

    // Vị trí đích của nước bắt tốt qua đường (di chuyển CHÉO)
    const enPassantRow = position.row + direction; // Di chuyển về phía trước
    const enPassantCol = lastMove.to.col; // Cột của quân tốt đối phương

    // Đảm bảo vị trí đích hợp lệ và là ô trống
    if (
      this.isValidPosition(enPassantRow, enPassantCol) &&
      board[enPassantRow][enPassantCol] === null
    ) {
      moves.push({ row: enPassantRow, col: enPassantCol });
    }

    return moves;
  }

  // Kiểm tra xem nước đi có phải là bắt tốt qua đường không
  isEnPassantMove(
    board: (ChessPiece | null)[][],
    from: Position,
    to: Position,
    lastMove?: Move
  ): boolean {
    const piece = board[from.row][from.col];
    if (!piece || piece.type !== "pawn" || !lastMove) return false;

    // Kiểm tra điều kiện bắt tốt qua đường
    if (!this.canCaptureEnPassant(board, from, piece.color, lastMove))
      return false;

    // Kiểm tra nước đi có khớp với vị trí bắt tốt qua đường không
    const direction = piece.color === "white" ? -1 : 1;
    const expectedRow = from.row + direction;
    const expectedCol = lastMove.to.col;

    return to.row === expectedRow && to.col === expectedCol;
  }

  // Thực hiện nước đi bắt tốt qua đường
  executeEnPassant(
    board: (ChessPiece | null)[][],
    from: Position,
    to: Position,
    lastMove: Move
  ): (ChessPiece | null)[][] {
    const newBoard = board.map((row) => [...row]);
    const movingPiece = newBoard[from.row][from.col]!;

    // Di chuyển tốt đến vị trí mới
    newBoard[to.row][to.col] = { ...movingPiece, hasMoved: true };
    newBoard[from.row][from.col] = null;

    // Loại bỏ tốt bị bắt
    newBoard[lastMove.to.row][lastMove.to.col] = null;

    return newBoard;
  }

  private isValidPosition(row: number, col: number): boolean {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
  }

  getGameStatus(
    board: (ChessPiece | null)[][],
    currentPlayer: Player,
    lastMove?: Move
  ): GameStatus {
    const isInCheck = this.isKingInCheck(board, currentPlayer);
    const hasValidMoves = this.hasValidMoves(board, currentPlayer, lastMove);

    if (isInCheck && !hasValidMoves) {
      return "checkmate";
    } else if (!hasValidMoves) {
      return "stalemate";
    } else if (isInCheck) {
      return "check";
    }

    return "playing";
  }

  isKingInCheck(board: (ChessPiece | null)[][], playerColor: Player): boolean {
    // Find the king
    let kingPosition: Position | null = null;
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && piece.type === "king" && piece.color === playerColor) {
          kingPosition = { row, col };
          break;
        }
      }
      if (kingPosition) break;
    }

    if (!kingPosition) return false;

    // Check if any opponent piece can attack the king
    const opponentColor: Player = playerColor === "white" ? "black" : "white";

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && piece.color === opponentColor) {
          if (
            this.canPieceAttackSquare(board, { row, col }, kingPosition, piece)
          ) {
            return true;
          }
        }
      }
    }

    return false;
  }

  private hasValidMoves(
    board: (ChessPiece | null)[][],
    playerColor: Player,
    lastMove?: Move
  ): boolean {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && piece.color === playerColor) {
          const moves = this.getValidMoves(
            board,
            { row, col },
            playerColor,
            lastMove
          );
          if (moves.length > 0) {
            return true;
          }
        }
      }
    }
    return false;
  }

  // Kiểm tra xem một quân cờ có thể tấn công một ô cụ thể không
  private canPieceAttackSquare(
    board: (ChessPiece | null)[][],
    piecePos: Position,
    targetPos: Position,
    piece: ChessPiece
  ): boolean {
    const { row: fromRow, col: fromCol } = piecePos;
    const { row: toRow, col: toCol } = targetPos;

    switch (piece.type) {
      case "pawn":
        const direction = piece.color === "white" ? -1 : 1;
        return fromRow + direction === toRow && Math.abs(fromCol - toCol) === 1;

      case "rook":
        return (
          (fromRow === toRow || fromCol === toCol) &&
          this.isPathClear(board, piecePos, targetPos)
        );

      case "bishop":
        return (
          Math.abs(fromRow - toRow) === Math.abs(fromCol - toCol) &&
          this.isPathClear(board, piecePos, targetPos)
        );

      case "queen":
        return (
          (fromRow === toRow ||
            fromCol === toCol ||
            Math.abs(fromRow - toRow) === Math.abs(fromCol - toCol)) &&
          this.isPathClear(board, piecePos, targetPos)
        );

      case "king":
        return Math.abs(fromRow - toRow) <= 1 && Math.abs(fromCol - toCol) <= 1;

      case "knight":
        const rowDiff = Math.abs(fromRow - toRow);
        const colDiff = Math.abs(fromCol - toCol);
        return (
          (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)
        );

      default:
        return false;
    }
  }

  private isPathClear(
    board: (ChessPiece | null)[][],
    from: Position,
    to: Position
  ): boolean {
    const rowDiff = to.row - from.row;
    const colDiff = to.col - from.col;

    const rowStep = rowDiff === 0 ? 0 : rowDiff / Math.abs(rowDiff);
    const colStep = colDiff === 0 ? 0 : colDiff / Math.abs(colDiff);

    let currentRow = from.row + rowStep;
    let currentCol = from.col + colStep;

    while (currentRow !== to.row || currentCol !== to.col) {
      if (board[currentRow][currentCol] !== null) {
        return false;
      }
      currentRow += rowStep;
      currentCol += colStep;
    }

    return true;
  }

  // Lấy tất cả các nước đi có thể của một người chơi (không kiểm tra chiếu)
  getAllPossibleMoves(
    board: (ChessPiece | null)[][],
    playerColor: Player,
    lastMove?: Move
  ): Position[] {
    const allMoves: Position[] = [];

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && piece.color === playerColor) {
          const pieceMoves = this.getRawMoves(
            board,
            { row, col },
            piece,
            lastMove
          );
          allMoves.push(...pieceMoves);
        }
      }
    }

    return allMoves;
  }

  // Lấy nước đi thô (không kiểm tra chiếu)
  private getRawMoves(
    board: (ChessPiece | null)[][],
    position: Position,
    piece: ChessPiece,
    lastMove?: Move
  ): Position[] {
    switch (piece.type) {
      case "pawn":
        return this.getPawnMoves(board, position, piece.color, lastMove);
      case "rook":
        return this.getRookMoves(board, position, piece.color);
      case "bishop":
        return this.getBishopMoves(board, position, piece.color);
      case "queen":
        return this.getQueenMoves(board, position, piece.color);
      case "king":
        return this.getKingMoves(board, position, piece.color);
      case "knight":
        return this.getKnightMoves(board, position, piece.color);
      default:
        return [];
    }
  }
}
