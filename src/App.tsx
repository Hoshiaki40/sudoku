import "./App.css";
import { useSudokuStore } from "./store/sudokuStore";
import { useEffect } from "react";
import { SudokuGrid } from "./components/SudokuGrid";
import { ControlPanel } from "./components/ControlPanel";
import { Timer } from "./components/Timer";

function App() {
  const { gameStatus, initializeGame } = useSudokuStore();

  // Initialiser une nouvelle partie si aucune n'est en cours
  useEffect(() => {
    if (gameStatus === "idle") {
      initializeGame("medium");
    }
  }, [gameStatus, initializeGame]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6">Sudoku</h1>

        <Timer />

        {gameStatus === "completed" && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded text-center">
            Félicitations ! Vous avez résolu le puzzle !
          </div>
        )}

        {gameStatus === "paused" && (
          <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded text-center">
            Jeu en pause
          </div>
        )}

        <SudokuGrid />

        <ControlPanel />
      </div>
    </div>
  );
}

export default App;
