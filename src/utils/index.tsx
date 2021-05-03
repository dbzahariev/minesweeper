import { MAX_ROWS, MAX_COLS, NO_OF_BOMBS } from "../constants";
import { Cell, CellState, CellValue } from "../types";

// eslint-disable-next-line
const generateBombs = (
  cells2: Cell[][],
  numberOfBombs: number = NO_OF_BOMBS
) => {
  let cells = [...cells2];
  let bombPlaced = 0;
  while (bombPlaced < numberOfBombs) {
    const randomRow = Math.floor(Math.random() * MAX_ROWS);
    const randomCol = Math.floor(Math.random() * MAX_COLS);
    const currentCell = cells[randomRow][randomCol];
    if (currentCell.value !== CellValue.bomb) {
      cells = cells.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          if (randomRow === rowIndex && randomCol === colIndex) {
            return { ...cell, value: CellValue.bomb };
          } else {
            return cell;
          }
        })
      );
      bombPlaced++;
    }
  }
  return cells;
};

// eslint-disable-next-line
const generateFlags = (cells2: Cell[][], countFlag: number = 5) => {
  let cells = [...cells2];
  let flagPlaced = 0;
  while (flagPlaced < countFlag) {
    const randomRow = Math.floor(Math.random() * MAX_ROWS);
    const randomCol = Math.floor(Math.random() * MAX_COLS);
    const currentCell = cells[randomRow][randomCol];
    if (currentCell.state !== CellState.flagged) {
      cells = cells.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          if (randomRow === rowIndex && randomCol === colIndex) {
            return { ...cell, state: CellState.flagged };
          } else {
            return cell;
          }
        })
      );
      flagPlaced++;
    }
  }
  return cells;
};

export const generateCells = (): Cell[][] => {
  let cells: Cell[][] = [];

  // Generate all Cells
  for (let row = 0; row < MAX_ROWS; row++) {
    cells.push([]);
    for (let col = 0; col < MAX_COLS; col++) {
      cells[row].push({ value: CellValue.none, state: CellState.open }); // TODO: Thus default is must be state: CellState.open
    }
  }

  // Randomly put 10 bombs
  cells = generateBombs(cells, NO_OF_BOMBS);

  // Randomly put 5 flags
  // cells = generateFlags(cells, 5);

  // Calculate the number for each cell
  for (let rowIndex = 0; rowIndex < MAX_ROWS; rowIndex++) {
    for (let colIndex = 0; colIndex < MAX_COLS; colIndex++) {
      const currentCell = cells[rowIndex][colIndex];
      if (currentCell.value === CellValue.bomb) {
        continue;
      }

      let numberOfBombs = 0;
      const topLeftBomb =
        rowIndex > 0 && colIndex > 0 ? cells[rowIndex - 1][colIndex - 1] : null;
      const topBomb = rowIndex > 0 ? cells[rowIndex - 1][colIndex] : null;
      const topRightBomb =
        rowIndex > 0 && colIndex < MAX_COLS - 1
          ? cells[rowIndex - 1][colIndex + 1]
          : null;
      const leftBomb = colIndex > 0 ? cells[rowIndex][colIndex - 1] : null;
      const rightBomb =
        colIndex < MAX_COLS - 1 ? cells[rowIndex][colIndex + 1] : null;
      const bottomLeftBomb =
        rowIndex < MAX_ROWS - 1 && colIndex > 0
          ? cells[rowIndex + 1][colIndex - 1]
          : null;
      const bottomBomb =
        rowIndex < MAX_ROWS - 1 && rowIndex < MAX_ROWS - 1
          ? cells[rowIndex + 1][colIndex]
          : null;
      const bottomRightBomb =
        rowIndex < MAX_ROWS - 1 && colIndex < MAX_COLS - 1
          ? cells[rowIndex + 1][colIndex + 1]
          : null;

      if (topLeftBomb?.value === CellValue.bomb) numberOfBombs++;
      if (topBomb?.value === CellValue.bomb) numberOfBombs++;
      if (topRightBomb?.value === CellValue.bomb) numberOfBombs++;
      if (leftBomb?.value === CellValue.bomb) numberOfBombs++;
      if (rightBomb?.value === CellValue.bomb) numberOfBombs++;
      if (bottomLeftBomb?.value === CellValue.bomb) numberOfBombs++;
      if (bottomBomb?.value === CellValue.bomb) numberOfBombs++;
      if (bottomRightBomb?.value === CellValue.bomb) numberOfBombs++;

      if (numberOfBombs > 0) {
        cells[rowIndex][colIndex] = {
          ...currentCell,
          value: numberOfBombs,
        };
      }
    }
  }

  return cells;
};
