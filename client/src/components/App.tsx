import Minesweeper from "./Minesweeper";
import "../styles/Button.scss";
import "../styles/Minesweeper.scss";
import { notification } from "antd";
// eslint-disable-next-line
import { useContext, useState } from "react";
import TopRecords from "./TopRecords";
import LoginMini from "./LoginMini";
// eslint-disable-next-line
import { UserContext } from "../UserContext";
// eslint-disable-next-line
import { useEffect } from "react";
import Settings from "./Settings";

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

export default function App() {
  const [reload, setReload] = useState(0);

  // const { user, setUser } = useContext(UserContext);

  // useEffect(() => {
  //   let savedUser = localStorage.getItem("username");
  //   if (!user && savedUser) {
  //     setUser(savedUser);
  //   }
  // }, [user, setUser]);

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
        <Settings />
        <LoginMini />
        <Minesweeper ss={setReload} setReload={setReload} reload={reload} />
        <TopRecords reload={reload} />
      </div>
    </div>
  );
}
