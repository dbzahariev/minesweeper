import { Button, Form, Input, Modal, Space } from "antd";
// eslint-disable-next-line
import React, { useEffect, useState } from "react";
import { showNotification } from "./App";

export default function LoginMini() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let username: string = localStorage.getItem("username") || "";
    console.log(username);
    if (username.length > 0) {
      setIsModalVisible(false);
    } else {
      setIsModalVisible(true);
    }
  }, []);

  const formChancel = () => {
    setIsModalVisible(false);
  };

  const getForm = () => {
    const onFinish = (values: any) => {
      setLoading(true);
      localStorage.setItem("username", values.username);
      showNotification(`Hello ${values.username}!`, 1, "success");
      setLoading(false);
      setIsModalVisible(false);
      window.location.reload();
    };

    return (
      <Form
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 24 }}
        name="basic"
        initialValues={{
          remember: true,
          // username: "ramsess",
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
