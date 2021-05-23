import React from "react";
import { ACTIONS } from "../assistants/Redux";

export default function Todo({
  todo,
  dispatch,
}: {
  todo: {
    complete: boolean;
    id: Date;
    name: string;
  };
  dispatch: Function;
}) {
  const toggle = () => {
    dispatch({ type: ACTIONS.TOGGLE_TODO, payload: { id: todo.id } });
  };

  const remove = () => {
    dispatch({ type: ACTIONS.DELETE_TODO, payload: { id: todo.id } });
  };

  return (
    <div>
      <span style={{ color: todo.complete ? "#AAA" : "#000" }}>
        {todo.name}{" "}
      </span>
      <button onClick={toggle}>TOGGLE</button>
      <button onClick={remove}>DELETE</button>
    </div>
  );
}
