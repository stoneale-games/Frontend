import React from "react";
import gameBoard from "@/assets/board.png";
interface GameBoardProps {
  children?: React.ReactNode;
  className?: string;
}

const GameBoard: React.FC<GameBoardProps> = ({ children, className = "" }) => {
  return (
    <div
      className={`relative flex items-center justify-center w-full h-full ${className}`}
      style={{ minHeight: 400 }}
    >
      <img
        src={gameBoard}
        alt="Poker Board"
        className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
      />
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default GameBoard;

