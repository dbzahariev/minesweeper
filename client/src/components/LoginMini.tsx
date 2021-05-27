import { Button, Form, Input, Modal, Space } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { ACTIONS, TypeRedux } from "../assistants/Redux";
import { showNotification } from "./App";

export default function LoginMini({ redux }: { redux: TypeRedux }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  let user = redux.user.username;

  useEffect(() => {
    let loginUser = redux.todos.find((el) => el.username === user);
    if (loginUser === undefined && user.length > 0) {
      axios.get("/api").then((response) => {
        let responseData: any[] = response.data;
        let foundedUser = responseData.find((el) => el.owner === user);

        redux.dispatch({
          type: ACTIONS.ADD_TODO,
          payload: { username: user, settings: foundedUser.settings },
        });
      });
    }
  }, [redux, user]);

  useEffect(() => {
    if (user.length > 0) {
      setIsModalVisible(false);
    } else {
      setIsModalVisible(true);
    }
  }, [user.length]);

  const formChancel = () => {
    setIsModalVisible(false);
  };

  const getForm = () => {
    const onFinish = (values: any) => {
      axios.get("/api").then((response) => {
        let username: string = values.username;
        let responseData: any[] = response.data;
        let foundedUser = responseData.find((el) => el.owner === username);
        if (!foundedUser) {
          axios({
            method: "POST",
            data: { owner: username, games: [] },
            withCredentials: true,
            url: `/api/create`,
          })
            .then((res) => {
              setLoading(true);
              redux.user.setUsername(username);
              sessionStorage.setItem("username", username);
              showNotification(`Hello ${username}!`, 1, "success");
              setLoading(false);
              setIsModalVisible(false);
              redux.dispatch({
                type: ACTIONS.ADD_TODO,
                payload: { username: user },
              });
            })
            .catch((err) => console.error(err));
        } else {
          setLoading(true);
          redux.user.setUsername(username);
          sessionStorage.setItem("username", username);
          showNotification(`Hello ${username}!`, 1, "success");
          setLoading(false);
          setIsModalVisible(false);
          redux.dispatch({
            type: ACTIONS.ADD_TODO,
            payload: { username: user, settings: foundedUser.settings },
          });
        }
      });
    };

    return (
      <Form
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 24 }}
        name="basic"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 9, span: 24 }}>
          <Space>
            <Button loading={loading} type="primary" htmlType="submit">
              Submit
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
      <div>
        <Space>
          <Button type="primary" onClick={() => setIsModalVisible(true)}>
            Login
          </Button>
        </Space>
        <Modal
          title={"Set username"}
          visible={isModalVisible}
          footer={[]}
          onCancel={formChancel}
        >
          {getForm()}
        </Modal>
      </div>
    </div>
  );
}
