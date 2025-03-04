// src/types/sudoku.ts
export type Cell = {
  value: number;
  isGiven: boolean;
  isSelected: boolean;
  isInvalid: boolean;
  notes: number[];
};

export type Grid = Cell[][];

export type Position = {
  row: number;
  col: number;
};

export type Difficulty = "easy" | "medium" | "hard" | "expert";

export type GameStatus = "idle" | "playing" | "paused" | "completed";
