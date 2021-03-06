import React, { useState, useEffect } from "react";
import { CellState, CellValue } from "../assistants/Types";
import "../styles/Button.scss";

function Button({
  state,
  value,
  row,
  col,
  live,
  red,
  hesDie,
  onClick,
  onContext,
}: {
  state: CellState;
  value: CellValue;
  row: number;
  col: number;
  live: boolean;
  red?: boolean;
  hesDie: boolean;
  onClick(rowParam: number, colParam: number): (...args: any[]) => void;
  onContext(rowParam: number, colParam: number): (...args: any[]) => void;
}) {
  const renderContent = (): React.ReactNode => {
    if (state === CellState.flagged && value === CellValue.bomb) {
      return (
        <div style={{ height: "100%", width: "100%" }} className={`flag`} />
      );
    }
    if (state === CellState.flagged && value !== CellValue.bomb) {
      return (
        <div
          style={{ height: "100%", width: "100%" }}
          className={`${live ? "flag" : "wrong-bomb"}`}
        />
      );
    }
    if (value === CellValue.bomb && state === CellState.visible) {
      return (
        <div
          style={{ height: "100%", width: "100%" }}
          className={`bomb${red ? "-red" : ""}`}
        />
      );
    }
    if (
      value !== CellValue.bomb &&
      value !== CellValue.none &&
      state === CellState.visible
    ) {
      return value;
    }
    return null;
  };
  const [prevClickType, setPrevClickType] = useState<string>("");

  useEffect(() => {
    const timer = setInterval(() => {
      setPrevClickType("");
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [prevClickType]);

  return (
    <button
      style={{ padding: 0, margin: 0 }}
      className={`Button ${
        state === CellState.visible ? "visible" : ""
      } value-${value} ${live ? "live" : ""}`}
      onContextMenu={onContext(row, col)}
      onClick={!hesDie ? onClick(row, col) : () => {}}
    >
      {renderContent()}
    </button>
  );
}

export default Button;
