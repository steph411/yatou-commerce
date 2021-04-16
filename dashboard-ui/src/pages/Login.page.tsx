import React, { useState } from "react";

import Logo from "@assets/logoy.svg";
import { Form, Input, Button, Checkbox, message } from "antd";
import app from "../firebase";
import { useNavigate } from "react-router-dom";
import { AuthState } from "../Auth";
interface Props {
  authState: AuthState;
}

const LoginPage: React.FC<Props> = ({ authState }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values: any) => {
    try {
      console.log({ loginvalues: values });
      setLoading(true);
      const { email, password } = values;
      const result = await app
        .auth()
        .signInWithEmailAndPassword(email, password);
      console.log({ loginresult: result });
      setLoading(false);
      navigate("/products");
      message.success(`Welcome ${email.split("@")[0]}`);
    } catch (error) {
      setLoading(false);
      console.log({ loginerror: error });
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="grid w-screen h-screen place-items-center">
      <div className="grid w-1/4 pt-0 rounded shadow h-3/5 place-items-center">
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
            label="email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input type="email" />
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
            <Button loading={loading} type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
