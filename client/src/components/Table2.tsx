import { useState, useEffect } from "react";
import { Space, Table, Typography } from "antd";
import axios from "axios";
import { ColumnsType } from "antd/lib/table";

type masterType = { time: number; date: string; owner: string };

type dataSourceType = {
  owner: string;
  time: number;
  date: string;
  key: number;
  index: number;
};

type FilterFieldsType = {
  text: string;
  value: string;
  children?: {
    text: string;
    value: string;
  }[];
};

function Table2({
  ownerName = null,
  reload = 0,
}: {
  ownerName: string[] | null;
  reload: number;
}) {
  const [data, setData] = useState<masterType[]>([]);
  const [filterFields, setFilterFields] = useState<FilterFieldsType[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortTime, setSortTime] = useState<"descend" | "ascend" | null>(null);

  useEffect(() => {
    getAllGames();
    // eslint-disable-next-line
  }, [reload, ownerName]);

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

  const getData = () => {
    let result: dataSourceType[] = [];
    let names: string[] = [];
    data.forEach((el) => {
      if (names.indexOf(el.owner) === -1) {
        names.push(el.owner);
      }
    });
    names.forEach((name) => {
      let miniData: any[] = data.filter((el) => el.owner === name);
      miniData.forEach((el, elIndex) => {
        let indexedGame = { ...el, index: elIndex + 1 };
        result.push(indexedGame);
      });
    });
    return result;
  };

  let dataSource: dataSourceType[] = getData().map((el, elIndex) => ({
    key: elIndex,
    time: el.time,
    date: new Date(el.date).toLocaleString("bg-bg"),
    owner: el.owner,
    index: el.index,
  }));

  const onChange = (a1: any, a2: any, a3: any, a4: any) => {
    if (a4.action === "sort") {
      if (sortTime === "descend") setSortTime(null);
      if (sortTime === "ascend") setSortTime("descend");
      if (sortTime === null) setSortTime("ascend");
    }
  };

  const getLoginUser = () => {
    let username: string = localStorage.getItem("username") || "";
    if (username) return [username];
    else return null;
  };

  const columns: ColumnsType<dataSourceType> = [
    {
      title: "No",
      dataIndex: "index",
      key: "index",
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
      defaultFilteredValue: getLoginUser(),
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

  if (ownerName === null) {
    return null;
  }

  return (
    <div
      style={{
        width: "600px",
        height: "700px",
      }}
    >
      <Table
        style={
          {
            // backgroundColor: "red",
          }
        }
        title={() => (
          <Space style={{ width: "100%" }} align="center" direction="vertical">
            <Typography.Text>Records</Typography.Text>
          </Space>
        )}
        showSorterTooltip={false}
        loading={loading}
        bordered={true}
        dataSource={dataSource}
        columns={columns}
        size="large"
        onChange={onChange}
        pagination={{ position: ["bottomCenter"], size: "small" }}
      />
    </div>
  );
}

export default Table2;
