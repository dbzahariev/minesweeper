export let MAX_ROWS = -1;
export let MAX_COLS = -1;
export let NO_OF_BOMBS = -1;

export const ChangeCost = (rows: number, cols: number, bombs: number) => {
  MAX_ROWS = rows;
  MAX_COLS = cols;
  NO_OF_BOMBS = bombs;
};
