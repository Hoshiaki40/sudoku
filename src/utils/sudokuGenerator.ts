type Grid = number[][];

export function generateFullGrid(): Grid {
  // Initialiser une grille vide 9x9
  const grid: Grid = Array(9)
    .fill(0)
    .map(() => Array(9).fill(0));

  // Fonction récursive de backtracking
  function fillGrid(row: number = 0, col: number = 0): boolean {
    // Si nous avons rempli toutes les colonnes, passer à la ligne suivante
    if (col === 9) {
      col = 0;
      row++;

      // Si nous avons rempli toutes les lignes, la grille est complète
      if (row === 9) {
        return true;
      }
    }

    // Si la cellule est déjà remplie, passer à la suivante
    if (grid[row][col] !== 0) {
      return fillGrid(row, col + 1);
    }

    // Mélanger les nombres de 1 à 9 pour plus de randomisation
    const numbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    // Essayer chaque nombre dans la cellule actuelle
    for (const num of numbers) {
      // Vérifier si le nombre est valide dans cette position
      if (isValidPlacement(grid, row, col, num)) {
        grid[row][col] = num;

        // Récursivement remplir le reste de la grille
        if (fillGrid(row, col + 1)) {
          return true;
        }

        // Si le remplissage échoue, annuler ce placement (backtrack)
        grid[row][col] = 0;
      }
    }

    // Aucun chiffre ne fonctionne à cette position
    return false;
  }

  // Commencer le remplissage
  fillGrid();
  return grid;
}

// Fonction auxiliaire pour mélanger un tableau
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Vérifier si un placement est valide selon les règles du Sudoku
export function isValidPlacement(
  grid: Grid,
  row: number,
  col: number,
  num: number
): boolean {
  // Vérifier la ligne
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num) {
      return false;
    }
  }

  // Vérifier la colonne
  for (let y = 0; y < 9; y++) {
    if (grid[y][col] === num) {
      return false;
    }
  }

  // Vérifier le bloc 3x3
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
  const solution: Grid = JSON.parse(JSON.stringify(grid));

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
    if (!hasUniqueSolution(puzzle, solution)) {
      // Restaurer la valeur si la solution n'est plus unique
      puzzle[row][col] = temp;
    } else {
      removed++;
    }
  }

  return puzzle;
}

// Vérifier si un puzzle a une solution unique
export function hasUniqueSolution(
  puzzle: Grid,
  expectedSolution: Grid
): boolean {
  // Cloner le puzzle pour ne pas le modifier
  const testPuzzle: Grid = JSON.parse(JSON.stringify(puzzle));

  // Compter le nombre de solutions trouvées
  let solutionCount = 0;
  const MAX_SOLUTIONS = 2; // Nous n'avons besoin de trouver que 2 solutions pour savoir qu'elle n'est pas unique

  function countSolutions(row = 0, col = 0): void {
    // Si nous avons déjà trouvé plus d'une solution, arrêter
    if (solutionCount >= MAX_SOLUTIONS) {
      return;
    }

    // Si nous avons atteint la fin de la grille, nous avons trouvé une solution
    if (row === 9) {
      solutionCount++;
      return;
    }

    // Calculer la position de la cellule suivante
    const nextRow = col === 8 ? row + 1 : row;
    const nextCol = col === 8 ? 0 : col + 1;

    // Si la cellule est déjà remplie, passer à la suivante
    if (testPuzzle[row][col] !== 0) {
      countSolutions(nextRow, nextCol);
      return;
    }

    // Essayer chaque nombre de 1 à 9
    for (let num = 1; num <= 9; num++) {
      if (isValidPlacement(testPuzzle, row, col, num)) {
        testPuzzle[row][col] = num;
        countSolutions(nextRow, nextCol);
        testPuzzle[row][col] = 0; // Backtrack
      }
    }
  }

  // Commencer à compter les solutions
  countSolutions();

  // Vérifier que nous avons exactement une solution
  return solutionCount === 1;
}
