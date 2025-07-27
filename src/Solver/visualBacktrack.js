export async function visualSolveNQueens(
  n,
  updateBoard,
  appendStep,
  _,
  delay = 500,
  shouldStopRef,
  pauseRef
) {
  const board = Array.from({ length: n }, () => Array(n).fill(0));

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const waitWhilePaused = async () => {
    while (pauseRef.current) {
      if (shouldStopRef.current) return false;
      await sleep(100);
    }
    return true;
  };

  const cloneBoard = () => board.map((row) => [...row]);

  const isSafe = (row, col) => {
    for (let i = 0; i < row; i++) {
      if (board[i][col] === 1) return false;
    }
    for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
      if (board[i][j] === 1) return false;
    }
    for (let i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
      if (board[i][j] === 1) return false;
    }
    return true;
  };

  const backtrack = async (row) => {
    if (shouldStopRef.current) return false;

    if (row === n) {
      const snapshot = cloneBoard();
      appendStep("✅ Found complete solution", snapshot);
      updateBoard(snapshot);
      return true;
    }

    for (let col = 0; col < n; col++) {
      if (shouldStopRef.current) return false;

      appendStep(`Trying (${row}, ${col})`, cloneBoard());
      if (!(await waitWhilePaused())) return false;

      if (isSafe(row, col)) {
        board[row][col] = 1;

        const placedSnapshot = cloneBoard();
        appendStep(`Placed at (${row}, ${col})`, placedSnapshot);
        updateBoard(placedSnapshot);
        await sleep(delay);
        if (!(await waitWhilePaused())) return false;

        if (await backtrack(row + 1)) return true;

        board[row][col] = 0;

        const backtrackedSnapshot = cloneBoard();
        appendStep(`Backtracked from (${row}, ${col})`, backtrackedSnapshot);
        updateBoard(backtrackedSnapshot);
        await sleep(delay);
        if (!(await waitWhilePaused())) return false;
      }
    }

    return false;
  };

  await backtrack(0);
}
