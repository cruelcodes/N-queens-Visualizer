import React, { useState, useRef } from "react";
import Chessboard from "./components/Chessboard";
import { visualSolveNQueens } from "./Solver/visualBacktrack";

export default function App() {
  const [n, setN] = useState(8);
  const [board, setBoard] = useState(
    Array.from({ length: 8 }, () => Array(8).fill(0))
  );
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [steps, setSteps] = useState([]);
  const [snapshots, setSnapshots] = useState([]);

  const shouldStopRef = useRef(false);
  const pauseRef = useRef(false);

  const appendStep = (msg, snapshotBoard) => {
    setSteps((prev) => [...prev, msg]);
    setSnapshots((prev) => [...prev, snapshotBoard.map((row) => [...row])]);
  };

  const reset = () => {
    shouldStopRef.current = true;
    pauseRef.current = false;
    setRunning(false);
    setPaused(false);
    setSteps([]);
    setSnapshots([]);
    setBoard(Array.from({ length: parseInt(n) }, () => Array(parseInt(n)).fill(0)));
  };

  const togglePause = () => {
    pauseRef.current = !pauseRef.current;
    setPaused(pauseRef.current);
  };

  const handleSizeChange = (e) => {
    const val = e.target.value;
    setN(val); // Allow any typing
  };

  const startVisualization = async () => {
    const size = parseInt(n);
    if (!size || size < 4 || size > 12) {
      alert("Board size must be between 4 and 12");
      return;
    }

    setN(size);
    reset();
    await new Promise((res) => setTimeout(res, 100));
    shouldStopRef.current = false;
    setRunning(true);

    await visualSolveNQueens(
      size,
      setBoard,
      (msg) => appendStep(msg, board),
      () => {},
      400,
      shouldStopRef,
      pauseRef
    );

    setRunning(false);
    setPaused(false);
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "Arial",
        backgroundColor: "#1e1e2f",
        color: "white",
        overflow: "hidden",
      }}
    >
      {/* Snapshots Panel */}
      <div
        style={{
          width: "22%",
          padding: "10px",
          overflowY: "auto",
          backgroundColor: "#2a2a3d",
          borderRight: "2px solid #333",
        }}
      >
        <h3 style={{ textAlign: "center", marginBottom: "10px" }}>Snapshots</h3>
        {snapshots.map((snap, i) => (
          <div key={i} style={{ marginBottom: "20px", textAlign: "center" }}>
            <div
              style={{
                width: "100%",
                aspectRatio: "1",
              }}
            >
              <Chessboard board={snap} small />
            </div>
            <p style={{ fontSize: "0.8rem", marginTop: "4px", color: "#bbb" }}>
              Step #{i + 1}
            </p>
            <hr style={{ borderColor: "#444" }} />
          </div>
        ))}
      </div>

      {/* Main Board */}
      <div style={{ flex: 1, padding: "20px", textAlign: "center" }}>
        <h1 style={{ marginBottom: "20px" }}>♛ N-Queens Visualizer</h1>

        <div style={{ marginBottom: "10px" }}>
          <label style={{ marginRight: "10px" }}>
            Size:
            <input
              type="number"
              value={n}
              min={4}
              max={12}
              onChange={handleSizeChange}
              disabled={running}
              style={{
                marginLeft: "5px",
                padding: "4px 8px",
                borderRadius: "4px",
                border: "none",
              }}
            />
          </label>

          <button
            onClick={startVisualization}
            disabled={running}
            style={{
              marginLeft: "10px",
              padding: "6px 16px",
              backgroundColor: "#00c18c",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Start
          </button>

          <button
            onClick={reset}
            style={{
              marginLeft: "10px",
              padding: "6px 16px",
              backgroundColor: "#ff5c5c",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Reset
          </button>

          <button
            onClick={togglePause}
            disabled={!running}
            style={{
              marginLeft: "10px",
              padding: "6px 16px",
              backgroundColor: "#ffc107",
              color: "#000",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {paused ? "Resume" : "Pause"}
          </button>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <Chessboard board={board} />
        </div>
      </div>

      {/* Steps Panel */}
      <div
        style={{
          width: "25%",
          padding: "10px",
          overflowY: "auto",
          backgroundColor: "#2a2a3d",
          borderLeft: "2px solid #333",
        }}
      >
        <h3 style={{ textAlign: "center" }}>Steps</h3>
        <ul style={{ fontSize: "0.9rem", paddingLeft: "18px", color: "#ccc" }}>
          {steps.map((s, i) => (
            <li key={i} style={{ marginBottom: "8px" }}>
              {s}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
