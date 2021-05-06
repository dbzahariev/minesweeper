// eslint-disable-next-line
import React, { useState, useEffect } from "react";
import { CellState, CellValue } from "../types";
import "../styles/Button.scss";

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
    // return value;
    // eslint-disable-next-line
    if (
      value !== CellValue.bomb &&
      value !== CellValue.none &&
      state === CellState.visible
    ) {
      return value;
    }
    return null;
    // return value;
  };
  const [prevClickType, setPrevClickType] = useState<string>("");

  useEffect(() => {
    console.log(prevClickType);
    const timer = setInterval(() => {
      setPrevClickType("");
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [prevClickType]);

  // const foo = (e: any) => {
  //   setPrevClickType(e.type);
  //   if (prevClickType !== "") {
  //     if (prevClickType === "click") {
  //       if (!hesDie) {
  //         onClick(row, col)();
  //       }
  //       // !hesDie ? onClick(row, col) : () => {};
  //     }
  //     if (prevClickType === "contextmenu") {
  //       onContext(row, col)(e);
  //     }
  //   }
  // };

  return (
    <button
      style={{ padding: 0, margin: 0 }}
      className={`Button ${
        state === CellState.visible ? "visible" : ""
      } value-${value} ${live ? "live" : ""}`}
      onContextMenu={onContext(row, col)}
      onClick={!hesDie ? onClick(row, col) : () => {}}
      // onClick={foo}
      // onContextMenu={foo}
    >
      {renderContent()}
    </button>
  );
};

export default Button;
