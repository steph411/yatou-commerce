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

const OrderStatuses = {
  paid: "paid",
  readyforpickup: "ready for pickup",
  intransit: "in transit",
  delivered: "delivered",
  completed: "completed",
};

const OrdersPage: React.FC<Props> = ({ authState }) => {
  const parentRef = useRef(null);
  const orders: any[] = [];
  const pendingOrders = 234;
  const [paidChecked, setPaidChecked] = useState(false);
  const [readyForPickupChecked, setReadyForPickupChecked] = useState(false);
  const [inTransitChecked, setInTransitChecked] = useState(false);
  const [deliveredChecked, setDeliveredChecked] = useState(false);
  const [completedChecked, setCompletedChecked] = useState(false);

  const vendors: string[] = [];
  const role = roles.shipper;

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
      name: OrderStatuses.paid,
      roles: [roles.admin, roles.vendor],
      action: handlePaidChanged,
    },
    {
      name: OrderStatuses.readyforpickup,
      roles: [roles.vendor, roles.shipper],
      action: handleReadyForPickupChanged,
    },
    {
      name: OrderStatuses.intransit,
      roles: [roles.admin, roles.vendor, roles.shipper],
      action: handleInTransitChanged,
    },
    {
      name: OrderStatuses.delivered,
      roles: [roles.shipper],
      action: handleDeliveredChanged,
    },
    {
      name: OrderStatuses.completed,
      roles: [roles.admin, roles.vendor],
      action: handleCompletedChanged,
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

  const handleDelivered = () => {
    console.log({ delivered: true });
  };

  const handleReadyForPickup = () => {
    console.log({ readyforpickup: true });
  };

  const dataActions = [
    {
      name: "ready for pickup",
      roles: [roles.vendor],
      action: handleReadyForPickup,
      icon: <InboxOutlined />,
    },
    {
      name: "delivered",
      roles: [roles.shipper],
      action: handleDelivered,
      icon: <CheckSquareOutlined />,
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
            {pendingOrders}
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

export default OrdersPage;
