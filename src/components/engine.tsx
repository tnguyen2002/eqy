import { useState } from "react";
import { Chess, Piece, Square, Move, WHITE, BLACK } from "chess.js";
import { Chessboard } from "react-chessboard";
import { PromotionPieceOption } from "react-chessboard/dist/chessboard/types";

interface SquareStyles {
  background: string;
  borderRadius?: string;
}

export default function PlayRandomMoveEngine() {
  const [game, setGame] = useState(new Chess());
  const [moveFrom, setMoveFrom] = useState<Square | null>(null);
  const [moveTo, setMoveTo] = useState<Square | null>(null);
  const [showPromotionDialog, setShowPromotionDialog] = useState(false);
  const [optionSquares, setOptionSquares] = useState({});
  const [pendingPromotion, setPendingPromotion] = useState<{
    from: Square;
    to: Square;
  } | null>(null);

  function getMoveOptions(square: Square) {
    const moves = game.moves({
      square,
      verbose: true,
    });
    if (moves.length === 0) {
      setOptionSquares({});
      return false;
    }
    const newSquares: Partial<Record<Square, SquareStyles>> = {};
    moves.map((move) => {
      newSquares[move.to] = {
        background:
          game.get(move.to) &&
          game.get(move.to)?.color !== game.get(square)?.color
            ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
            : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        borderRadius: "50%",
      };
    });
    newSquares[square] = {
      background: "rgba(255, 255, 0, 0.4)",
    };
    setOptionSquares(newSquares);
    return true;
  }

  function onSquareClick(square: Square) {
    // from square
    if (!moveFrom) {
      const hasMoveOptions = getMoveOptions(square);
      if (hasMoveOptions) setMoveFrom(square);
      return;
    }

    // to square
    if (!moveTo) {
      // check if valid move before showing dialog
      const foundMove = square in optionSquares;
      // not a valid move
      if (!foundMove) {
        const hasMoveOptions = getMoveOptions(square);
        setMoveFrom(hasMoveOptions ? square : null);
        return;
      }

      // valid move
      setMoveTo(square);

      // if promotion move
      const piece = game.get(moveFrom);
      if (
        piece?.type === "p" &&
        ((game.turn() === WHITE && square[1] === "8") ||
          (game.turn() === BLACK && square[1] === "1"))
      ) {
        setShowPromotionDialog(true);
        setPendingPromotion({ from: moveFrom, to: square });
        return;
      }

      // is normal move
      const gameCopy = game;
      const move = gameCopy.move({
        from: moveFrom,
        to: square,
      });

      // if invalid, setMoveFrom and getMoveOptions
      if (move === null) {
        const hasMoveOptions = getMoveOptions(square);
        if (hasMoveOptions) setMoveFrom(square);
        return;
      }
      setGame(gameCopy);
      setMoveFrom(null);
      setMoveTo(null);
      setOptionSquares({});
      return;
    }
  }

  function onPromotionPieceSelect(piece?: PromotionPieceOption) {
    if (!piece || !pendingPromotion) {
      setMoveFrom(null);
      setMoveTo(null);
      setShowPromotionDialog(false);
      setOptionSquares({});
      setPendingPromotion(null);
      return false;
    }

    const { from, to } = pendingPromotion;

    const gameCopy = game;
    const move = gameCopy.move({
      from,
      to,
      promotion: piece[1].toLowerCase(),
    });

    if (!move) {
      console.error("Invalid promotion move");
      return false;
    }

    setGame(gameCopy);
    setMoveFrom(null);
    setMoveTo(null);
    setShowPromotionDialog(false);
    setOptionSquares({});
    setPendingPromotion(null);

    return true;
  }

  return (
    <Chessboard
      id="ClickToMove"
      animationDuration={200}
      arePiecesDraggable={false}
      position={game.fen()}
      onSquareClick={onSquareClick}
      boardWidth={700}
      onPromotionPieceSelect={onPromotionPieceSelect}
      customBoardStyle={{
        borderRadius: "4px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
      }}
      customSquareStyles={{
        ...optionSquares,
      }}
      promotionToSquare={moveTo}
      showPromotionDialog={showPromotionDialog}
    />
  );
}
