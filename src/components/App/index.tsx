import React, { useState, useEffect } from "react";
import { Cell, CellState, CellValue, Face } from "../../types";
import { generateCells, openMultipleCells } from "../../utils";
import NumberDisplay from "../NumberDisplay";
import Button from "../Button";
import "./App.scss";
import { NO_OF_BOMBS } from "../../constants";

const App: React.FC = () => {
  const [cells, setCells] = useState(generateCells());
  const [face, setFace] = useState<Face>(Face.smile);
  const [time, setTime] = useState<number>(0);
  const [live, setLive] = useState<boolean>(false);
  const [bombCounter, setBombCounter] = useState(NO_OF_BOMBS);

  useEffect(() => {
    const handleMouseDownAndUp = (e: any): void => {
      let isButton: boolean = e.target.className
        .toString()
        .startsWith("Button");
      if (isButton) {
        if (e.type === "mouseup") {
          setFace(Face.smile);
        } else if (e.type === "mousedown") {
          setFace(Face.oh);
        }
      }
    };
    window.addEventListener("mouseup", handleMouseDownAndUp);
    window.addEventListener("mousedown", handleMouseDownAndUp);

    return () => {
      window.removeEventListener("mouseup", handleMouseDownAndUp);
      window.removeEventListener("mousedown", handleMouseDownAndUp);
    };
  }, []);

  useEffect(() => {
    if (live && time < 999) {
      const timer = setInterval(() => {
        setTime(time + 1);
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [live, time]);

  const handleCellClick = (rowParam: number, colParam: number) => (): void => {
    if (!live) {
      // TODO: Check for Bomb

      setLive(true);
    }

    let newCells: Cell[][] = cells.slice();
    const currentCell = cells[rowParam][colParam];

    if ([CellState.flagged, CellState.visible].includes(currentCell.state)) {
      console.log("Click on flag or visible");
      // newCells = openMultipleCells(cells.slice(), rowParam, colParam);
      return;
    }

    if (currentCell.value === CellValue.bomb) {
      // TODO: Take care of bomb click
    } else if (currentCell.value === CellValue.none) {
      newCells = openMultipleCells(cells, rowParam, colParam);
      // TODO: Do that
    } else {
      newCells[rowParam][colParam].state = CellState.visible;
    }

    setCells(newCells);

    // console.log("Left click", rowParam, colParam);
  };
  const handleCellRightClick = (rowParam: number, colParam: number) => (
    e: React.MouseEvent<HTMLDivElement>
  ): void => {
    e.preventDefault();

    if (!live) {
      return;
    }

    const currentCells = cells.slice();
    const currentCell = cells[rowParam][colParam];
    if (currentCell.state === CellState.visible) {
      return;
    } else if (currentCell.state === CellState.open && bombCounter > -99) {
      currentCells[rowParam][colParam].state = CellState.flagged;
      setCells(currentCells);
      setBombCounter(bombCounter - 1);
    } else if (currentCell.state === CellState.flagged) {
      currentCells[rowParam][colParam].state = CellState.open;
      setCells(currentCells);
      setBombCounter(bombCounter + 1);
    }
  };

  const renderCells = (): React.ReactNode => {
    return cells.map((row, rowIndex) =>
      row.map((cell, cellIndex) => {
        return (
          <Button
            key={`${rowIndex - cellIndex}`}
            state={cell.state}
            value={cell.value}
            onClick={handleCellClick}
            onContext={handleCellRightClick}
            row={rowIndex}
            col={cellIndex}
          />
        );
      })
    );
  };

  const handleFaceClick = (): void => {
    console.log("Click face");
    if (live) {
      setLive(false);
      setTime(0);
      setCells(generateCells());
    }
  };

  const handleRevalBombs = () => {
    let newCells = cells.slice();
    for (let rowIndex = 0; rowIndex < newCells.length; rowIndex++) {
      for (let colIndex = 0; colIndex < newCells.length; colIndex++) {
        let cc = cells[rowIndex][colIndex];
        console.log(cc);
        if (cc.state !== CellState.visible) {
          if (cc.state !== CellState.flagged) {
            if (cc.value !== CellValue.bomb) {
              cc.state = CellState.visible;
            }
          }
        }
      }
    }
    setCells(newCells);
  };

  return (
    <div className="App">
      <div className="Header">
        <NumberDisplay value={bombCounter} />
        <div className="Face">
          <span role="img" aria-label="face" onClick={handleFaceClick}>
            {face}
          </span>
        </div>
        <NumberDisplay value={time} />
      </div>
      <div className="Body">{renderCells()}</div>
      <button onClick={handleRevalBombs}>Reval</button>
    </div>
  );
};

export default App;
