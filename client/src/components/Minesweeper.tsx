import React, { useState, useEffect, useCallback } from "react";
import { Cell, CellState, CellValue, Face } from "../assistants/Types";
import { generateCells, openMultipleCells } from "../assistants/Utils";
import { MAX_COLS, MAX_ROWS, NO_OF_BOMBS } from "../assistants/Constants";
import NumberDisplay from "./NumberDisplay";
import Button from "./Button";

import "../styles/Minesweeper.scss";
import axios from "axios";
import { showNotification } from "./App";

function App(props: any) {
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
      let bombs = showAllBombs();
      setCells(bombs);
      setFace(Face.lost);
      setLive(false);
    }
    if (hesWon) {
      let bombs = showAllNotBombs();
      setCells(bombs);
      setFace(Face.won);
      setLive(false);
      addGame();
    }
    // eslint-disable-next-line
  }, [hesLost, hesWon]);

  const showAllBombs = useCallback((): Cell[][] => {
    let currentCells = cells.slice();

    return currentCells.map((row) =>
      row.map((cell) => {
        if (cell.value === CellValue.bomb && cell.state !== CellState.flagged) {
          return { ...cell, state: CellState.visible };
        }
        return cell;
      })
    );
  }, [cells]);

  const showAllNotBombs = () => {
    let currentCells = cells.slice();

    return currentCells.map((row) =>
      row.map((cell) => {
        if (
          cell.state !== CellState.visible &&
          cell.state !== CellState.flagged
        ) {
          return { ...cell, state: CellState.visible };
        }
        return cell;
      })
    );
  };

  const addGame = () => {
    let date = new Date().toISOString();
    let gameData = { time: time || 1, date: date };
    let username = localStorage.getItem("username") || "";

    axios.get("/api").then((response) => {
      let found =
        response.data.findIndex((el: any) => el.owner === username) > -1;
      if (found) {
        axios({
          method: "POST",
          data: gameData,
          withCredentials: true,
          url: `/api/addgame?name=${localStorage.getItem("username")}`,
        })
          .then((res) => {
            showNotification(res.data.msg, 1, res.data.type);
            props.setReload(props.reload + 1);
          })
          .catch((err) => console.error(err));
      } else {
        axios({
          method: "POST",
          data: { owner: username, games: [gameData] },
          withCredentials: true,
          url: `/api/create`,
        })
          .then((res) => {
            showNotification(res.data.msg, 1, res.data.type);

            localStorage.setItem("username", username);
            props.setReload(props.reload + 1);
          })
          .catch((err) => console.error(err));
      }
    });
  };

  const checkBombsAroundMe = (row: number, col: number): boolean => {
    let nFlags = 0;

    for (let i = 0; i < MAX_ROWS; i++) {
      for (let j = 0; j < MAX_COLS; j++) {
        if (
          i === row - 1 &&
          j === col - 1 &&
          cells[i][j].state === CellState.flagged
        ) {
          nFlags++;
        }
        if (
          i === row - 1 &&
          j === col &&
          cells[i][j].state === CellState.flagged
        ) {
          nFlags++;
        }
        if (
          i === row - 1 &&
          j === col + 1 &&
          cells[i][j].state === CellState.flagged
        ) {
          nFlags++;
        }
        if (
          i === row &&
          j === col - 1 &&
          cells[i][j].state === CellState.flagged
        ) {
          nFlags++;
        }
        if (
          i === row &&
          j === col + 1 &&
          cells[i][j].state === CellState.flagged
        ) {
          nFlags++;
        }
        if (
          i === row + 1 &&
          j === col - 1 &&
          cells[i][j].state === CellState.flagged
        ) {
          nFlags++;
        }
        if (
          i === row + 1 &&
          j === col &&
          cells[i][j].state === CellState.flagged
        ) {
          nFlags++;
        }
        if (
          i === row + 1 &&
          j === col + 1 &&
          cells[i][j].state === CellState.flagged
        ) {
          nFlags++;
        }
      }
    }

    return nFlags === cells[row][col].value;
  };

  const setVisibleAroundMe = (row: number, col: number): Cell[][] => {
    let res = cells.slice();
    if (checkBombsAroundMe(row, col)) {
      if (
        row - 1 >= 0 &&
        col - 1 >= 0 &&
        res[row - 1][col - 1].state !== CellState.visible &&
        res[row - 1][col - 1].state !== CellState.flagged
      ) {
        handleCellClick(row - 1, col - 1, true)();
      }
      if (
        row - 1 >= 0 &&
        res[row - 1][col].state !== CellState.visible &&
        res[row - 1][col].state !== CellState.flagged
      ) {
        handleCellClick(row - 1, col, true)();
      }
      if (
        row - 1 >= 0 &&
        col + 1 < MAX_COLS &&
        res[row - 1][col + 1].state !== CellState.visible &&
        res[row - 1][col + 1].state !== CellState.flagged
      ) {
        handleCellClick(row - 1, col + 1, true)();
      }
      if (
        col - 1 >= 0 &&
        res[row][col - 1].state !== CellState.visible &&
        res[row][col - 1].state !== CellState.flagged
      ) {
        handleCellClick(row, col - 1, true)();
      }
      if (
        col + 1 < MAX_COLS &&
        res[row][col + 1].state !== CellState.visible &&
        res[row][col + 1].state !== CellState.flagged
      ) {
        handleCellClick(row, col + 1, true)();
      }
      if (
        row + 1 < MAX_ROWS &&
        col - 1 >= 0 &&
        res[row + 1][col - 1].state !== CellState.visible &&
        res[row + 1][col - 1].state !== CellState.flagged
      ) {
        handleCellClick(row + 1, col - 1, true)();
      }
      if (
        row + 1 < MAX_ROWS &&
        res[row + 1][col].state !== CellState.visible &&
        res[row + 1][col].state !== CellState.flagged
      ) {
        handleCellClick(row + 1, col, true)();
      }
      if (
        row + 1 < MAX_ROWS &&
        col + 1 < MAX_ROWS &&
        res[row + 1][col + 1].state !== CellState.visible &&
        res[row + 1][col + 1].state !== CellState.flagged
      ) {
        handleCellClick(row + 1, col + 1, true)();
      }
    }
    return res;
  };

  const handleCellClick =
    (rowParam: number, colParam: number, fromReval?: boolean) => (): void => {
      if (
        rowParam < 0 ||
        colParam >= MAX_COLS ||
        colParam < 0 ||
        rowParam >= MAX_ROWS
      ) {
        return;
      }

      let newCells: Cell[][] = cells.slice();
      if (!live) {
        setLive(true);
      }

      if (fromReval !== true) {
        newCells = setVisibleAroundMe(rowParam, colParam);
      }

      const currentCell = newCells[rowParam][colParam];

      if (currentCell.value === CellValue.bomb) {
        setHesLost(true);
        newCells[rowParam][colParam].red = true;
        newCells[rowParam][colParam].state = CellState.visible;
        newCells = showAllBombs();
      } else if (currentCell.value === CellValue.none) {
        newCells = openMultipleCells(cells, rowParam, colParam);
      } else {
        newCells[rowParam][colParam].state = CellState.visible;
      }
      if (checkWin()) {
        setHesWon(true);
      }

      setCells(newCells);
    };

  const getSafeOpenCellsExist = () => {
    let numberOfOpenCells = 0;
    let existNotOpenBombs = 0;
    let wrongBombs = 0;

    cells.forEach((rows) =>
      rows.forEach((currentCell) => {
        if (
          currentCell.value !== CellValue.bomb &&
          currentCell.state === CellState.open
        ) {
          numberOfOpenCells++;
        }
        if (
          currentCell.value === CellValue.bomb &&
          currentCell.state !== CellState.open &&
          currentCell.state !== CellState.flagged
        ) {
          existNotOpenBombs++;
        }
        if (
          currentCell.value !== CellValue.bomb &&
          currentCell.state === CellState.flagged
        ) {
          wrongBombs++;
        }
      })
    );

    return { numberOfOpenCells, existNotOpenBombs, wrongBombs };
  };

  const checkWin = (): boolean => {
    let res = false;
    if (getSafeOpenCellsExist().numberOfOpenCells === 0) {
      res = true;
    }
    if (getSafeOpenCellsExist().wrongBombs > 0) {
      res = false;
    }
    return res;
  };

  const handleCellRightClick =
    (rowParam: number, colParam: number) =>
    (e: React.MouseEvent<HTMLDivElement>): void => {
      e.preventDefault();

      if (!live) {
        return;
      }

      const currentCells = cells.slice();
      const currentCell = cells[rowParam][colParam];

      if (currentCell.state !== CellState.visible) {
        if (currentCells[rowParam][colParam].state !== CellState.flagged) {
          currentCells[rowParam][colParam].state = CellState.flagged;
          setCells(currentCells);
          setBombCounter(bombCounter - 1);
        } else {
          currentCells[rowParam][colParam].state = CellState.open;
          setCells(currentCells);
          setBombCounter(bombCounter + 1);
        }
      }

      if (checkWin()) {
        setHesWon(true);
      }
    };

  useEffect(() => {
    if (getSafeOpenCellsExist().numberOfOpenCells > 0 && bombCounter === 0) {
      setHesWon(true);
    }
    // eslint-disable-next-line
  }, [bombCounter, cells]);

  const handleFaceClick = (): void => {
    setLive(false);
    setTime(0);
    setBombCounter(NO_OF_BOMBS);
    setCells(generateCells());
    setHesLost(false);
    setHesWon(false);
    setFace(Face.smile);
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

  return (
    <div style={{ padding: "2%" }}>
      <div
        style={{
          width: `${55 + 30 * MAX_COLS}px`,
          height: `${145 + 30 * MAX_ROWS}px`,
        }}
        className="Minesweeper"
      >
        <div className="Header">
          <NumberDisplay value={bombCounter} />
          <div className="Face">
            <span role="img" aria-label="face" onClick={handleFaceClick}>
              {face}
            </span>
          </div>
          <NumberDisplay value={time} />
        </div>
        <div
          className="Body"
          style={{
            gridTemplateColumns: `repeat(${MAX_COLS}, 1fr)`,
            gridTemplateRows: `repeat(${MAX_ROWS}, 1fr)`,
          }}
        >
          {renderCells()}
        </div>
      </div>
    </div>
  );
}

export default App;
