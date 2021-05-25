import { useReducer, useState } from "react";
import "./App.css";
import AppDev from "./components/App";
import { reducer } from "./assistants/Redux";

function App() {
  const [todos, dispatch] = useReducer(
    reducer,
    JSON.parse(sessionStorage.getItem("todos")) || []
  );

  const [username, setUsername] = useState(
    sessionStorage.getItem("username") || ""
  );

  // const [games, setGames] = useState([]);

  return (
    <div className="App">
      <AppDev
        redux={{
          todos,
          dispatch,
          user: { username, setUsername },
        }}
      />
    </div>
  );
}

export default App;
