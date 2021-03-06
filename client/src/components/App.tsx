import Minesweeper from "./Minesweeper";
import "../styles/Button.scss";
import "../styles/Minesweeper.scss";
import { notification, Space } from "antd";
import { useEffect, useState } from "react";
import LoginMini from "./LoginMini";
import Settings from "./Settings";
import { TypeRedux } from "../assistants/Redux";
import { ChangeCost, MAX_ROWS } from "../assistants/Constants";
import TopRecords from "./TopRecords";

export const showNotification = (
  message: string,
  duration: number,
  type?: "success" | "error" | "info" | "warning" | "open"
) => {
  if (type) {
    notification[type]({ message, duration });
  } else {
    notification.open({ message, duration });
  }
};

export const updateRows = (redux: TypeRedux) => {
  let settings: { height: number; width: number; mines: number } = JSON.parse(
    redux.todos.find((el) => el.username === redux.user.username)?.settings ||
      `{"height":9,"width":9,"mines":11}`
  );
  let newSett: { rows: number; cols: number; bombs: number } = {
    rows: settings.height,
    cols: settings.width,
    bombs: settings.mines,
  };

  ChangeCost(newSett.rows, newSett.cols, newSett.bombs);
};

export default function App({ redux }: { redux: TypeRedux }) {
  const [reload, setReload] = useState(0);

  useEffect(() => {
    if (redux.user.username.length > 0) {
      updateRows(redux);
      setReload(reload + 1);
    }
    // eslint-disable-next-line
  }, [redux.todos.find((el) => el.username === redux.user.username)?.settings]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        padding: 0,
        margin: 0,
      }}
    >
      <div style={{ width: "100%", height: "100%" }}>
        <Space>
          <LoginMini redux={redux} />
          <Settings redux={redux} />
        </Space>
        {redux.user.username.length > 0 ? (
          <>
            {MAX_ROWS !== -1 ? (
              <Minesweeper
                redux={redux}
                reload={reload}
                setReload={setReload}
              />
            ) : null}
            <TopRecords redux={redux} reload={reload} />
          </>
        ) : (
          <div style={{ width: "97vw", height: "91vh" }}></div>
        )}
      </div>
    </div>
  );
}
