import React, { useState, useEffect } from "react";
import { Tabs, Button } from "antd";
import Editor from "@components/Editor";
import "react-quill/dist/quill.snow.css";
import { DownloadOutlined } from "@ant-design/icons";
import { AuthState } from "../Auth";
import { useQuery, useMutation } from "@apollo/client";
import {GET_TERMS_AND_CONDITIONS, UPDATE_TERMS_AND_CONDITIONS} from "@queries";


interface Props {
  authState: AuthState;
}

const TermsPage: React.FC<Props> = ({ authState }) => {

  const {data: termsData, loading: termsLoading, error: termsError} = useQuery(GET_TERMS_AND_CONDITIONS, {variables: {version: 1}});
  const 
    [updateTerms, 
    {data: updateTermsData, loading: updateTermsLoading, error: updateTermsError}
  ] = useMutation(UPDATE_TERMS_AND_CONDITIONS); 

  console.log({termsData, termsLoading, termsError});
  console.log({updateTermsData, updateTermsLoading, updateTermsError});

  const [termsVendorValue, setTermsVendorsValue] = useState("");
  const [termsVendorDelta, setTermsVendorsDelta] = useState("");
  const [termsShipperValue, setTermsShipperValue] = useState("");
  const [termsShipperDelta, setTermsShipperDelta] = useState("");
  const [termsCustomerValue, setTermsCustomerValue] = useState("");
  const [termsCustomerDelta, setTermsCustomerDelta] = useState("");
  

  // update the deltas value when the data are available from the api
  
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


  // useEffect(() => {
  //   roles.map(el => {
  //     el.setValue(termsData?.terms?.[0]?.[el.name])
  //   })  
  // }, [termsData])
  
  const handleChange = (role: string) => {
    const element = roles.find((el) => el.name === role);
    console.log({elementRole: element});
    return (value: any, delta: any, source: any, editor: any) => {
      if (source == 'user') {
        // place whatever function you want to execute when user types here:
        console.log({ value, delta, source, editor, element });
        const deltaData = editor.getContents();
        element?.setValue(value);
        // element?.setValue(deltaData);
        element?.setDelta(deltaData);
      }
      
    };
  };

  const handleDownloadTerms = () => {
    console.log({ downloadingterms: true });
  };

  const handleSaveTerms = async () => {
    const variables = {
      vendor: termsVendorDelta,
      shipper: termsShipperDelta,
      customer: termsCustomerDelta,
    }
    const result = await updateTerms({variables});
    console.log({saveTermsResult: result});
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
              <Editor 
                // defaultValue={termsData?.terms?.[0]?.[el.name]}
                // key={termsData?.terms?.[0]?.[el.name]}
                readOnly={authState.userRole != "admin"} 
                value={el.value} 
                // value={el.value} 
                key={el.name}
                onValueChange={handleChange(el.name)} 
              />
            </Tabs.TabPane>
          );
        })}
      </Tabs>
      <div className="self-end">
        <Button
          className="px-8"
          type="primary"
          onClick={handleSaveTerms}
          loading={updateTermsLoading}
        >
          save
        </Button>
      </div>
    </section>
  );
};

export default TermsPage;
