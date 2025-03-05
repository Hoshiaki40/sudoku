type Grid = number[][];

export function generateFullGrid(): Grid {
  const grid: Grid = Array(9)
    .fill(0)
    .map(() => Array(9).fill(0));

  function fillGrid(row: number = 0, col: number = 0): boolean {
    if (col === 9) {
      col = 0;
      row++;

      if (row === 9) {
        return true;
      }
    }

    if (grid[row][col] !== 0) {
      return fillGrid(row, col + 1);
    }

    const numbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    for (const num of numbers) {
      if (isValidPlacement(grid, row, col, num)) {
        grid[row][col] = num;

        if (fillGrid(row, col + 1)) {
          return true;
        }

        grid[row][col] = 0;
      }
    }

    return false;
  }

  fillGrid();
  return grid;
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function isValidPlacement(
  grid: Grid,
  row: number,
  col: number,
  num: number
): boolean {
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num) {
      return false;
    }
  }

  for (let y = 0; y < 9; y++) {
    if (grid[y][col] === num) {
      return false;
    }
  }

  const blockRow = Math.floor(row / 3) * 3;
  const blockCol = Math.floor(col / 3) * 3;

  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      if (grid[blockRow + y][blockCol + x] === num) {
        return false;
      }
    }
  }

  return true;
}

export function createPuzzle(
  grid: Grid,
  difficulty: "easy" | "medium" | "hard" | "expert"
): Grid {
  // Cloner la grille complète
  const puzzle: Grid = JSON.parse(JSON.stringify(grid));
  // const solution: Grid = JSON.parse(JSON.stringify(grid));

  // Nombre de cellules à retirer selon la difficulté
  const cellsToRemove = {
    easy: 30,
    medium: 40,
    hard: 50,
    expert: 60,
  };

  // Positions de toutes les cellules
  const positions: [number, number][] = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      positions.push([row, col]);
    }
  }

  // Mélanger les positions pour un retrait aléatoire
  shuffleArray(positions);

  // Compteur de cellules retirées
  let removed = 0;

  for (const [row, col] of positions) {
    if (removed >= cellsToRemove[difficulty]) {
      break;
    }

    // Sauvegarder la valeur actuelle
    const temp = puzzle[row][col];
    puzzle[row][col] = 0;

    // Vérifier si la solution reste unique après le retrait
    if (!hasUniqueSolution(puzzle)) {
      // Restaurer la valeur si la solution n'est plus unique
      puzzle[row][col] = temp;
    } else {
      removed++;
    }
  }

  return puzzle;
}

export function hasUniqueSolution(puzzle: Grid): boolean {
  const testPuzzle: Grid = JSON.parse(JSON.stringify(puzzle));

  let solutionCount = 0;
  const MAX_SOLUTIONS = 2;

  function countSolutions(row = 0, col = 0): void {
    if (solutionCount >= MAX_SOLUTIONS) {
      return;
    }

    if (row === 9) {
      solutionCount++;
      return;
    }

    const nextRow = col === 8 ? row + 1 : row;
    const nextCol = col === 8 ? 0 : col + 1;

    if (testPuzzle[row][col] !== 0) {
      countSolutions(nextRow, nextCol);
      return;
    }

    for (let num = 1; num <= 9; num++) {
      if (isValidPlacement(testPuzzle, row, col, num)) {
        testPuzzle[row][col] = num;
        countSolutions(nextRow, nextCol);
        testPuzzle[row][col] = 0; // Backtrack
      }
    }
  }

  countSolutions();

  return solutionCount === 1;
}
