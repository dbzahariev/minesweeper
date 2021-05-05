import React, { useState, useEffect } from "react";
import { Cell, CellState, CellValue, Face } from "../types";
import { generateCells, openMultipleCells } from "../utils";
import NumberDisplay from "./NumberDisplay";
import Button from "./Button";
import "../styles/App.scss";
import { MAX_COLS, MAX_ROWS, NO_OF_BOMBS } from "../constants";
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
      setCells(showAllBombs());
      setLive(false);
      setFace(Face.lost);
    } else {
      setFace(Face.smile);
    }
    // eslint-disable-next-line
  }, [hesLost]);

  useEffect(() => {
    if (hesWon) {
      setLive(false);
      setFace(Face.won);
    }
  }, [hesWon]);

  const handleDoubleClick = (
    rowParam: number,
    colParam: number
  ) => (): void => {
    // let newCells: Cell[][] = cells.slice();
    // const currentCell = newCells[rowParam][colParam];
    // if (
    //   currentCell.value !== CellValue.bomb &&
    //   currentCell.value !== CellValue.none
    // ) {
    //   if (live) {
    //     handleCellClick(rowParam - 1, colParam)();
    //     handleCellClick(rowParam - 1, colParam - 1)();
    //     handleCellClick(rowParam - 1, colParam + 1)();
    //     handleCellClick(rowParam, colParam - 1)();
    //     handleCellClick(rowParam, colParam + 1)();
    //     handleCellClick(rowParam + 1, colParam)();
    //     handleCellClick(rowParam + 1, colParam - 1)();
    //     handleCellClick(rowParam + 1, colParam + 1)();
    //   }
    // }
  };

  const checkBombsAroundMe = (row: number, col: number): boolean => {
    const checkFlagAroundMe = (row: number, col: number): number => {
      const check = (row: number, col: number, test?: boolean): string => {
        const checkAllow = (row: number, col: number): boolean => {
          let res = true;
          if (row < 0 || col < 0) {
            res = false;
          }
          if (row >= MAX_ROWS || col >= MAX_COLS) {
            res = false;
          }
          return res;
        };
        let res: string = "";
        if (test) {
          console.log({ row, col });
        }
        if (checkAllow(row, col)) {
          if (cells[row][col].state === CellState.flagged) {
            res = "flag";
          }
          if (cells[row][col].value === CellValue.bomb) {
            res = "bomb";
          }
        }
        return res;
      };

      let nFlags = 0;

      if (check(row - 1, col - 1) === "flag") nFlags++;
      if (check(row - 1, col) === "flag") nFlags++;
      if (check(row - 1, col + 1) === "flag") nFlags++;

      if (check(row, col - 1) === "flag") nFlags++;
      if (check(row, col + 1) === "flag") nFlags++;

      if (check(row + 1, col - 1) === "flag") nFlags++;
      if (check(row + 1, col, true) === "flag") nFlags++;
      if (check(row + 1, col + 1) === "flag") nFlags++;

      return nFlags;
    };

    let res = false;
    let nFlags = checkFlagAroundMe(row, col);
    console.log("hi bombs", { nFlags, row, col });
    return res;
  };

  const handleCellClick = (rowParam: number, colParam: number) => (): void => {
    if (
      rowParam < 0 ||
      colParam >= MAX_COLS ||
      colParam < 0 ||
      rowParam >= MAX_ROWS
    ) {
      return;
    }

    if (checkBombsAroundMe(rowParam, colParam)) {
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

    const currentCell = newCells[rowParam][colParam];

    if ([CellState.flagged, CellState.visible].includes(currentCell.state)) {
      return;
    }

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
    }

    if (currentCell.state !== CellState.visible) {
      currentCell.state = CellState.visible;
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
    // if (checkWin) {
    //   setHesWon(true);
    // }
  };

  useEffect(() => {
    if (getSafeOpenCellsExist(cells) && bombCounter === 0) {
      setHesWon(true);
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
            onDoubleClick={handleDoubleClick}
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
    console.clear();
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
    axios
      .get("/api")
      .then((response) => {
        const data = response.data;
        data.forEach((data: any) => {
          // eslint-disable-next-line
          let { owner, games } = data;
        });

        console.log("Data has been received!!");
      })
      .catch(() => {
        // alert("Error retrieving data!!!");
      });
  };

  // eslint-disable-next-line
  const submit = () => {
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
        console.log("Data has been sent to the server");
        testServer();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    testServer();
  }, []);

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
