import { MAX_ROWS, MAX_COLS } from "../constants";
import { Cell, CellState, CellValue } from "../types";

export const generateCells = (): Cell[][] => {
  let cells: Cell[][] = [];

  for (let row = 0; row < MAX_ROWS; row++) {
    cells.push([]);
    for (let col = 0; col < MAX_COLS; col++) {
      cells[row].push({ value: CellValue.none, state: CellState.open });
    }
  }

  return cells;
};
