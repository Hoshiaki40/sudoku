import React from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { useSudokuStore } from "../store/sudokuStore";
import { Difficulty } from "../types/sudoku";

export function ControlPanel() {
  const {
    initializeGame,
    enterNumber,
    toggleNote,
    clearCell,
    gameStatus,
    pauseGame,
    resumeGame,
  } = useSudokuStore();

  const [isNoteMode, setIsNoteMode] = React.useState(false);
  const [selectedDifficulty, setSelectedDifficulty] =
    React.useState<Difficulty>("medium");
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const handleNumberClick = (number: number) => {
    if (isNoteMode) {
      toggleNote(number);
    } else {
      enterNumber(number);
    }
  };

  return (
    <div className="space-y-6 mt-4">
      <div className="flex justify-between items-center">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Nouvelle Partie</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Choisissez la difficulté</DialogTitle>
            </DialogHeader>
            <RadioGroup
              value={selectedDifficulty}
              onValueChange={(value: string) =>
                setSelectedDifficulty(value as Difficulty)
              }
              className="space-y-2 mt-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="easy" id="difficulty-easy" />
                <Label htmlFor="difficulty-easy">Facile</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="difficulty-medium" />
                <Label htmlFor="difficulty-medium">Moyen</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hard" id="difficulty-hard" />
                <Label htmlFor="difficulty-hard">Difficile</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="expert" id="difficulty-expert" />
                <Label htmlFor="difficulty-expert">Expert</Label>
              </div>
            </RadioGroup>
            <div className="flex justify-end mt-4">
              <Button
                onClick={() => {
                  initializeGame(selectedDifficulty);
                  setIsOpen(false);
                }}
              >
                Commencer
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {gameStatus === "playing" ? (
          <Button variant="outline" onClick={pauseGame}>
            Pause
          </Button>
        ) : gameStatus === "paused" ? (
          <Button variant="outline" onClick={resumeGame}>
            Reprendre
          </Button>
        ) : null}
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
          <Button
            key={`number-${number}`}
            variant="outline"
            className="text-lg font-bold h-12"
            onClick={() => handleNumberClick(number)}
          >
            {number}
          </Button>
        ))}
      </div>

      <div className="flex space-x-2 mt-4">
        <Button
          variant={isNoteMode ? "default" : "outline"}
          onClick={() => setIsNoteMode(!isNoteMode)}
          className="flex-1"
        >
          Notes {isNoteMode ? "(Activé)" : ""}
        </Button>
        <Button variant="outline" onClick={clearCell} className="flex-1">
          Effacer
        </Button>
      </div>
    </div>
  );
}
