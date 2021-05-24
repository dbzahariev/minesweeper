import { Button, Form, Input, Modal, Space } from "antd";
import axios from "axios";
import { useState, useEffect } from "react";
import { showNotification } from "./App";

export default function Login() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({ username: "", password: "" });
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    checkLogin(true);
  }, []);

  useEffect(() => {
    if (userInfo.username) {
      if (isLogin) {
        logInUser(userInfo);
      } else {
        registerUser(userInfo);
      }
    }
  }, [userInfo]);

  const logInUser = ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    axios({
      method: "POST",
      data: {
        username: username,
        password: password,
      },
      withCredentials: true,
      url: "/user/login",
    }).then((res) => {
      if (res.data.username && res.data.username.length > 0) {
        showNotification(`Hello ${res.data.username}`, 1, res.data.type);
        window.location.reload();
        setIsModalVisible(false);
        setLoading(false);
      } else {
        showNotification(res.data.msg, 1, res.data.type);
        setLoading(false);
      }
    });
  };

  const registerUser = ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    axios({
      method: "POST",
      data: {
        username: username,
        password: password,
      },
      withCredentials: true,
      url: "/user/register",
    }).then((res) => {
      let msg: string = res.data.msg;
      let type: "success" | "error" | "info" | "warning" | "open" | undefined =
        res.data.type;
      if (msg.toLowerCase().indexOf("created") >= 0) {
        showNotification(msg, 1, type);
        setIsModalVisible(false);
      } else {
        showNotification(msg, 1, type);
      }
      setLoading(false);
    });
  };

  const checkLogin = (next: boolean) => {
    axios({
      method: "GET",
      withCredentials: true,
      url: "/user/showMyUsername",
    })
      .then((res) => {
        if ((res.data.username || "").length > 0) {
          showNotification("You are already logged in", 1, "success");
        } else {
          setIsModalVisible(next);
        }
      })
      .catch((err) => {});
  };

  const showModal = (isLogin: boolean) => {
    setIsModalVisible(true);
    setIsLogin(isLogin);
  };

  const getForm = () => {
    const onFinish = (values: any) => {
      setLoading(true);
      setUserInfo(values);
    };

    return (
      <Form
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 24 }}
        name="basic"
        initialValues={{
          remember: true,
          username: "ramsess",
          password: "123456",
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

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
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

  const formChancel = () => {
    setIsModalVisible(false);
  };

  const logout = () => {
    axios({
      method: "GET",
      withCredentials: true,
      url: "/user/logout",
    })
      .then(() => {
        showNotification(`Bye bye`, 1, "success");
        window.location.reload();
      })
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <Space>
        <Button type="primary" onClick={() => checkLogin(true)}>
          Login
        </Button>
        <Button type="primary" onClick={() => showModal(false)}>
          Register
        </Button>
        <Button type="primary" onClick={() => logout()}>
          Log out
        </Button>
      </Space>
      <Modal
        title={isLogin ? "Login" : "Register"}
        visible={isModalVisible}
        footer={[]}
        onCancel={formChancel}
      >
        {getForm()}
      </Modal>
    </div>
  );
}
