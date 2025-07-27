import React, { useState, useRef } from "react";
import Chessboard from "./components/Chessboard";
import './App.css';
import { visualSolveNQueens } from "./Solver/visualBacktrack";

export default function App() {
  const [n, setN] = useState(8);
  const [board, setBoard] = useState(Array.from({ length: 8 }, () => Array(8).fill(0)));
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [steps, setSteps] = useState([]);
  const [snapshots, setSnapshots] = useState([]);

  const shouldStopRef = useRef(false);
  const pauseRef = useRef(false);
  const solverPromiseRef = useRef(null);

  const appendStep = (msg, snapshotBoard) => {
    setSteps((prev) => [...prev, msg]);
    setSnapshots((prev) => [...prev, snapshotBoard.map((row) => [...row])]);
  };

  const reset = async () => {
    shouldStopRef.current = true;
    pauseRef.current = false;

    if (solverPromiseRef.current) {
      await solverPromiseRef.current; // Wait for ongoing solver to cleanly exit
    }

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
    setN(e.target.value);
  };

  const startVisualization = async () => {
    const size = parseInt(n);
    if (!size || size < 4 || size > 12) {
      alert("Board size must be between 4 and 12");
      return;
    }

    setN(size);
    await reset();
    await new Promise((res) => setTimeout(res, 100)); // Let UI reset

    shouldStopRef.current = false;
    setRunning(true);

    solverPromiseRef.current = visualSolveNQueens(
      size,
      setBoard,
      appendStep,
      () => {},
      400,
      shouldStopRef,
      pauseRef
    );

    await solverPromiseRef.current;

    setRunning(false);
    setPaused(false);
  };

  return (
    <div className="app-container">
      {/* Snapshots Panel */}
      <div className="panel snapshots-panel">
        <h3 className="panel-title">Snapshots</h3>
        {snapshots.map((snap, i) => (
          <div key={i} className="snapshot-container">
            <div className="snapshot-board">
              <Chessboard board={snap} small />
            </div>
            <p className="step-label">Step #{i + 1}</p>
            <hr className="divider" />
          </div>
        ))}
      </div>

      {/* Main Board */}
      <div className="main-panel">
        <h1>♛ N-Queens Visualizer</h1>

        <div className="controls">
          <label>
            Size:
            <input
              type="number"
              value={n}
              min={4}
              max={12}
              onChange={handleSizeChange}
              disabled={running}
              className="input-box"
            />
          </label>

          <button onClick={startVisualization} disabled={running} className="btn start">
            Start
          </button>

          <button onClick={reset} className="btn reset">
            Reset
          </button>

          <button onClick={togglePause} disabled={!running} className="btn pause">
            {paused ? "Resume" : "Pause"}
          </button>
        </div>

        <div className="main-board">
          <Chessboard board={board} />
        </div>
      </div>

      {/* Steps Panel */}
      <div className="panel steps-panel">
        <h3 className="panel-title">Steps</h3>
        <ul className="steps-list">
          {steps.map((s, i) => (
            <li key={i} className="step-item">
              {s}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
