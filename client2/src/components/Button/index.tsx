import React from "react";
import { CellState, CellValue } from "../../types";
import "./Button.scss";

const Button: React.FC<{
  row: number;
  col: number;
  state: CellState;
  value: CellValue;
  live: boolean;
  red?: boolean;
  hesDie: boolean;
  onClick(rowParam: number, colParam: number): (...args: any[]) => void;
  onContext(rowParam: number, colParam: number): (...args: any[]) => void;
}> = ({ state, value, row, col, onClick, onContext, red, live, hesDie }) => {
  const renderContent = (): React.ReactNode => {
    if (state === CellState.visible) {
      if (value === CellValue.bomb) {
        return (
          <span role={"img"} aria-label="bomb">
            💣
          </span>
        );
      } else if (value !== CellValue.none) {
        return <span>{value}</span>;
      } else if (value === CellValue.none) {
        return null;
      }
    } else if (state === CellState.flagged) {
      return (
        <span role="img" aria-label="flag">
          🚩
        </span>
      );
    }

    return null;
  };

  return (
    <div
      className={`Button ${
        state === CellState.visible ? "visible" : ""
      } value-${value} ${red ? "red" : ""} ${live ? "live" : ""}`}
      onClick={!hesDie ? onClick(row, col) : () => {}}
      onContextMenu={onContext(row, col)}
    >
      {renderContent()}
    </div>
  );
};

export default Button;
