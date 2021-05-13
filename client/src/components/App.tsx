import Minesweeper from "./Minesweeper";
import "../styles/Button.scss";
import "../styles/Minesweeper.scss";
// eslint-disable-next-line
import Table2 from "./Table2";
import ExportAndImport from "./ExportAndImport";
import axios from "axios";
import { notification } from "antd";
import { useEffect, useState } from "react";
// eslint-disable-next-line
import Login from "./Login";
import TopRecords from "./TopRecords";
import LoginMini from "./LoginMini";

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
  // eslint-disable-next-line
  const [nameForTable, setNameForTable] = useState<string[] | null>(null);

  useEffect(() => {
    checkLogin();
  }, []);

  const getLoginUser = (): string | null => {
    let username: string = localStorage.getItem("username") || "";
    if (username.length > 0) {
      return username;
      // setNameForTable([username]);
      // window.location.reload();
    } else {
      return null;
      // setNameForTable([]);
    }
  };

  const checkLogin = () => {
    let username: string = localStorage.getItem("username") || "";
    if (username.length > 0) {
      setNameForTable([username]);
      // window.location.reload();
    } else setNameForTable([]);
  };

  // eslint-disable-next-line
  const testButton = () => {
    const getGamesById = () => {
      let ownerId = "609580eb5a5d3a17c8002231";
      axios
        .get(`/api?id=${ownerId}`)
        .then((response) => {
          // eslint-disable-next-line
          const gamesForId = response.data.games;
        })
        .catch(() => {
          alert("Error retrieving data!!!");
        });
    };

    const logInUser = ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => {
      axios({
        method: "POST",
        data: {
          username: username,
          password: password,
        },
        withCredentials: true,
        url: "/user/login",
      })
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    };

    const getAllGames = () => {
      axios
        .get("/api")
        .then((response) => {})
        .catch((err) => {});
    };

    const getUser = () => {
      axios({
        method: "GET",
        withCredentials: true,
        url: "/user/showMyUsername",
      })
        .then((res) => {})
        .catch((err) => {});
    };

    const regUser = ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => {
      axios({
        method: "POST",
        data: {
          username: username,
          password: password,
        },
        withCredentials: true,
        url: "/user/register",
      }).then((res) => console.log(res));
    };

    return (
      <div
        style={{
          display: "flex",
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <ExportAndImport />
        <button onClick={getAllGames}>gag</button>
        <button onClick={getGamesById}>gag by id</button>
        <button
          onClick={() => regUser({ username: "ramsess", password: "123456" })}
        >
          {`reg 1`}
        </button>
        <button
          onClick={() => regUser({ username: "rame", password: "123456" })}
        >
          {`reg 2`}
        </button>
        <button
          onClick={() => logInUser({ username: "ramsess", password: "123456" })}
        >
          {`log 1`}
        </button>
        <button
          onClick={() => logInUser({ username: "rame", password: "1123456" })}
        >
          {`log 2`}
        </button>
        <button onClick={getUser}>get user</button>
      </div>
    );
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
        <LoginMini />
        <Minesweeper />
        {/* <Table2 ownerName={nameForTable} /> */}
        {getLoginUser() ? <TopRecords /> : null}
      </div>
    </div>
  );
}
