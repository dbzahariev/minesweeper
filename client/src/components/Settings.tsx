import { Button, Form, Input, Modal, Radio, Space, Table } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { ACTIONS, TypeRedux } from "../assistants/Redux";
import { showNotification } from "./App";

const defaultSettingsForTable = {
  beginner: {
    height: 9,
    width: 9,
    mines: 10,
  },
  intermediate: {
    height: 16,
    width: 16,
    mines: 40,
  },
  expert: {
    height: 16,
    width: 30,
    mines: 99,
  },
  custom: {
    height: 20,
    width: 30,
    mines: 145,
  },
};

export default function Settings({ redux }: { redux: TypeRedux }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line
  const [valueSize, setValueSize] = useState({
    row: 9,
    col: 9,
    type: "beginner",
  });

  const user = localStorage.getItem("username") || "";

  useEffect(() => {
    let kk = redux.todos.find((el) => el.username === user);
    if (kk === undefined && user.length > 0) {
      redux.dispatch({
        type: ACTIONS.ADD_TODO,
        payload: { username: user },
      });
    }
  }, [redux, user]);

  const [localSettings, setLocalSettings] = useState<{
    customSettings: {
      height: number;
      width: number;
      mines: number;
    };
    selectedRowKeys: React.Key[];
  }>({
    customSettings: defaultSettingsForTable.custom,
    selectedRowKeys: [],
  });

  useEffect(() => {
    // if (user.length > 0) {
    //   setIsModalVisible(false);
    // } else {
    //   setIsModalVisible(true);
    // }
    // eslint-disable-next-line
  }, []);

  const saveSettings = () => {
    axios({
      method: "GET",
      withCredentials: true,
      url: "/api",
    })
      .then((res) => {
        let data: any = res.data.filter((el: any) => el.owner === user)[0];
        let savedSettings = data.settings;
        let settingsToSave: {
          height: number;
          width: number;
          mines: number;
        } = defaultSettingsForTable.beginner;

        if (localSettings.selectedRowKeys.toString() === "1") {
          settingsToSave = defaultSettingsForTable.beginner;
        } else if (localSettings.selectedRowKeys.toString() === "2") {
          settingsToSave = defaultSettingsForTable.intermediate;
        } else if (localSettings.selectedRowKeys.toString() === "3") {
          settingsToSave = defaultSettingsForTable.expert;
        } else if (localSettings.selectedRowKeys.toString() === "4") {
          settingsToSave = localSettings.customSettings;
        }
        let newSettings = JSON.stringify(settingsToSave);
        if (savedSettings !== newSettings) {
          axios({
            method: "POST",
            data: { settings: newSettings },
            withCredentials: true,
            url: `/api/settings?name=${user}`,
          })
            .then((res) => {
              showNotification(res.data.msg, 1, res.data.type);
              redux.dispatch({
                type: ACTIONS.SET_SETTINGS,
                payload: { username: user, settings: newSettings },
              });
              // props.setReload(props.reload + 1);
            })
            .catch((err) => console.error(err));
        }
      })
      .catch((err) => {});
  };

  const formChancel = () => {
    setIsModalVisible(false);
    saveSettings();
  };

  const getForm = () => {
    const onFinish = (values: any) => {
      setLoading(true);
      saveSettings();
      // localStorage.setItem("username", values.username);
      // showNotification(`Hello ${values.username}!`, 1, "success");
      setLoading(false);
      setIsModalVisible(false);
      // window.location.reload();
    };

    // eslint-disable-next-line
    const fieldNumber = [
      {
        required: true,
        // message: "This field is required",
      },
    ];
    const onChangeSize = (foo1: any) => {
      setValueSize({ ...valueSize, type: foo1.target.value });
    };

    const formInputs = () => {
      return (
        <Form layout="inline">
          <Space direction="horizontal">
            <Form.Item
              label="Width"
              name="width"
              style={{
                border: "1px solid red",
              }}
            >
              <Input maxLength={2} />
            </Form.Item>
            <Form.Item
              label="Height"
              name="height"
              style={{
                border: "1px solid red",
              }}
            >
              <Input maxLength={2} />
            </Form.Item>
            <Form.Item
              label="Bombs"
              name="bombs"
              style={{
                border: "1px solid red",
              }}
            >
              <Input maxLength={2} />
            </Form.Item>
          </Space>
        </Form>
      );
    };

    // eslint-disable-next-line
    const typeGameRadio = () => {
      return (
        <>
          <Radio.Group onChange={onChangeSize} value={valueSize.type}>
            <Radio value="beginner">Beginner</Radio>
            <Radio value="medium">Intermediate</Radio>
            <Radio value="hard">Expert</Radio>
            <Radio value="custom">Custom</Radio>
          </Radio.Group>
          {formInputs()}
        </>
      );
    };

    const typeGameTable = () => {
      const onChange2 = (type: string, index: number, value: any) => {
        let newCustomSettings = {
          ...localSettings.customSettings,
          [type]: Number(value),
        };
        setLocalSettings({
          ...localSettings,
          customSettings: newCustomSettings,
        });
      };

      interface DataType {
        key: React.Key;
        type: string;
        height: number;
        width: number;
        mines: number;
      }

      const columns = [
        {
          title: "Type",
          dataIndex: "type",
          render: (text: string, row: any, index: any) => {
            return (
              <p
                onClick={() => {
                  setLocalSettings({
                    ...localSettings,
                    selectedRowKeys: [row.key],
                  });
                }}
                style={{
                  fontWeight: index !== data.length - 1 ? "bold" : "normal",
                  padding: 0,
                  margin: 0,
                  cursor: "pointer",
                }}
              >
                {text}
              </p>
            );
          },
        },
        {
          title: "Height",
          dataIndex: "height",
          render: (text: string, row: any, index: any) => {
            if (index === data.length - 1) {
              return (
                <Input
                  className="height-index-3"
                  onChange={(r1) => {
                    let classNames: string[] = r1.target.className
                      .toString()
                      .split(" ")[1]
                      .split("-");
                    let index = Number(classNames[2]);
                    let type = classNames[0];
                    let value = r1.target.value;
                    onChange2(type, index, value);
                    setLocalSettings({
                      ...localSettings,
                      selectedRowKeys: [row.key],
                      customSettings: {
                        ...localSettings.customSettings,
                        [type]: Number(value),
                      },
                    });
                  }}
                  maxLength={3}
                  defaultValue={row.height}
                />
              );
            } else {
              return text;
            }
          },
        },
        {
          title: "Width",
          dataIndex: "width",
          render: (text: string, row: any, index: any) => {
            if (index === data.length - 1) {
              return (
                <Input
                  className="width-index-3"
                  onChange={(r1) => {
                    let classNames: string[] = r1.target.className
                      .toString()
                      .split(" ")[1]
                      .split("-");
                    let index = Number(classNames[2]);
                    let type = classNames[0];
                    let value = r1.target.value;
                    onChange2(type, index, value);
                    setLocalSettings({
                      ...localSettings,
                      selectedRowKeys: [row.key],
                      customSettings: {
                        ...localSettings.customSettings,
                        [type]: Number(value),
                      },
                    });
                  }}
                  maxLength={3}
                  defaultValue={row.width}
                />
              );
            }
            return text;
          },
        },
        {
          title: "Mines",
          dataIndex: "mines",
          render: (text: string, row: any, index: any) => {
            if (index === data.length - 1) {
              return (
                <Input
                  className="mines-index-3"
                  onChange={(r1) => {
                    let classNames: string[] = r1.target.className
                      .toString()
                      .split(" ")[1]
                      .split("-");
                    let index = Number(classNames[2]);
                    let type = classNames[0];
                    let value = r1.target.value;
                    onChange2(type, index, value);
                    setLocalSettings({
                      ...localSettings,
                      selectedRowKeys: [row.key],
                      customSettings: {
                        ...localSettings.customSettings,
                        [type]: Number(value),
                      },
                    });
                  }}
                  maxLength={3}
                  defaultValue={row.mines}
                />
              );
            }
            return text;
          },
        },
      ];

      const data: DataType[] = [
        {
          key: "1",
          type: "Beginner",
          height: defaultSettingsForTable.beginner.height,
          width: defaultSettingsForTable.beginner.width,
          mines: defaultSettingsForTable.beginner.mines,
        },
        {
          key: "2",
          type: "Intermediate",
          height: defaultSettingsForTable.intermediate.height,
          width: defaultSettingsForTable.intermediate.width,
          mines: defaultSettingsForTable.intermediate.mines,
        },
        {
          key: "3",
          type: "Expert",
          height: defaultSettingsForTable.expert.height,
          width: defaultSettingsForTable.expert.width,
          mines: defaultSettingsForTable.expert.mines,
        },
        {
          key: "4",
          type: "Custom",
          height: defaultSettingsForTable.custom.height,
          width: defaultSettingsForTable.custom.width,
          mines: defaultSettingsForTable.custom.mines,
        },
      ];

      const rowSelection = (
        selectedRowKeys: React.Key[],
        selectedRows: DataType[]
      ) => {
        setLocalSettings({
          ...localSettings,
          selectedRowKeys: selectedRowKeys,
        });
      };

      return (
        <div>
          <Table
            bordered
            pagination={false}
            rowSelection={{
              type: "radio",
              selectedRowKeys: localSettings.selectedRowKeys,
              onChange: rowSelection,
              getCheckboxProps: (record: DataType) => {
                return {
                  disabled: record.type === "Disabled User", // Column configuration not to be checked
                  name: record.type,
                };
              },
            }}
            columns={columns}
            dataSource={data}
          />
        </div>
      );
    };

    return (
      <Form
        style={{ width: "100%" }}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 24 }}
        name="basic"
        initialValues={{
          remember: false,
        }}
        onFinish={onFinish}
      >
        <Form.Item label="Type" name="type">
          {/* <p>hi</p> */}
          {/* {typeGameRadio()} */}
          {typeGameTable()}
        </Form.Item>

        <Form.Item label="Username" name="username">
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 9, span: 24 }}>
          <Space>
            <Button loading={loading} type="primary" htmlType="submit">
              Save
            </Button>

            <Button type="default" onClick={formChancel}>
              Chancel
            </Button>
          </Space>
        </Form.Item>
      </Form>
    );
  };

  return (
    <div>
      <Space>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          Settings
        </Button>
      </Space>
      <Modal
        title={"Settings"}
        visible={isModalVisible}
        footer={[]}
        onCancel={formChancel}
        width={"40%"}
      >
        {getForm()}
      </Modal>
    </div>
  );
}
