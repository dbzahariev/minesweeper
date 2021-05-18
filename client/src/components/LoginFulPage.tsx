import { Button, Form, Input } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { showNotification } from "./App";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

export default function LoginFulPage() {
  let username = "";
  let password = "";

  // eslint-disable-next-line
  const [loading, setLoading] = useState(false);
  const [loginOrRegister, setLoginOrRegister] =
    useState<"Login" | "Register">("Login");

  const onFinish = (values: any) => {
    axios({
      method: "POST",
      data: {
        username: username,
        password: password,
      },
      withCredentials: true,
      url: "/user/login",
    })
      .then((res) => {
        showNotification(`Hello ${res.data.username}`, 1, res.data.type);
      })
      .catch((err) => showNotification(err.message, 1, "error"));
  };
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          alignItems: "center",
          width: "500px",
          height: "50%",
          padding: 0,
        }}
      >
        <div
          style={{
            paddingTop: "2%",
            paddingBottom: "3%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p
            onClick={() => {
              setLoginOrRegister("Login");
            }}
            style={{
              margin: 0,
              textAlign: "end",
              width: "50%",
              fontSize: "30px",
              padding: "6px 10px",
              textDecoration: `${
                loginOrRegister === "Login" ? "underline" : ""
              }`,
            }}
          >
            Login
          </p>
          <p
            onClick={() => {
              setLoginOrRegister("Register");
            }}
            style={{
              borderLeft: "1px solid black",
              textAlign: "start",
              width: "50%",
              fontSize: "30px",
              padding: "6px 10px",
              margin: 0,
              textDecoration: `${
                loginOrRegister === "Register" ? "underline" : ""
              }`,
            }}
          >
            Register
          </p>
        </div>
        <div>
          <Form
            labelCol={{ offset: 3, span: 5 }}
            wrapperCol={{ offset: 3, span: 18 }}
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 24 }}>
              <Button loading={loading} type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
