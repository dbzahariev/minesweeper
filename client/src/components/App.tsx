import axios from "axios";
import React from "react";
import ExportAndImport from "./ExportAndImport";
import Minesweeper from "./Minesweeper";
import Table2 from "./Table";

export default function App() {
  const getAllGames = () => {
    console.log("log game:");
    axios
      .get("/api")
      .then((response) => {
        const data = response.data;
        console.log(data);
        // data.forEach((data: any) => {
        //   // console.log(data);
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
        const gamesForId = response.data.games;
        console.log(gamesForId);
      })
      .catch(() => {
        alert("Error retrieving data!!!");
      });
  };

  const testServer = () => {
    axios
      .get("/api")
      .then((response) => {
        const data = response.data;
        data.forEach((data: any) => {
          alert(`${data.owner} have ${data.games.length} games!`);
        });
      })
      .catch(() => {
        alert("Error retrieving data!!!");
      });
  };

  // eslint-disable-next-line
  const submit = () => {
    const oneGame = {
      time: 10,
      date: new Date(),
    };
    const twoGame = {
      time: 20,
      date: new Date(),
    };
    const allGames = [oneGame, twoGame];

    const payload = {
      owner: "rame",
      games: allGames,
    };

    axios({
      url: "/api/save",
      method: "POST",
      data: payload,
    })
      .then(() => {
        testServer();
      })
      .catch((err) => {
        alert(`Error ${err}`);
      });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        // width: "200%",
        // height: "100%",
        // background: "green",
      }}
    >
      <div
        style={
          {
            // display: "flex",
            // width: "50%",
            // flexDirection: "column",
            // justifyContent: "space-between",
            // alignItems: "center",
          }
        }
      >
        <ExportAndImport />
        <button onClick={getAllGames}>gag</button>
        <button onClick={getGamesById}>gag by id</button>
      </div>
      <Minesweeper />
      <Table2 ownerName="rame" />
    </div>
  );
}
