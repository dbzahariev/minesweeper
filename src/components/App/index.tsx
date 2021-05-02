import React, { useState } from "react";
import { Cell } from "../../types";
import { generateCells } from "../../utils";
import NumberDisplay from "../NumberDisplay";
import Button from "../Button";
import "./App.scss";

const App: React.FC = () => {
  const [cells, setCells] = useState<Cell[][]>([]);

  if (cells.length === 0) {
    setCells(generateCells());
  }

  const renderCells = (): React.ReactNode => {
    return cells.map((row, rowIndex) =>
      row.map((cell, cellIndex) => {
        return (
          <Button
            key={`${rowIndex - cellIndex}`}
            state={cell.state}
            value={cell.value}
            row={rowIndex}
            col={cellIndex}
          />
        );
      })
    );
  };

  return (
    <div className="App">
      <div className="Header">
        <NumberDisplay value={0} />
        <div className="Face">😁</div>
        <NumberDisplay value={23} />
      </div>
      <div className="Body">{renderCells()}</div>
    </div>
  );
};

export default App;
