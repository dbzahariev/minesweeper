import React, { useState, useEffect } from "react";
import { Cell, CellState, CellValue, Face } from "../../types";
import { generateCells, openMultipleCells } from "../../utils";
import NumberDisplay from "../NumberDisplay";
import Button from "../Button";
import "./App.scss";
import { NO_OF_BOMBS } from "../../constants";
import axios from "axios";

const App: React.FC = () => {
  const [cells, setCells] = useState<Cell[][]>(generateCells());
  const [face, setFace] = useState<Face>(Face.smile);
  const [time, setTime] = useState<number>(0);
  const [live, setLive] = useState<boolean>(false);
  const [bombCounter, setBombCounter] = useState<number>(NO_OF_BOMBS);
  const [hesLost, setHesLost] = useState<boolean>(false);
  const [hesWon, setHesWon] = useState<boolean>(false);

  useEffect(() => {
    const handleMouseDownAndUp = (e: any): void => {
      if (!live) {
        return;
      }
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
  }, [live]);

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

  useEffect(() => {
    if (hesLost) {
      setLive(false);
      setFace(Face.lost);
    } else {
      setFace(Face.smile);
    }
  }, [hesLost]);

  useEffect(() => {
    if (hesWon) {
      setLive(false);
      setFace(Face.won);
    }
  }, [hesWon]);

  const handleCellClick = (rowParam: number, colParam: number) => (): void => {
    let newCells: Cell[][] = cells.slice();

    if (!live) {
      let isBomb = newCells[rowParam][colParam].value === CellValue.bomb;
      while (isBomb) {
        newCells = generateCells();
        isBomb = newCells[rowParam][colParam].value === CellValue.bomb;
      }
      setLive(true);
    }
    const currentCell = newCells[rowParam][colParam];

    if ([CellState.flagged, CellState.visible].includes(currentCell.state)) {
      return;
    }

    if (currentCell.value === CellValue.bomb) {
      setHesLost(true);
      newCells = showAllBombs();
      newCells[rowParam][colParam].red = true;
      setCells(newCells);
      return;
    } else if (currentCell.value === CellValue.none) {
      newCells = openMultipleCells(cells, rowParam, colParam);
    } else {
      // Click on a number
      newCells[rowParam][colParam].state = CellState.visible;
    }

    // Check Won
    let safeOpenCellsExist: boolean = getSafeOpenCellsExist(cells);
    if (!safeOpenCellsExist) {
      newCells.map((row) =>
        row.map((cell) => {
          if (cell.value === CellValue.bomb) {
            return { ...cell, state: CellState.flagged };
          }
          return cell;
        })
      );
      setHesWon(true);
    }

    setCells(newCells);
  };

  const getSafeOpenCellsExist = (cells: Cell[][]) => {
    let numberOfOpenCells = 0;
    cells.forEach((rows) =>
      rows.forEach((currentCell) => {
        if (
          currentCell.value !== CellValue.bomb &&
          currentCell.state === CellState.open
        ) {
          numberOfOpenCells++;
        }
      })
    );

    return numberOfOpenCells > 0;
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
            live={live}
            hesDie={hesLost || hesWon}
            key={`${rowIndex - cellIndex}`}
            state={cell.state}
            value={cell.value}
            red={cell.red}
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
    setLive(false);
    setTime(0);
    setBombCounter(NO_OF_BOMBS);
    setCells(generateCells());
    setHesLost(false);
    setHesWon(false);
    setFace(Face.smile);
  };

  const showAllBombs = (): Cell[][] => {
    let currentCells = cells.slice();

    return currentCells.map((row) =>
      row.map((cell) => {
        if (cell.value === CellValue.bomb) {
          return { ...cell, state: CellState.visible };
        }
        return cell;
      })
    );
  };

  const testServer = () => {
    console.log("test server");
    axios
      .get("/api")
      .then((response) => {
        const data = response.data;
        // this.setState({ posts: data });
        console.log(data);
        console.log("Data has been received!!");
      })
      .catch(() => {
        alert("Error retrieving data!!!");
      });
  };

  const submit = () => {
    const payload = {
      title: "hi",
      body: "body 3",
    };

    axios({
      url: "/api/save",
      method: "POST",
      data: payload,
    })
      .then(() => {
        console.log("Data has been sent to the server");
        testServer();
      })
      .catch(() => {
        console.log("Internal server error");
      });
  };

  useEffect(() => {
    testServer();
  }, []);

  return (
    <div className="App">
      {"22:06"}
      <button onClick={submit}>t submit</button>
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