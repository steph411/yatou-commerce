import React from 'react';

import Logo from '@assets/logoy.svg';
import { Form, Input, Button, Checkbox } from "antd";


const tailLayout = null

const LoginPage = () => {
  const onSubmit = (values: any) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="grid w-screen h-screen place-items-center">
      <div className="grid w-1/3 pt-0 rounded shadow h-3/5 place-items-center">
        <div className="flex items-center justify-center w-full bg-light-blue-800">
          <span className="">
            <img src={Logo} alt="yatou logo" />
          </span>
        </div>
        <Form
          layout="vertical"
          size="large"
          className="w-4/5"
          wrapperCol={{ span: 48 }}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onSubmit}
          onFinishFailed={onFinishFailed}
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
          <Form.Item
            // {...tailLayout}
            name="remember"
            valuePropName="checked"
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          <Form.Item
          // {...tailLayout}
          >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};




export default LoginPage