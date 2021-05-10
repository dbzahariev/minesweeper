import Minesweeper from "./Minesweeper";
import "../styles/Button.scss";
import "../styles/Minesweeper.scss";
import Table2 from "./Table2";
import ExportAndImport from "./ExportAndImport";
import axios from "axios";

export default function App() {
  const getAllGames = () => {
    axios
      .get("/api")
      .then((response) => {
        // eslint-disable-next-line
        const data = response.data;
        // data.forEach((data: any) => {
        //   alert(`${data.owner} have ${data.games.length} games!`);
        // });
      })
      .catch(() => {
        alert("Error retrieving data!!!");
      });
  };

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

  const getUser = () => {
    console.log("hii");
    axios({
      method: "GET",
      withCredentials: true,
      url: "/user/showMyUsername",
    })
      .then((res) => {
        // setData(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  return (
    <div>
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
        {/* <button onClick={testServer}>ts</button> */}
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
      <Minesweeper />
      <Table2 ownerName="rame" />
    </div>
  );
}
