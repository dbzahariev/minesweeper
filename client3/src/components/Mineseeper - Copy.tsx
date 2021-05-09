import React, { useState, useEffect, useCallback } from "react";
import { Cell, CellState, CellValue, Face } from "../types";
import { generateCells, openMultipleCells } from "../utils";
import NumberDisplay from "./NumberDisplay";
import Button from "./Button";
import "../styles/App.scss";
import { MAX_COLS, MAX_ROWS, NO_OF_BOMBS } from "../constants";
import axios from "axios";

let genCells = () => {
  // eslint-disable-next-line
  let cells1 = {
    str: `${JSON.stringify(generateCells())}`,
    bombs: 0,
  };
  // eslint-disable-next-line
  let cells2 = {
    str: `[[{"value":0,"state":0},{"value":0,"state":0},{"value":1,"state":0},{"value":9,"state":0},{"value":1,"state":0},{"value":0,"state":0},{"value":0,"state":0},{"value":0,"state":0},{"value":0,"state":0}],[{"value":0,"state":0},{"value":0,"state":0},{"value":1,"state":0},{"value":1,"state":0},{"value":1,"state":0},{"value":0,"state":0},{"value":0,"state":0},{"value":0,"state":0},{"value":0,"state":0}],[{"value":0,"state":0},{"value":0,"state":0},{"value":0,"state":0},{"value":0,"state":0},{"value":0,"state":0},{"value":0,"state":0},{"value":0,"state":0},{"value":1,"state":0},{"value":1,"state":0}],[{"value":1,"state":0},{"value":2,"state":0},{"value":2,"state":0},{"value":2,"state":0},{"value":1,"state":0},{"value":1,"state":0},{"value":0,"state":0},{"value":1,"state":0},{"value":9,"state":0}],[{"value":2,"state":0},{"value":9,"state":0},{"value":9,"state":0},{"value":2,"state":0},{"value":9,"state":0},{"value":1,"state":0},{"value":0,"state":0},{"value":1,"state":0},{"value":1,"state":0}],[{"value":9,"state":0},{"value":3,"state":0},{"value":2,"state":0},{"value":2,"state":0},{"value":1,"state":0},{"value":2,"state":0},{"value":1,"state":0},{"value":1,"state":0},{"value":0,"state":0}],[{"value":1,"state":0},{"value":1,"state":0},{"value":0,"state":0},{"value":0,"state":0},{"value":0,"state":0},{"value":1,"state":0},{"value":9,"state":0},{"value":2,"state":0},{"value":1,"state":0}],[{"value":1,"state":0},{"value":1,"state":0},{"value":0,"state":0},{"value":0,"state":0},{"value":0,"state":0},{"value":1,"state":0},{"value":2,"state":0},{"value":3,"state":0},{"value":9,"state":0}],[{"value":9,"state":0},{"value":1,"state":0},{"value":0,"state":0},{"value":0,"state":0},{"value":0,"state":0},{"value":0,"state":0},{"value":1,"state":0},{"value":9,"state":0},{"value":2,"state":0}]]`,
    bombs: 9,
  };
  // eslint-disable-next-line
  let cells3 = {
    str: `[[{"value":0,"state":0},{"value":0,"state":1},{"value":1,"state":1},{"value":9,"state":2},{"value":1,"state":1},{"value":0,"state":1},{"value":0,"state":1},{"value":0,"state":1},{"value":0,"state":1}],[{"value":0,"state":1},{"value":0,"state":1},{"value":1,"state":1},{"value":1,"state":1},{"value":1,"state":1},{"value":0,"state":1},{"value":0,"state":1},{"value":0,"state":1},{"value":0,"state":1}],[{"value":0,"state":1},{"value":0,"state":1},{"value":0,"state":1},{"value":0,"state":1},{"value":0,"state":1},{"value":0,"state":1},{"value":0,"state":1},{"value":1,"state":1},{"value":1,"state":1}],[{"value":1,"state":1},{"value":2,"state":1},{"value":2,"state":1},{"value":2,"state":1},{"value":1,"state":1},{"value":1,"state":1},{"value":0,"state":1},{"value":1,"state":1},{"value":9,"state":2}],[{"value":2,"state":0},{"value":9,"state":0},{"value":9,"state":0},{"value":2,"state":0},{"value":9,"state":0},{"value":1,"state":1},{"value":0,"state":1},{"value":1,"state":1},{"value":1,"state":1}],[{"value":9,"state":0},{"value":3,"state":1},{"value":2,"state":1},{"value":2,"state":1},{"value":1,"state":1},{"value":2,"state":1},{"value":1,"state":1},{"value":1,"state":1},{"value":0,"state":1}],[{"value":1,"state":0},{"value":1,"state":1},{"value":0,"state":1},{"value":0,"state":1},{"value":0,"state":1},{"value":1,"state":1},{"value":9,"state":0},{"value":2,"state":1},{"value":1,"state":1}],[{"value":1,"state":0},{"value":1,"state":1},{"value":0,"state":1},{"value":0,"state":1},{"value":0,"state":1},{"value":1,"state":1},{"value":2,"state":1},{"value":3,"state":0},{"value":9,"state":2}],[{"value":9,"state":0},{"value":1,"state":1},{"value":0,"state":1},{"value":0,"state":1},{"value":0,"state":1},{"value":0,"state":1},{"value":1,"state":1},{"value":9,"state":0},{"value":2,"state":0}]]`,
    bombs: 9,
  };
  // eslint-disable-next-line
  let cells4 = {
    str: `[[{"value":0,"state":0},{"value":0,"state":1},{"value":1,"state":1},{"value":9,"state":2},{"value":1,"state":1},{"value":0,"state":1},{"value":0,"state":1},{"value":0,"state":1},{"value":0,"state":1}],[{"value":0,"state":1},{"value":0,"state":1},{"value":1,"state":1},{"value":1,"state":1},{"value":1,"state":1},{"value":0,"state":1},{"value":0,"state":1},{"value":0,"state":1},{"value":0,"state":1}],[{"value":0,"state":1},{"value":0,"state":1},{"value":0,"state":1},{"value":0,"state":1},{"value":0,"state":1},{"value":0,"state":1},{"value":0,"state":1},{"value":1,"state":1},{"value":1,"state":1}],[{"value":1,"state":1},{"value":2,"state":1},{"value":2,"state":1},{"value":2,"state":1},{"value":1,"state":1},{"value":1,"state":1},{"value":0,"state":1},{"value":1,"state":1},{"value":9,"state":2}],[{"value":2,"state":1},{"value":9,"state":2},{"value":9,"state":2},{"value":2,"state":1},{"value":9,"state":2},{"value":1,"state":1},{"value":0,"state":1},{"value":1,"state":1},{"value":1,"state":1}],[{"value":9,"state":2},{"value":3,"state":1},{"value":2,"state":1},{"value":2,"state":1},{"value":1,"state":1},{"value":2,"state":1},{"value":1,"state":1},{"value":1,"state":1},{"value":0,"state":1}],[{"value":1,"state":1},{"value":1,"state":1},{"value":0,"state":1},{"value":0,"state":1},{"value":0,"state":1},{"value":1,"state":1},{"value":9,"state":2},{"value":2,"state":1},{"value":1,"state":1}],[{"value":1,"state":1},{"value":1,"state":1},{"value":0,"state":1},{"value":0,"state":1},{"value":0,"state":1},{"value":1,"state":1},{"value":2,"state":1},{"value":3,"state":1},{"value":9,"state":2}],[{"value":9,"state":2},{"value":1,"state":1},{"value":0,"state":1},{"value":0,"state":1},{"value":0,"state":1},{"value":0,"state":1},{"value":1,"state":1},{"value":9,"state":0},{"value":2,"state":0}]]`,
    bombs: 9,
  };

  let res = { cells: JSON.parse(cells4.str), bombs: cells4?.bombs || 0 };

  return res;
};

const App: React.FC = () => {
  // const [cells, setCells] = useState<Cell[][]>(generateCells());
  const [cells, setCells] = useState<Cell[][]>(genCells().cells);
  const [face, setFace] = useState<Face>(Face.smile);
  const [time, setTime] = useState<number>(0);
  const [live, setLive] = useState<boolean>(false);
  const [bombCounter, setBombCounter] = useState<number>(
    NO_OF_BOMBS - genCells().bombs
  );
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

  const showAllBombs = useCallback((): Cell[][] => {
    let currentCells = cells.slice();

    return currentCells.map((row) =>
      row.map((cell) => {
        if (cell.value === CellValue.bomb) {
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
    }
    // eslint-disable-next-line
  }, [hesLost, hesWon]);

  const checkBombsAroundMe = (row: number, col: number): boolean => {
    let nFlags = 0;
    // eslint-disable-next-line
    let nBombs = 0;
    let nFBombs = 0;
    let nFBombsArr = [];

    for (let i = 0; i < MAX_ROWS; i++) {
      for (let j = 0; j < MAX_COLS; j++) {
        if (i === row - 1 && j === col - 1) {
          if (cells[i][j].state === CellState.flagged) {
            nFlags++;
          }
          if (cells[i][j].value === CellValue.bomb) {
            nBombs++;
          }
          if (
            cells[i][j].value === CellValue.bomb &&
            cells[i][j].state === CellState.flagged
          ) {
            nFBombsArr.push({ row: i, col: j });
            nFBombs++;
          }
        }
        if (i === row - 1 && j === col) {
          if (cells[i][j].state === CellState.flagged) {
            nFlags++;
          }
          if (cells[i][j].value === CellValue.bomb) {
            nBombs++;
          }
          if (
            cells[i][j].value === CellValue.bomb &&
            cells[i][j].state === CellState.flagged
          ) {
            nFBombsArr.push({ row: i, col: j });
            nFBombs++;
          }
        }
        if (i === row - 1 && j === col + 1) {
          if (cells[i][j].state === CellState.flagged) {
            nFlags++;
          }
          if (cells[i][j].value === CellValue.bomb) {
            nBombs++;
          }
          if (
            cells[i][j].value === CellValue.bomb &&
            cells[i][j].state === CellState.flagged
          ) {
            nFBombsArr.push({ row: i, col: j });
            nFBombs++;
          }
        }
        if (i === row && j === col - 1) {
          if (cells[i][j].state === CellState.flagged) {
            nFlags++;
          }
          if (cells[i][j].value === CellValue.bomb) {
            nBombs++;
          }
          if (
            cells[i][j].value === CellValue.bomb &&
            cells[i][j].state === CellState.flagged
          ) {
            nFBombsArr.push({ row: i, col: j });
            nFBombs++;
          }
        }
        if (i === row && j === col + 1) {
          if (cells[i][j].state === CellState.flagged) {
            nFlags++;
          }
          if (cells[i][j].value === CellValue.bomb) {
            nFBombsArr.push({ row: i, col: j });
            nBombs++;
          }
          if (
            cells[i][j].value === CellValue.bomb &&
            cells[i][j].state === CellState.flagged
          ) {
            nFBombsArr.push({ row: i, col: j });
            nFBombs++;
          }
        }
        if (i === row + 1 && j === col - 1) {
          if (cells[i][j].state === CellState.flagged) {
            nFlags++;
          }
          if (cells[i][j].value === CellValue.bomb) {
            nBombs++;
          }
          if (
            cells[i][j].value === CellValue.bomb &&
            cells[i][j].state === CellState.flagged
          ) {
            nFBombsArr.push({ row: i, col: j });
            nFBombs++;
          }
        }
        if (i === row + 1 && j === col) {
          if (cells[i][j].state === CellState.flagged) {
            nFlags++;
          }
          if (cells[i][j].value === CellValue.bomb) {
            nBombs++;
          }
          if (
            cells[i][j].value === CellValue.bomb &&
            cells[i][j].state === CellState.flagged
          ) {
            nFBombsArr.push({ row: i, col: j });
            nFBombs++;
          }
        }
        if (i === row + 1 && j === col + 1) {
          if (cells[i][j].state === CellState.flagged) {
            nFlags++;
          }
          if (cells[i][j].value === CellValue.bomb) {
            nBombs++;
          }
          if (
            cells[i][j].value === CellValue.bomb &&
            cells[i][j].state === CellState.flagged
          ) {
            nFBombsArr.push({ row: i, col: j });
            nFBombs++;
          }
        }
      }
    }

    // eslint-disable-next-line
    let nBingo = 0;

    let distinct: any[] = [];
    for (let i = 0; i < nFBombsArr.length; i++) {
      if (distinct.indexOf(nFBombsArr[i]) === -1) {
        distinct.push(nFBombsArr[i]);
      }
    }
    nFBombsArr = distinct;

    nFBombsArr.forEach((el) => {
      if (
        el.row === row - 1 &&
        el.col === col - 1 &&
        cells[row - 1][col - 1].state === CellState.flagged &&
        cells[row][col].value !== CellValue.bomb &&
        cells[row][col].value !== CellValue.none &&
        cells[row][col].value === nFBombs
      ) {
        nBingo++;
      }
      if (
        el.row === row - 1 &&
        el.col === col &&
        cells[row - 1][col].state === CellState.flagged &&
        cells[row][col].value !== CellValue.bomb &&
        cells[row][col].value !== CellValue.none &&
        cells[row][col].value === nFBombs
      ) {
        nBingo++;
      }
      if (
        el.row === row - 1 &&
        el.col === col + 1 &&
        cells[row - 1][col + 1].state === CellState.flagged &&
        cells[row][col].value !== CellValue.bomb &&
        cells[row][col].value !== CellValue.none &&
        cells[row][col].value === nFBombs
      ) {
        nBingo++;
      }
      if (
        el.row === row &&
        el.col === col + 1 &&
        cells[row][col + 1].state === CellState.flagged &&
        cells[row][col].value !== CellValue.bomb &&
        cells[row][col].value !== CellValue.none &&
        cells[row][col].value === nFBombs
      ) {
        nBingo++;
      }
      if (
        el.row === row &&
        el.col === col - 1 &&
        cells[row][col - 1].state === CellState.flagged &&
        cells[row][col].value !== CellValue.bomb &&
        cells[row][col].value !== CellValue.none &&
        cells[row][col].value === nFBombs
      ) {
        nBingo++;
      }
      if (
        el.row === row + 1 &&
        el.col === col - 1 &&
        cells[row + 1][col - 1].state === CellState.flagged &&
        cells[row][col].value !== CellValue.bomb &&
        cells[row][col].value !== CellValue.none &&
        cells[row][col].value === nFBombs
      ) {
        nBingo++;
      }
      if (
        el.row === row + 1 &&
        el.col === col &&
        cells[row + 1][col].state === CellState.flagged &&
        cells[row][col].value !== CellValue.bomb &&
        cells[row][col].value !== CellValue.none &&
        cells[row][col].value === nFBombs
      ) {
        nBingo++;
      }
      if (
        el.row === row + 1 &&
        el.col === col + 1 &&
        cells[row + 1][col + 1].state === CellState.flagged &&
        cells[row][col].value !== CellValue.bomb &&
        cells[row][col].value !== CellValue.none &&
        cells[row][col].value === nFBombs
      ) {
        nBingo++;
      }
    });

    let res = nFlags === cells[row][col].value;

    return res;
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

  const handleCellClick = (
    rowParam: number,
    colParam: number,
    fromReval?: boolean
  ) => (): void => {
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
      // let isBomb = newCells[rowParam][colParam].value === CellValue.bomb;
      // if (isBomb) {
      //   newCells = gg(rowParam, colParam).slice();
      // }
      // while (isBomb) {
      //   newCells = generateCells();
      //   isBomb = newCells[rowParam][colParam].value === CellValue.bomb;
      // }
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

      setCells(newCells);
      return;
    } else if (currentCell.value === CellValue.none) {
      newCells = openMultipleCells(cells, rowParam, colParam);
    } else {
      // Click on a number
      newCells[rowParam][colParam].state = CellState.visible;
    }
    if (checkWin()) {
      setHesWon(true);
    }
    if (checkLost()) {
      setHesLost(true);
    }

    setCells(newCells);
  };

  const getSafeOpenCellsExist = () => {
    let numberOfOpenCells = 0;
    let existNotOpenBombs = 0;
    let bombWithFlag = 0;
    let flags = 0;

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
          currentCell.value === CellValue.bomb &&
          currentCell.state === CellState.flagged
        ) {
          bombWithFlag++;
        }
        if (currentCell.state === CellState.flagged) {
          flags++;
        }
      })
    );

    return { numberOfOpenCells, existNotOpenBombs, bombWithFlag, flags };
  };

  const checkWin = (): boolean => {
    let res = false;

    if (getSafeOpenCellsExist().numberOfOpenCells === 0) {
      // res = true;
    }

    return res;
  };

  const checkLost = (): boolean => {
    let res = false;

    // if (getSafeOpenCellsExist().numberOfOpenCells === 0) {
    //   res = true;
    // }
    // if (getSafeOpenCellsExist().bombWithFlag === NO_OF_BOMBS) {
    //   res = true;
    // }
    return res;
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
      console.log("rcl1");
      return;
    } else if (currentCell.state === CellState.open && bombCounter > -99) {
      currentCells[rowParam][colParam].state = CellState.flagged;
      console.log("rcl2", currentCells[rowParam][colParam]);
      setCells(currentCells);
      setBombCounter(bombCounter - 1);
    } else if (currentCell.state === CellState.flagged) {
      console.log("rcl3");
      currentCells[rowParam][colParam].state = CellState.open;
      setCells(currentCells);
      setBombCounter(bombCounter + 1);
    } else {
      console.log("rcl4");
    }

    if (checkWin()) {
      setHesWon(true);
    }
    if (checkLost()) {
      setHesLost(true);
    }
  };

  useEffect(() => {
    // if (getSafeOpenCellsExist().numberOfOpenCells > 0 && bombCounter === 0) {
    // setHesWon(true);
    // }
    if (checkWin()) {
      setHesWon(true);
    }
    if (checkLost()) {
      setHesLost(true);
    }
    // eslint-disable-next-line
  }, [bombCounter]);

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

  // eslint-disable-next-line
  const submit = () => {
    const testServer = () => {
      axios
        .get("/api")
        .then((response) => {
          const data = response.data;
          data.forEach((data: any) => {
            alert(`${data.owner} have ${data.games.length} games!`);
          });
        })
        .catch(() => {
          // alert("Error retrieving data!!!");
        });
    };

    const oneGame = {
      time: 10,
      date: new Date(),
    };
    const twoGame = {
      time: 20,
      date: new Date(),
    };
    const allGames = [oneGame, twoGame];

    const payload = {
      owner: "rame",
      games: allGames,
    };

    axios({
      url: "/api/save",
      method: "POST",
      data: payload,
    })
      .then(() => {
        testServer();
      })
      .catch((err) => {
        alert(`Error ${err}`);
      });
  };

  return (
    <div className="App">
      {/* <button onClick={submit}>create games</button> */}
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
