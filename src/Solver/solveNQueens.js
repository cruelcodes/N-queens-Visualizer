export function solveNQueens(n) {
  const solutions = [];
  const board = Array.from({ length: n }, () => Array(n).fill(0));

  function isSafe(row, col) {
    // check same column
    for (let i = 0; i < row; i++) {
      if (board[i][col] === 1) return false;
    }

    // check upper left diagonal
    for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
      if (board[i][j] === 1) return false;
    }

    // check upper right diagonal
    for (let i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
      if (board[i][j] === 1) return false;
    }

    return true;
  }

  function backtrack(row) {
    if (row === n) {
      // save deep copy
      const copy = board.map(r => [...r]);
      solutions.push(copy);
      return;
    }

    for (let col = 0; col < n; col++) {
      if (isSafe(row, col)) {
        board[row][col] = 1;
        backtrack(row + 1);
        board[row][col] = 0; // undo
      }
    }
  }

  backtrack(0);
  return solutions;
}
