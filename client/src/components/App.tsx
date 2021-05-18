import Minesweeper from "./Minesweeper";
import "../styles/Button.scss";
import "../styles/Minesweeper.scss";
// eslint-disable-next-line
import Table2 from "./Table2";
// eslint-disable-next-line
import ExportAndImport from "./ExportAndImport";
// eslint-disable-next-line
import axios from "axios";
import { notification } from "antd";
// eslint-disable-next-line
import { useContext, useState } from "react";
// eslint-disable-next-line
import Login from "./Login";
import TopRecords from "./TopRecords";
import LoginMini from "./LoginMini";
import { UserContext } from "../UserContext";
import { useEffect } from "react";

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

export let owner = "";
export const changeOwner = (newName: string) => {
  owner = newName;
};

export default function App() {
  // eslint-disable-next-line
  // const [nameForTable, setNameForTable] = useState<string>("");

  // const refresh = () => {
  //   setNameForTable("");
  // };

  // const refresh2 = (name: string) => {
  //   setNameForTable(name);
  // };

  // useEffect(() => {
  //   checkLogin();
  // }, []);

  // const getLoginUser = (): string | null => {
  //   let username: string = nameForTable || "";
  //   if (username.length > 0) {
  //     return username;
  //   } else {
  //     return null;
  //   }
  // };

  // const checkLogin = () => {
  //   let username: string = localStorage.getItem("username") || "";
  //   if (username.length > 0) {
  //     setNameForTable(username);
  //   } else setNameForTable("");
  // };

  // const [nameForTable, setNameForTable] = useState("rame");
  // useEffect(() => {

  //   // owner = nameForTable;
  // }, [nameForTable]);

  // const getNameForTable = () => {
  //   // let result = "";
  //   let result = nameForTable;
  //   return result;
  // };

  // eslint-disable-next-line
  const [reload, setReload] = useState(0);

  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    let savedUser = localStorage.getItem("username");
    if (!user && savedUser) {
      setUser(savedUser);
    }
    // eslint-disable-next-line
  }, []);

  // eslint-disable-next-line
  const cleanUp = () => {
    axios({
      method: "POST",
      data: { owner: "ramsess" },
      withCredentials: true,
      url: `/api/cleanup`,
    })
      .then(({ data }) => {})
      .catch((err) => {});
  };

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
        {/* <Button onClick={cleanUp}>CleanUp</Button> */}
        {/* <Button onClick={addGame}>add game</Button> */}
        <LoginMini />
        <Minesweeper ss={setReload} setReload={setReload} reload={reload} />
        {/* <Table2 ownerName={nameForTable} /> */}
        {true ? <TopRecords reload={reload} /> : null}
      </div>
    </div>
  );
}
