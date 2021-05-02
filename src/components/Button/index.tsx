import React from "react";
import { CellState, CellValue } from "../../types";
import "./Button.scss";

const Button: React.FC<{
  row: number;
  col: number;
  state: CellState;
  value: CellValue;
}> = ({ row, col, state, value }) => {
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
      } value-${value}`}
    >
      {renderContent()}
    </div>
  );
};

export default Button;
