import { Space, Tabs, Typography } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { TypeRedux } from "../assistants/Redux";
import Table2 from "./Table2";

const { TabPane } = Tabs;

type StatisticsType = {
  bestRecords: {
    date: string;
    time: number;
  };
  averageTime: number;
  allRecordsCount: number;
};

export default function TopRecords({
  redux,
  reload,
}: {
  redux: TypeRedux;
  reload: number;
}) {
  const user = redux.user.username;

  const [statistic, setStatistic] = useState<StatisticsType | null>(null);

  useEffect(() => {
    getAllGames();
    // eslint-disable-next-line
  }, [reload, user, redux]);

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
        bestRecords = newData[0] || 0;

        let averageTime =
          newData.reduce((total, next) => total + next.time, 0) /
          newData.length;

        if (newData.length === 0) {
          averageTime = 0;
        }

        averageTime = Number((Math.round(averageTime * 100) / 100).toFixed(2));

        let statistic: StatisticsType = {
          bestRecords,
          averageTime,
          allRecordsCount: newData.length,
        };

        setStatistic(statistic);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const getBestTimes = (statistic: StatisticsType) => {
    return (
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
  };

  if (user.length === 0 || statistic === null) {
    return null;
  }

  return (
    <div
      style={{
        width: "600px",
        height: "760px",
      }}
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab="Top Records" key="1">
          {statistic ? getBestTimes(statistic) : null}
        </TabPane>
        <TabPane tab="Whole table" key="2">
          {/* <Table2 ownerName={user ? [user] : null} reload={props.reload} /> */}
          <Table2
            ownerName={user ? [user] : null}
            reload={reload}
            redux={redux}
          />
        </TabPane>
      </Tabs>
    </div>
  );
}
