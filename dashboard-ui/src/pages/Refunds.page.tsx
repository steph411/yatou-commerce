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
  InboxOutlined,
  CodeSandboxOutlined,
} from "@ant-design/icons";
import { AuthState } from "../Auth";

const { RangePicker } = DatePicker;

interface Props {
  authState: AuthState;
}

enum roles {
  admin = "admin",
  vendor = "vendor",
  shipper = "shipper",
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
    roles: [roles.admin, roles.vendor, roles.shipper],
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
    roles: [roles.admin, roles.vendor, roles.shipper],
  },
  {
    title: "address",
    dataIndex: "address",
    key: "address",
    roles: [roles.shipper, roles.vendor, roles.admin],
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

const RefundStatuses = {
  rejected: {
    [roles.admin]: "rejected",
    [roles.vendor]: "rejected",
    [roles.shipper]: "rejected",
  },
  pending: {
    [roles.admin]: "pending",
    [roles.vendor]: "pending",
    [roles.shipper]: "pending",
  },
  approved: {
    [roles.admin]: "approved",
    [roles.vendor]: "approved",
    [roles.shipper]: "approved",
  },
  awaitingDropOf: {
    [roles.admin]: "awaiting Drop",
    [roles.vendor]: "awaiting Drop",
    [roles.shipper]: "awaiting Drop",
  },
  inTransit: {
    [roles.admin]: "in transit",
    [roles.vendor]: "in transit",
    [roles.shipper]: "in transit",
  },
  returned: {
    [roles.admin]: "returned",
    [roles.vendor]: "returned",
    [roles.shipper]: "returned",
  },
};

const RefundsPage: React.FC<Props> = ({ authState }) => {
  const parentRef = useRef(null);
  const orders: any[] = [];
  const pendingRefunds = 23;
  const [paidChecked, setPaidChecked] = useState(false);
  const [readyForPickupChecked, setReadyForPickupChecked] = useState(false);
  const [inTransitChecked, setInTransitChecked] = useState(false);
  const [deliveredChecked, setDeliveredChecked] = useState(false);
  const [completedChecked, setCompletedChecked] = useState(false);

  const vendors: string[] = [];
  const role = roles.admin;

  const handlePaidChanged = () => {
    setPaidChecked((old) => !old);
  };
  const handleReadyForPickupChanged = () => {
    setReadyForPickupChecked((old) => !old);
  };
  const handleInTransitChanged = () => {
    setInTransitChecked((old) => !old);
  };
  const handleDeliveredChanged = () => {
    setDeliveredChecked((old) => !old);
  };
  const handleCompletedChanged = () => {
    setCompletedChecked((old) => !old);
  };

  const statuses = [
    {
      name: RefundStatuses.pending[role],
      roles: [roles.admin, roles.vendor],
      action: handlePaidChanged,
    },
    {
      name: RefundStatuses.approved[role],
      roles: [roles.vendor],
      action: handleReadyForPickupChanged,
    },
    {
      name: RefundStatuses.rejected[role],
      roles: [roles.admin, roles.vendor, roles.shipper],
      action: handleInTransitChanged,
    },
    {
      name: RefundStatuses.awaitingDropOf[role],
      roles: [roles.admin, roles.vendor, roles.shipper],
      action: handleInTransitChanged,
    },
    {
      name: RefundStatuses.returned[role],
      roles: [roles.admin, roles.vendor, roles.shipper],
      action: handleInTransitChanged,
    },
  ];

  const handleVendorChanged = (data: any) => {
    console.log({ vendorchanged: data });
  };

  const handleSearchVendor = (data: any) => {
    console.log({ vendorsearched: data });
  };

  const handleExport = () => {
    console.log({ exporting: true });
  };

  const handleApprove = () => {
    console.log({ approve: true });
  };

  const handleReject = () => {
    console.log({ reject: true });
  };

  const handleReturned = () => {
    console.log({ returned: true });
  };

  const handleAwaitingDropOff = () => {
    console.log({ awaitingDropff: true });
  };

  const dataActions = [
    {
      name: "approve",
      roles: [roles.admin],
      action: handleApprove,
      icon: <CheckSquareOutlined />,
    },
    {
      name: "reject",
      roles: [roles.admin],
      action: handleReject,
      icon: <CloseSquareOutlined />,
    },
    {
      name: "awaiting drop off",
      roles: [roles.vendor],
      action: handleAwaitingDropOff,
      icon: <InboxOutlined />,
    },
    {
      name: "returned",
      roles: [roles.shipper],
      action: handleReturned,
      icon: <CodeSandboxOutlined />,
    },
  ];

  const tableMenu = (
    <Menu>
      {dataActions
        .filter((el) => el.roles.includes(role))
        .map((el, id) => (
          <Menu.Item onClick={el.action} key={id} icon={el.icon}>
            {el.name}
          </Menu.Item>
        ))}
    </Menu>
  );

  return (
    <section className="space-y-8" id="Orders" ref={parentRef}>
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
                {statuses
                  .filter((el) => el.roles.includes(role))
                  .map((el, id) => (
                    <Checkbox key={id} onChange={el.action}>
                      {el.name}
                    </Checkbox>
                  ))}
              </div>
            </div>
            <div className="flex items-center justify-between p-2 space-x-2">
              <span>Vendor :</span>
              <Select
                showSearch
                className="flex-1"
                style={{ width: 228 }}
                placeholder="Select a person"
                optionFilterProp="children"
                onChange={handleVendorChanged}
                // onFocus={onFocus}
                // onBlur={onBlur}
                onSearch={handleSearchVendor}
                filterOption={(input, option) => {
                  console.log({ input, option });
                  return true;
                }}
              >
                {vendors.map((el, id) => (
                  <Select.Option key={id} value={el}>
                    {el}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </div>
        </div>
        <div className="flex items-center p-2 space-x-4 transition-all shadow cursor-pointer bg-background-light hover:bg-background-darker hover:shadow-md">
          <span className="font-bold text-gray-600">Pending</span>
          <span className="px-2 py-1 text-lg font-bold text-gray-600 bg-orange-300 rounded">
            {pendingRefunds}
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
        <Table
          dataSource={orders}
          columns={columns.filter((el) => el.roles.includes(role))}
        />
      </div>
    </section>
  );
};

export default RefundsPage;
