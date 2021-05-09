import React, { useState, useEffect } from "react";
import { Space, Table, Typography } from "antd";
import axios from "axios";
import { ColumnsType } from "antd/lib/table";
// type masterType = { time: number; date: string };
type masterType = { time: number; date: string; owner: string };
// type dataSourceType = { time: number; date: string; key: number };
type dataSourceType = {
  owner: string;
  time: number;
  date: string;
  key: number;
};

type FilterFieldsType = {
  text: string;
  value: string;
  children?: {
    text: string;
    value: string;
  }[];
};

interface Table2Props {
  ownerId?: string;
  ownerName: string;
}

const Table2: React.FC<Table2Props> = ({ ownerId = "", ownerName }) => {
  const [data, setData] = useState<masterType[]>([]);
  const [filterFields, setFilterFields] = useState<FilterFieldsType[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortTime, setSortTime] = useState<"descend" | "ascend" | null>(null);

  useEffect(() => {
    // getGamesById(ownerId);
    getAllGames();
    // eslint-disable-next-line
  }, []);

  // console.log(getFF());

  const getAllGames = () => {
    axios
      .get(`/api`)
      .then((response) => {
        const allGames: masterType[] = response.data;

        let newData: masterType[] = [];
        let newFilterFields: FilterFieldsType[] = [];
        allGames.forEach((el: any) => {
          el.games.forEach((game: any) => {
            let gameToAdd: masterType = {
              time: game.time,
              date: game.date,
              owner: el.owner,
            };
            newData.push(gameToAdd);
            let newFf: FilterFieldsType = { text: el.owner, value: el.owner };
            let indexOfStevie = newFilterFields.findIndex(
              (i) => i.value === newFf.value
            );
            if (indexOfStevie === -1) {
              newFilterFields.push(newFf);
            }
          });
        });

        setData(newData);
        setFilterFields(newFilterFields);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        alert("Error retrieving data!!!");
      });
  };

  // eslint-disable-next-line
  const getGamesById = (ownerId: string = "609580eb5a5d3a17c8002231") => {
    axios
      .get(`/api?id=${ownerId}`)
      .then((response) => {
        const gamesForId: masterType[] = response.data.games;

        // gamesForId.sort((a, b) => a.time - b.time);

        setData([...gamesForId, ...gamesForId, ...gamesForId, ...gamesForId]);
        setLoading(false);
        console.log(gamesForId);
      })
      .catch(() => {
        setLoading(false);
        alert("Error retrieving data!!!");
      });
  };

  const fff = (): string[] | undefined => {
    // console.log(ownerName);
    // if (ownerName) {
    //   return [ownerName];
    // } else {
    //   return undefined;
    // }
    return [ownerName];
  };
  console.log(fff());

  const columns: ColumnsType<dataSourceType> = [
    {
      title: "No",
      dataIndex: "key",
      key: "key",
      width: 60,
    },
    {
      title: "Person",
      dataIndex: "owner",
      key: "owner",
      filters: filterFields,
      onFilter: (value: any, record: any) => {
        return value === record.owner;
      },
      defaultFilteredValue: fff(),
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      sorter: (a: masterType, b: masterType) => a.time - b.time,
      sortOrder: sortTime,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
  ];

  let dataSource: dataSourceType[] = data.map((el, elIndex) => ({
    key: elIndex + 1,
    time: el.time,
    date: el.date,
    owner: el.owner,
  }));

  const onChange = (a1: any, a2: any, a3: any, a4: any) => {
    if (a4.action === "sort") {
      if (sortTime === "descend") setSortTime(null);
      if (sortTime === "ascend") setSortTime("descend");
      if (sortTime === null) setSortTime("ascend");
    }
  };

  return (
    <div
      style={{
        width: "600px",
        height: "660px",
        // borderWidth: "2px",
        // borderColor: "black",
        // borderStyle: "solid",
      }}
    >
      <Table
        title={() => {
          return (
            <Space
              style={{ width: "100%" }}
              align="center"
              direction="vertical"
            >
              <Typography.Text>Hi</Typography.Text>
            </Space>
          );
        }}
        showSorterTooltip={false}
        loading={loading}
        bordered={true}
        dataSource={dataSource}
        columns={columns}
        // scroll={{ y: 110 }}
        size="large"
        onChange={onChange}
        pagination={{ position: ["bottomCenter"], size: "small" }}
      />
    </div>
  );
};

export default Table2;
