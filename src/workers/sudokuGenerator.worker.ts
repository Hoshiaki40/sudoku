import { generateFullGrid, createPuzzle } from "@/utils/sudokuGenerator";
import { Difficulty } from "../types/sudoku";

self.addEventListener("message", (event) => {
  console.log("Message received in worker");
  const { difficulty } = event.data as { difficulty: Difficulty };

  const fullGrid = generateFullGrid();

  const puzzle = createPuzzle(fullGrid, difficulty);

  self.postMessage({
    fullGrid,
    puzzle,
  });
});
