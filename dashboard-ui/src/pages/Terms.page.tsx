import React, { useState } from "react";
import { Tabs, Button } from "antd";
import Editor from "@components/Editor";
import "react-quill/dist/quill.snow.css";
import { DownloadOutlined } from "@ant-design/icons";
import { AuthState } from "../Auth";

interface Props {
  authState: AuthState;
}

const TermsPage: React.FC<Props> = ({ authState }) => {
  const [termsVendorValue, setTermsVendorsValue] = useState("");
  const [termsVendorDelta, setTermsVendorsDelta] = useState("");
  const [termsShipperValue, setTermsShipperValue] = useState("");
  const [termsShipperDelta, setTermsShipperDelta] = useState("");
  const [termsCustomerValue, setTermsCustomerValue] = useState("");
  const [termsCustomerDelta, setTermsCustomerDelta] = useState("");

  const [savingTerms, setSavingTerms] = useState(false);
  const roles = [
    {
      name: "vendor",
      value: termsVendorValue,
      setValue: setTermsVendorsValue,
      delta: termsVendorDelta,
      setDelta: setTermsVendorsDelta,
    },
    {
      name: "shipper",
      value: termsShipperValue,
      setValue: setTermsShipperValue,
      delta: termsShipperDelta,
      setDelta: setTermsShipperDelta,
    },
    {
      name: "customer",
      value: termsCustomerValue,
      setValue: setTermsCustomerValue,
      delta: termsCustomerDelta,
      setDelta: setTermsCustomerDelta,
    },
  ];

  const handleChange = (role: string) => {
    const element = roles.find((el) => el.name === role);
    return (value: any, delta: any, source: any, editor: any) => {
      console.log({ value, delta, source, editor, element });
      element?.setValue(value);
      const deltaData = editor.getContents();
      element?.setDelta(deltaData);
    };
  };

  const handleDownloadTerms = () => {
    console.log({ downloadingterms: true });
  };

  const handleSaveTerms = () => {
    console.log({ savingterms: true });
  };

  return (
    <section className="flex flex-col space-y-4">
      <Tabs
        defaultActiveKey="vendor"
        tabBarExtraContent={
          <span className="px-4 cursor-pointer" onClick={handleDownloadTerms}>
            <DownloadOutlined style={{ fontSize: "24px" }} />
          </span>
        }
        tabBarStyle={{
          background: "var(--background-darker)",
          width: "70%",
          borderTopLeftRadius: "4px",
          borderTopRightRadius: "4px",
          margin: "0 auto",
        }}
        centered
      >
        {roles.map((el) => {
          return (
            <Tabs.TabPane
              tab={
                <span className="text-lg font-semibold text-gray-600">
                  {el.name}
                </span>
              }
              key={el.name}
            >
              <Editor value={el.value} onValueChange={handleChange(el.name)} />
            </Tabs.TabPane>
          );
        })}
      </Tabs>
      <div className="self-end">
        <Button
          className="px-8"
          type="primary"
          onClick={handleSaveTerms}
          loading={savingTerms}
        >
          save
        </Button>
      </div>
    </section>
  );
};

export default TermsPage;
