import React, { useState, createContext } from "react";
export const UserContext = createContext();

export default function UserProvider(props) {
  const [user, setUser] = useState(sessionStorage.getItem("username") || "");
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {props.children}
    </UserContext.Provider>
  );
}
