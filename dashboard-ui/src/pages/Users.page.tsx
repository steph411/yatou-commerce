import React, { useState, useRef } from "react";
import Filter from "@assets/filter.svg?component";
import {
  DatePicker,
  Table,
  Checkbox,
  Select,
  Dropdown,
  Menu,
  Button,
} from "antd";
import {
  DownloadOutlined,
  DownOutlined,
  CheckSquareOutlined,
  CloseSquareOutlined,
} from "@ant-design/icons";
import { AuthState } from "../Auth";

const { RangePicker } = DatePicker;

interface Props {
  authState: AuthState;
}

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "contact",
    dataIndex: "contact",
    key: "contact",
  },
  {
    title: "country",
    dataIndex: "country",
    key: "country",
  },
  {
    title: "city",
    dataIndex: "city",
    key: "city",
  },
  {
    title: "address",
    dataIndex: "address",
    key: "address",
  },

  {
    title: "Date added",
    dataIndex: "date_added",
    key: "date_added",
  },
];

enum UserTypes {
  customer = "customer",
  vendor = "vendor",
  shipper = "shipper",
}

const UsersPage: React.FC<Props> = ({ authState }) => {
  const parentRef = useRef(null);
  const products: any[] = [];
  const totalUsers = 23;

  const handleTypeCustomerChanged = (value: any) => {
    console.log({ user: value });
  };
  const handleTypeVendorChanged = (value: any) => {
    console.log({ vendor: value });
  };
  const handleTypeShipperChanged = (value: any) => {
    console.log({ shipper: value });
  };

  const handleDeactivate = () => {
    console.log({ deactivate: true });
  };
  const handleActivate = () => {
    console.log({ deactivate: true });
  };

  const handleSearchVendor = (data: any) => {
    console.log({ vendorsearched: data });
  };

  const handleExport = () => {
    console.log({ exporting: true });
  };

  const dataActions = [
    {
      name: "deactivate",
      icon: <CloseSquareOutlined />,
      action: handleDeactivate,
    },
    { name: "activate", icon: <CheckSquareOutlined />, action: handleActivate },
  ];

  const tableMenu = (
    <Menu>
      {dataActions.map((el, id) => (
        <Menu.Item onClick={el.action} key={id} icon={el.icon}>
          {el.name}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <section className="space-y-8" id="products" ref={parentRef}>
      {/* filter and add section */}
      <div className="flex items-start justify-between font-semibold text-black">
        <div className="flex flex-col space-y-3">
          <div className="flex self-start p-2 space-x-4 transition-all shadow cursor-pointer bg-background-light hover:bg-background-darker hover:shadow-md">
            <span>filter</span>
            <span>
              <Filter />
            </span>
          </div>

          <div className="flex flex-col shadow bg-background-light">
            <div className="flex items-center justify-between p-2 space-x-2">
              <span>Date :</span>
              <RangePicker className="flex-1" />
            </div>
            <div className="flex items-center justify-between p-2 space-x-2">
              <span>Status :</span>
              <div className="flex items-center">
                <Checkbox onChange={handleTypeVendorChanged}>
                  {UserTypes.vendor}
                </Checkbox>
                <Checkbox onChange={handleTypeShipperChanged}>
                  {UserTypes.shipper}
                </Checkbox>
                <Checkbox onChange={handleTypeCustomerChanged}>
                  {UserTypes.customer}
                </Checkbox>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center px-3 py-2 space-x-4 transition-all shadow cursor-pointer bg-background-light hover:bg-background-darker hover:shadow-md">
          <span className="font-bold text-gray-600">Total</span>
          <span className="px-2 py-1 text-lg font-bold text-gray-600 bg-orange-300 rounded">
            {totalUsers}
          </span>
        </div>
      </div>

      {/* table section */}
      <div className="flex flex-col justify-between w-full ">
        <div className="flex items-center self-end py-2 space-x-4 font-semibold">
          <div
            onClick={handleExport}
            className="flex items-center px-2 py-1 space-x-2 shadow cursor-pointer bg-background-darker active:shadow-sm"
          >
            <span>export</span>
            <DownloadOutlined style={{ fontSize: "20px" }} />
          </div>
          <div className="flex items-center px-2 py-1 space-x-2 shadow cursor-pointer bg-background-darker active:shadow-sm">
            <Dropdown overlay={tableMenu}>
              <span>
                actions <DownOutlined style={{ fontSize: "20px" }} />
              </span>
            </Dropdown>
          </div>
        </div>
        <Table dataSource={products} columns={columns} />
      </div>
    </section>
  );
};

export default UsersPage;
