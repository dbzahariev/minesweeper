import React, { useState, useEffect } from "react";
import { Table } from "antd";
import axios from "axios";

interface NumberDisplayProps {
  ownerId: string;
}
const Table2: React.FC<NumberDisplayProps> = ({ ownerId }) => {
  const [data, setData] = useState<any[]>([]);
  const getGamesById = (ownerId: string = "609580eb5a5d3a17c8002231") => {
    axios
      .get(`/api?id=${ownerId}`)
      .then((response) => {
        const gamesForId = response.data.games;
        setData(gamesForId);
        console.log(gamesForId);
      })
      .catch(() => {
        alert("Error retrieving data!!!");
      });
  };

  useEffect(() => {
    getGamesById(ownerId);
  }, [ownerId]);

  let dataSource: {
    key: number;
    time: number;
    date: string;
  }[] = [];
  data.forEach((el, elIndex) => {
    let foo = { key: elIndex + 1, time: el.time, date: el.date };
    dataSource.push(foo);
  });

  const columns = [
    {
      title: "No",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
  ];

  return (
    <div
      style={{
        width: "400px",
        // height: "300px",
        borderWidth: "2px",
        borderColor: "black",
        borderStyle: "solid",
      }}
    >
      <Table dataSource={dataSource} columns={columns} />;
    </div>
  );
};

export default Table2;
