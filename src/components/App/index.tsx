import React, { useState, useEffect } from "react";
import { CellState, Face } from "../../types";
import { generateCells } from "../../utils";
import NumberDisplay from "../NumberDisplay";
import Button from "../Button";
import "./App.scss";
import { NO_OF_BOMBS } from "../../constants";

const App: React.FC = () => {
  const [cells, setCells] = useState(generateCells());
  const [face, setFace] = useState<Face>(Face.smile);
  const [time, setTime] = useState<number>(995);
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
      setLive(true);
    }
    console.log("Left click", rowParam, colParam);
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
    } else if (currentCell.state === CellState.open && bombCounter < -99) {
      currentCells[rowParam][colParam].state = CellState.flagged;
      setCells(currentCells);
      setBombCounter(bombCounter - 1);
    } else if (currentCell.state === CellState.flagged) {
      currentCells[rowParam][colParam].state = CellState.open;
      setCells(currentCells);
      setBombCounter(bombCounter + 1);
    }

    // console.log("Right click", rowParam, colParam);
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
    </div>
  );
};

export default App;
