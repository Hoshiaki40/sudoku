import { useEffect } from "react";
import { useSudokuStore } from "../store/sudokuStore";

export function Timer() {
  const { timer, gameStatus, incrementTimer } = useSudokuStore();

  useEffect(() => {
    if (gameStatus === "playing") {
      const interval = setInterval(() => {
        incrementTimer();
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [gameStatus, incrementTimer]);

  // Formatage du temps (secondes -> mm:ss)
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="text-xl font-semibold text-center my-4">
      {formatTime(timer)}
    </div>
  );
}
