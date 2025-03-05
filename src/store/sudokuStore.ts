import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { isValidPlacement } from "../utils/sudokuGenerator";
import { Grid, Position, Difficulty, GameStatus } from "../types/sudoku";

export interface SudokuState {
  grid: Grid;
  solution: number[][];
  difficulty: Difficulty;
  selectedCell: Position | null;
  gameStatus: GameStatus;
  timer: number;

  // Actions
  initializeGame: (difficulty: Difficulty) => void;
  selectCell: (position: Position) => void;
  enterNumber: (number: number) => void;
  toggleNote: (number: number) => void;
  clearCell: () => void;
  checkSolution: () => boolean;
  pauseGame: () => void;
  resumeGame: () => void;
  incrementTimer: () => void;
}

export const useSudokuStore = create<SudokuState>()(
  devtools(
    persist(
      (set, get) => ({
        grid: initEmptyGrid(),
        solution: Array(9)
          .fill(0)
          .map(() => Array(9).fill(0)),
        difficulty: "medium",
        selectedCell: null,
        gameStatus: "idle",
        timer: 0,

        initializeGame: (difficulty) => {
          set({ gameStatus: "loading" });

          const worker = new Worker(
            new URL("../workers/sudokuGenerator.worker", import.meta.url),
            { type: "module" }
          );

          worker.onmessage = (event) => {
            const { fullGrid, puzzle } = event.data;

            const grid: Grid = puzzle.map((row: number[]) =>
              row.map((value: number) => ({
                value,
                isGiven: value !== 0,
                isSelected: false,
                isInvalid: false,
                notes: [],
              }))
            );

            set({
              grid,
              solution: fullGrid,
              difficulty,
              selectedCell: null,
              gameStatus: "playing",
              timer: 0,
            });

            worker.terminate();
          };

          worker.postMessage({ difficulty });
        },

        selectCell: (position) => {
          const { grid } = get();

          // Mettre à jour la grille en désélectionnant toutes les cellules
          // et en sélectionnant la nouvelle cellule
          const updatedGrid = grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => ({
              ...cell,
              isSelected:
                rowIndex === position.row && colIndex === position.col,
            }))
          );

          set({
            grid: updatedGrid,
            selectedCell: position,
          });
        },

        enterNumber: (number) => {
          const { grid, selectedCell } = get();

          if (
            !selectedCell ||
            grid[selectedCell.row][selectedCell.col].isGiven
          ) {
            return;
          }

          // Créer une copie de la grille
          const updatedGrid = JSON.parse(JSON.stringify(grid));
          const cell = updatedGrid[selectedCell.row][selectedCell.col];

          // Mettre à jour la valeur de la cellule
          cell.value = number;
          cell.notes = [];

          // Vérifier si la valeur est valide
          const numericGrid = updatedGrid.map((row: { value: number }[]) =>
            row.map((cell) => cell.value)
          );
          const isValid = isValidPlacement(
            numericGrid,
            selectedCell.row,
            selectedCell.col,
            number
          );

          cell.isInvalid = !isValid;

          // Mettre à jour la grille et vérifier si le jeu est terminé
          set({ grid: updatedGrid });

          // Vérifier si toutes les cellules sont remplies correctement
          const isComplete = get().checkSolution();
          if (isComplete) {
            set({ gameStatus: "completed" });
          }
        },

        toggleNote: (number) => {
          const { grid, selectedCell } = get();

          if (
            !selectedCell ||
            grid[selectedCell.row][selectedCell.col].isGiven
          ) {
            return;
          }

          // Créer une copie de la grille
          const updatedGrid = JSON.parse(JSON.stringify(grid));
          const cell = updatedGrid[selectedCell.row][selectedCell.col];

          // Si la cellule a une valeur, la supprimer d'abord
          if (cell.value !== 0) {
            cell.value = 0;
            cell.notes = [];
          }

          // Ajouter ou supprimer la note
          const noteIndex = cell.notes.indexOf(number);
          if (noteIndex === -1) {
            cell.notes.push(number);
            cell.notes.sort();
          } else {
            cell.notes.splice(noteIndex, 1);
          }

          set({ grid: updatedGrid });
        },

        clearCell: () => {
          const { grid, selectedCell } = get();

          if (
            !selectedCell ||
            grid[selectedCell.row][selectedCell.col].isGiven
          ) {
            return;
          }

          // Créer une copie de la grille
          const updatedGrid = JSON.parse(JSON.stringify(grid));
          const cell = updatedGrid[selectedCell.row][selectedCell.col];

          // Réinitialiser la cellule
          cell.value = 0;
          cell.notes = [];
          cell.isInvalid = false;

          set({ grid: updatedGrid });
        },

        checkSolution: () => {
          const { grid } = get();

          // Vérifier si toutes les cellules sont remplies
          const isFilled = grid.every((row) =>
            row.every((cell) => cell.value !== 0)
          );

          if (!isFilled) {
            return false;
          }

          // Vérifier si toutes les cellules sont valides
          const hasInvalidCells = grid.some((row) =>
            row.some((cell) => cell.isInvalid)
          );

          return !hasInvalidCells;
        },

        pauseGame: () => {
          if (get().gameStatus === "playing") {
            set({ gameStatus: "paused" });
          }
        },

        resumeGame: () => {
          if (get().gameStatus === "paused") {
            set({ gameStatus: "playing" });
          }
        },

        incrementTimer: () => {
          if (get().gameStatus === "playing") {
            set((state) => ({ timer: state.timer + 1 }));
          }
        },
      }),
      {
        name: "sudoku-storage",
        partialize: (state) => ({
          grid: state.grid,
          solution: state.solution,
          difficulty: state.difficulty,
          gameStatus: state.gameStatus,
          timer: state.timer,
        }),
      }
    )
  )
);

// Fonction utilitaire pour initialiser une grille vide
export function initEmptyGrid(): Grid {
  return Array(9)
    .fill(0)
    .map(() =>
      Array(9)
        .fill(0)
        .map(() => ({
          value: 0,
          isGiven: false,
          isSelected: false,
          isInvalid: false,
          notes: [],
        }))
    );
}
