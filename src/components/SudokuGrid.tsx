// src/components/SudokuGrid.tsx
import React from "react";
import { useSudokuStore } from "../store/sudokuStore";
import { cn } from "../lib/utils";

export function SudokuGrid() {
  const { grid, selectedCell, selectCell } = useSudokuStore();

  return (
    <div className="grid grid-cols-9 gap-[1px] bg-gray-300 border-2 border-gray-800 rounded-md overflow-hidden">
      {grid.map((row, rowIndex) => (
        <React.Fragment key={`row-${rowIndex}`}>
          {row.map((cell, colIndex) => {
            // Déterminer si cette cellule est dans le même bloc 3x3 que la cellule sélectionnée
            const inSameBlock =
              selectedCell &&
              Math.floor(rowIndex / 3) === Math.floor(selectedCell.row / 3) &&
              Math.floor(colIndex / 3) === Math.floor(selectedCell.col / 3);

            // Déterminer si cette cellule est sur la même ligne ou colonne que la cellule sélectionnée
            const inSameRowOrCol =
              selectedCell &&
              (rowIndex === selectedCell.row || colIndex === selectedCell.col);

            // Déterminer si cette cellule a la même valeur que la cellule sélectionnée
            const hasSameValue =
              selectedCell &&
              cell.value !== 0 &&
              cell.value === grid[selectedCell.row][selectedCell.col].value;

            return (
              <div
                key={`cell-${rowIndex}-${colIndex}`}
                className={cn(
                  "aspect-square flex items-center justify-center text-lg sm:text-xl md:text-2xl font-semibold cursor-pointer select-none",
                  "transition-colors duration-150 ease-in-out",
                  // Border styling pour les blocs 3x3
                  (colIndex + 1) % 3 === 0 &&
                    colIndex < 8 &&
                    "border-r-2 border-gray-800",
                  (rowIndex + 1) % 3 === 0 &&
                    rowIndex < 8 &&
                    "border-b-2 border-gray-800",
                  // Background styling basé sur l'état de la cellule
                  cell.isSelected
                    ? "bg-blue-300"
                    : inSameBlock
                    ? "bg-blue-50"
                    : inSameRowOrCol
                    ? "bg-blue-100"
                    : hasSameValue
                    ? "bg-green-100"
                    : "bg-white",
                  // Styling pour les cellules données/fixes
                  cell.isGiven ? "text-gray-800 font-bold" : "text-blue-600",
                  // Styling pour les cellules invalides
                  cell.isInvalid && "text-red-600 bg-red-100"
                )}
                onClick={() => selectCell({ row: rowIndex, col: colIndex })}
              >
                {cell.value !== 0 ? (
                  cell.value
                ) : cell.notes.length > 0 ? (
                  <div className="grid grid-cols-3 gap-[1px] w-full h-full p-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                      <div
                        key={`note-${num}`}
                        className="flex items-center justify-center text-xs text-gray-500"
                      >
                        {cell.notes.includes(num) ? num : ""}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
}
