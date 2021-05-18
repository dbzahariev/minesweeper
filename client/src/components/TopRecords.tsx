import { Space, Tabs, Typography } from "antd";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import Table2 from "./Table2";

const { TabPane } = Tabs;

export default function TopRecords(props: any) {
  // let ownerName = localStorage.getItem("username") || "";
  const { user } = useContext(UserContext);

  const [statistic, setStatistic] =
    useState<{
      bestRecords: {
        date: string;
        time: number;
      };
      averageTime: number;
      allRecordsCount: number;
    } | null>(null);

  useEffect(() => {
    console.log("refresh");
    getAllGames();
    // eslint-disable-next-line
  }, [props.reload, user]);

  const getAllGames = () => {
    if (!user) {
      return null;
    }
    axios
      .get("/api")
      .then((response) => {
        let bestRecords: { date: string; time: number };

        let newData: any[] = response.data
          .slice()
          .filter((el: any) => {
            return el.owner === user.toString();
          })[0]
          .games.sort((a: any, b: any) => a.time - b.time);
        bestRecords = newData[0];

        let averageTime =
          newData.reduce((total, next) => total + next.time, 0) /
          newData.length;

        averageTime = Number((Math.round(averageTime * 100) / 100).toFixed(2));

        let kk = { bestRecords, averageTime, allRecordsCount: newData.length };

        console.log(kk);

        setStatistic(kk);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const getBestTimes = () => {
    if (statistic) {
      let kk = (
        <Space direction="vertical">
          <Typography.Text>{`Best time is ${
            statistic.bestRecords.time
          } on ${new Date(statistic.bestRecords.date).toLocaleString(
            "bg-bg"
          )}`}</Typography.Text>
          <Typography.Text>
            {`Average time is ${statistic.averageTime} (seconds) for ${
              statistic.allRecordsCount
            } ${statistic.allRecordsCount === 1 ? "game" : "games"}`}
          </Typography.Text>
        </Space>
      );
      return kk;
    }
    return null;
  };

  return (
    <div
      style={{
        width: "600px",
        height: "760px",
      }}
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab="Top Records" key="1">
          <div style={{}}>
            <Space direction="vertical">{getBestTimes()}</Space>
          </div>
        </TabPane>
        <TabPane tab="Whole table" key="2">
          <Table2 ownerName={user ? [user] : null} reload={props.reload} />
        </TabPane>
      </Tabs>
    </div>
  );
}
