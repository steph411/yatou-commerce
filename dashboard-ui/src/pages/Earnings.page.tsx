import React, { useState, useRef } from "react";
import Filter from "@assets/filter.svg?component";
import { DatePicker, Table, Modal } from "antd";
import { DownloadOutlined, PlusSquareOutlined } from "@ant-design/icons";
import AddCategory from "@components/AddCategory";
import { roles } from "@types";
import { AuthState } from "../Auth";

const { RangePicker } = DatePicker;

interface Props {
  authState: AuthState;
}

const columns = [
  {
    title: "product",
    dataIndex: "product",
    key: "product",
    roles: [roles.admin, roles.vendor, roles.shipper],
  },
  {
    title: "vendor",
    dataIndex: "vendor",
    key: "vendor",
    roles: [roles.admin, roles.shipper],
  },
  {
    title: "user",
    dataIndex: "user",
    key: "user",
    roles: [roles.admin, roles.vendor],
  },
  {
    title: "quantity",
    dataIndex: "quantity",
    key: "quantity",
    roles: [roles.admin, roles.vendor, roles.shipper],
  },
  {
    title: "amount",
    dataIndex: "amount",
    key: "amount",
    roles: [roles.shipper],
  },
  {
    title: "address",
    dataIndex: "address",
    key: "address",
    roles: [roles.shipper],
  },
  {
    title: "status",
    dataIndex: "status",
    key: "status",
    roles: [roles.admin, roles.vendor, roles.shipper],
  },

  {
    title: "Date added",
    dataIndex: "date_added",
    key: "date_added",
    roles: [roles.admin, roles.vendor, roles.shipper],
  },
];

const EarningsPage: React.FC<Props> = ({ authState }) => {
  const parentRef = useRef(null);
  const earnings: any[] = [];
  const totalEarnings = 0;
  const role = roles.admin;

  const handleExport = () => {
    console.log({ exporting: true });
  };

  return (
    <section className="space-y-8" id="categories" ref={parentRef}>
      {/* filter and add section */}
      <div className="flex items-start justify-between font-semibold text-black">
        <div className="flex flex-col space-y-3">
          <div className="flex self-start p-2 space-x-4 transition-all shadow cursor-pointer bg-background-light hover:bg-background-darker hover:shadow-md">
            <span>filter</span>
            <span>
              <Filter />
            </span>
          </div>
          <div className="flex items-center p-2 space-x-2 shadow bg-background-light">
            <span>Date :</span>
            <RangePicker />
          </div>
        </div>
        <div className="flex items-center p-2 space-x-4 text-gray-600 transition-all shadow cursor-pointer bg-background-light hover:bg-background-darker hover:shadow-md">
          <span>Total</span>
          <span className="text-2xl font-semibold">{totalEarnings} FCFA</span>
        </div>
      </div>

      {/* table section */}
      <div className="flex flex-col w-full">
        <div className="flex items-center self-end py-2 space-x-4 font-semibold">
          <div
            onClick={handleExport}
            className="flex items-center px-2 py-1 space-x-2 shadow cursor-pointer bg-background-darker active:shadow-sm"
          >
            <span>export</span>
            <DownloadOutlined style={{ fontSize: "20px" }} />
          </div>
        </div>
        <Table
          scroll={{
            y: window.innerHeight - 534 
          }}
          sticky
          dataSource={earnings}
          columns={columns.filter((el) => el.roles.includes(role))}
        />
      </div>
    </section>
  );
};

export default EarningsPage;
