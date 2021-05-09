import { MAX_ROWS, MAX_COLS, NO_OF_BOMBS } from "../constants";
import { Cell, CellState, CellValue } from "../types";

const generateBombs = (
  cells2: Cell[][],
  numberOfBombs: number = NO_OF_BOMBS
) => {
  let cells = [...cells2];
  let bombPlaced = 0;

  while (bombPlaced < numberOfBombs) {
    let randomRow = Math.floor(Math.random() * MAX_ROWS);
    let randomCol = Math.floor(Math.random() * MAX_ROWS);
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

const grabAllAbjectnessCells = (
  cells: Cell[][],
  rowParam: number,
  colParam: number
): {
  topLeftCell: Cell | null;
  topCell: Cell | null;
  topRightCell: Cell | null;
  leftCell: Cell | null;
  rightCell: Cell | null;
  bottomLeftCell: Cell | null;
  bottomCell: Cell | null;
  bottomRightCell: Cell | null;
} => {
  const topLeftCell =
    rowParam > 0 && colParam > 0 ? cells[rowParam - 1][colParam - 1] : null;
  const topCell = rowParam > 0 ? cells[rowParam - 1][colParam] : null;
  const topRightCell =
    rowParam > 0 && colParam < MAX_COLS - 1
      ? cells[rowParam - 1][colParam + 1]
      : null;
  const leftCell = colParam > 0 ? cells[rowParam][colParam - 1] : null;
  const rightCell =
    colParam < MAX_COLS - 1 ? cells[rowParam][colParam + 1] : null;
  const bottomLeftCell =
    rowParam < MAX_ROWS - 1 && colParam > 0
      ? cells[rowParam + 1][colParam - 1]
      : null;
  const bottomCell =
    rowParam < MAX_ROWS - 1 && rowParam < MAX_ROWS - 1
      ? cells[rowParam + 1][colParam]
      : null;
  const bottomRightCell =
    rowParam < MAX_ROWS - 1 && colParam < MAX_COLS - 1
      ? cells[rowParam + 1][colParam + 1]
      : null;
  return {
    topLeftCell,
    topCell,
    topRightCell,
    leftCell,
    rightCell,
    bottomLeftCell,
    bottomCell,
    bottomRightCell,
  };
};

export const generateCells = (): Cell[][] => {
  let cells: Cell[][] = [];
  // Generate all Cells
  for (let row = 0; row < MAX_ROWS; row++) {
    cells.push([]);
    for (let col = 0; col < MAX_COLS; col++) {
      cells[row].push({ value: CellValue.none, state: CellState.open });
    }
  }

  // Randomly put 10 bombs
  cells = generateBombs(cells, NO_OF_BOMBS);

  // Calculate the number for each cell
  for (let rowIndex = 0; rowIndex < MAX_ROWS; rowIndex++) {
    for (let colIndex = 0; colIndex < MAX_COLS; colIndex++) {
      const currentCell = cells[rowIndex][colIndex];
      if (currentCell.value === CellValue.bomb) {
        continue;
      }

      let numberOfBombs = 0;
      const {
        topLeftCell,
        topCell,
        topRightCell,
        leftCell,
        rightCell,
        bottomLeftCell,
        bottomCell,
        bottomRightCell,
      } = grabAllAbjectnessCells(cells, rowIndex, colIndex);

      if (topLeftCell?.value === CellValue.bomb) numberOfBombs++;
      if (topCell?.value === CellValue.bomb) numberOfBombs++;
      if (topRightCell?.value === CellValue.bomb) numberOfBombs++;
      if (leftCell?.value === CellValue.bomb) numberOfBombs++;
      if (rightCell?.value === CellValue.bomb) numberOfBombs++;
      if (bottomLeftCell?.value === CellValue.bomb) numberOfBombs++;
      if (bottomCell?.value === CellValue.bomb) numberOfBombs++;
      if (bottomRightCell?.value === CellValue.bomb) numberOfBombs++;

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

export const openMultipleCells = (
  cells: Cell[][],
  rowParam: number,
  colParam: number
): Cell[][] => {
  let currentCell = cells[rowParam][colParam];
  if (
    currentCell.state === CellState.visible ||
    currentCell.state === CellState.flagged
  ) {
    return cells;
  }
  let newCells: Cell[][] = cells.slice();
  newCells[rowParam][colParam].state = CellState.visible;

  const {
    topLeftCell,
    topCell,
    topRightCell,
    leftCell,
    rightCell,
    bottomLeftCell,
    bottomCell,
    bottomRightCell,
  } = grabAllAbjectnessCells(cells, rowParam, colParam);

  if (
    topLeftCell?.state === CellState.open &&
    topLeftCell.value !== CellValue.bomb
  ) {
    topLeftCell.value === CellValue.none
      ? (newCells = openMultipleCells(newCells, rowParam - 1, colParam - 1))
      : (newCells[rowParam - 1][colParam - 1].state = CellState.visible);
  }

  if (topCell?.state === CellState.open && topCell.value !== CellValue.bomb) {
    topCell.value === CellValue.none
      ? (newCells = openMultipleCells(newCells, rowParam - 1, colParam))
      : (newCells[rowParam - 1][colParam].state = CellState.visible);
  }

  if (
    topRightCell?.state === CellState.open &&
    topRightCell.value !== CellValue.bomb
  ) {
    topRightCell.value === CellValue.none
      ? (newCells = openMultipleCells(newCells, rowParam - 1, colParam + 1))
      : (newCells[rowParam - 1][colParam + 1].state = CellState.visible);
  }

  if (leftCell?.state === CellState.open && leftCell.value !== CellValue.bomb) {
    leftCell.value === CellValue.none
      ? (newCells = openMultipleCells(newCells, rowParam, colParam - 1))
      : (newCells[rowParam][colParam - 1].state = CellState.visible);
  }

  if (
    rightCell?.state === CellState.open &&
    rightCell.value !== CellValue.bomb
  ) {
    rightCell.value === CellValue.none
      ? (newCells = openMultipleCells(newCells, rowParam, colParam + 1))
      : (newCells[rowParam][colParam + 1].state = CellState.visible);
  }

  if (
    bottomLeftCell?.state === CellState.open &&
    bottomLeftCell.value !== CellValue.bomb
  ) {
    bottomLeftCell.value === CellValue.none
      ? (newCells = openMultipleCells(newCells, rowParam + 1, colParam - 1))
      : (newCells[rowParam + 1][colParam - 1].state = CellState.visible);
  }

  if (
    bottomCell?.state === CellState.open &&
    bottomCell.value !== CellValue.bomb
  ) {
    bottomCell.value === CellValue.none
      ? (newCells = openMultipleCells(newCells, rowParam + 1, colParam))
      : (newCells[rowParam + 1][colParam].state = CellState.visible);
  }

  if (
    bottomRightCell?.state === CellState.open &&
    bottomRightCell.value !== CellValue.bomb
  ) {
    bottomRightCell.value === CellValue.none
      ? (newCells = openMultipleCells(newCells, rowParam + 1, colParam + 1))
      : (newCells[rowParam + 1][colParam + 1].state = CellState.visible);
  }

  return newCells;
};
