import React from "react";

import "./App.css";

import AppDev from "./components/App";
import UserContext from "./UserContext";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <UserContext>
          <AppDev />
        </UserContext>
      </div>
    );
  }
}

export default App;
