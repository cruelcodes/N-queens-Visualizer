export async function visualSolveNQueens(
  n,
  updateBoard,
  logStep,
  saveSnapshot,
  delay = 500,
  shouldStopRef,
  pauseRef
) {
  const board = Array.from({ length: n }, () => Array(n).fill(0));

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function waitWhilePaused() {
    while (pauseRef.current) {
      await sleep(100);
    }
  }

  async function backtrack(row) {
    if (shouldStopRef.current) return false;

    if (row === n) {
      // Final solution snapshot
      saveSnapshot(board.map((r) => [...r]));
      return true;
    }

    for (let col = 0; col < n; col++) {
      if (shouldStopRef.current) return false;

      logStep(`Trying (${row}, ${col})`);
      await waitWhilePaused();

      if (await isSafe(row, col)) {
        board[row][col] = 1;
        logStep(`Placed at (${row}, ${col})`);
        updateBoard(board.map((r) => [...r]));
        saveSnapshot(board); // 👑 Snapshot for placement
        await sleep(delay);
        await waitWhilePaused();

        const result = await backtrack(row + 1);
        if (result) return true;

        board[row][col] = 0;
        logStep(`Backtracking from (${row}, ${col})`);
        updateBoard(board.map((r) => [...r]));
        saveSnapshot(board); // 👑 Snapshot for backtracking
        await sleep(delay);
        await waitWhilePaused();
      }
    }

    return false;
  }

  async function isSafe(row, col) {
    for (let i = 0; i < row; i++) if (board[i][col] === 1) return false;
    for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--)
      if (board[i][j] === 1) return false;
    for (let i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++)
      if (board[i][j] === 1) return false;
    return true;
  }

  await backtrack(0);
}
