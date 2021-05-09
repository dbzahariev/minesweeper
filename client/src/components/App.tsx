import Minesweeper from "./Minesweeper";
import "../styles/Button.scss";
import "../styles/Minesweeper.scss";
import Table2 from "./Table2";
import ExportAndImport from "./ExportAndImport";
import axios from "axios";

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
      </div>
      <Minesweeper />
      <Table2 ownerName="rame" />
    </div>
  );
}
