import React from "react";
import "./Chessboard.css";

export default function Chessboard({ board, small = false }) {
  const size = board.length;

  return (
    <div
      className="board"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${size}, 1fr)`,
        gridTemplateRows: `repeat(${size}, 1fr)`,
        width: small ? "100%" : "500px",
        height: small ? "100%" : "500px",
        maxWidth: "100%",
        maxHeight: "100%",
      }}
    >
      {board.map((row, i) =>
        row.map((cell, j) => (
          <div
            key={`${i}-${j}`}
            className={`cell ${(i + j) % 2 === 0 ? "white" : "black"}`}
            style={{
              fontSize: small ? "22px" : "36px",  // Bigger font in both cases
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {cell === 1 && <span className="queen">♛</span>}
          </div>
        ))
      )}
    </div>
  );
}
