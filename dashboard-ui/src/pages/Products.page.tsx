import React, { useState, useRef } from "react";
import Filter from "@assets/filter.svg?component";
import { useNavigate, Link } from "react-router-dom";
import {
  DatePicker,
  Table,
  Checkbox,
  Select,
  Dropdown,
  Menu,
  Tag,
  Button,
  message,
} from "antd";
import {
  DownloadOutlined,
  DownOutlined,
  CheckSquareOutlined,
  CloseSquareOutlined,
  PlusSquareOutlined,
} from "@ant-design/icons";
import firebase from "firebase/app";
import { AuthState } from "../Auth";
import { useQuery, useMutation } from "@apollo/client";
import { GET_PRODUCTS, APPROVE_PRODUCTS, REJECT_PRODUCTS } from "@queries";
import { format } from "date-fns";

const { RangePicker } = DatePicker;

interface Props {
  authState: AuthState;
}

const columns = [
  {
    title: "Name",
    dataIndex: "title",
    key: "name",
  },
  {
    title: "SKU",
    dataIndex: "id",
    key: "sku",
    render: (id: string) => {
      return <span>{id.split("-")[0]}</span>;
    },
  },
  {
    title: "vendor",
    dataIndex: ["user", "displayName"],
    key: "vendor",
  },
  {
    title: "category",
    dataIndex: ["product_category", "name"],
    key: "category",
  },
  {
    title: "status",
    dataIndex: "status",
    key: "status",
    render: (status: string) => {
      return <Tag key={status}>{status.toUpperCase()}</Tag>;
    },
  },

  {
    title: "Date added",
    dataIndex: "created_at",
    key: "date_added",
    render: (date: string) => {
      return <span key={date}>{format(new Date(date), "MMM d, H:m")}</span>;
    },
  },
];

enum ProductStatuses {
  pending = "PENDING",
  approved = "APPROVED",
  rejected = "REJECTED",
}

const ProductsPage: React.FC<Props> = ({ authState }) => {
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  authState.user?.getIdTokenResult().then((result) => {
    console.log({ idtokenresult: result });
  });

  const { data, loading, error } = useQuery(GET_PRODUCTS, {
    variables: { vendorId: authState.user?.uid },
  });

  const [
    approveProducts,
    { data: approveData, loading: approveLoading, error: approveError },
  ] = useMutation(APPROVE_PRODUCTS);
  const [
    rejectProducts,
    { data: rejectData, loading: rejectLoading, error: rejectError },
  ] = useMutation(REJECT_PRODUCTS);

  const navigate = useNavigate();

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectedProductIds(selectedRowKeys);
      console.log({ changedselected: true, selectedRows, selectedRowKeys });
    },
    onSelect: (record: any, selected: any, selectedRows: any) => {
      console.log({ record, selected, selectedRows });
    },
    onSelectAll: (selected: any, selectedRows: any, changeRows: any) => {
      console.log({ selectall: true, selected, selectedRows, changeRows });
    },
  };

  const parentRef = useRef(null);
  const products: any[] = [];
  const pendingProducts = 234;
  const [pendingChecked, setPendingChecked] = useState(false);
  const [approvedChecked, setApprovedChecked] = useState(false);
  const [rejectedChecked, setRejectedChecked] = useState(false);

  const vendors: string[] = [];

  const handlePendingChanged = () => {
    setPendingChecked((old) => !old);
  };
  const handleApprovedChanged = () => {
    setApprovedChecked((old) => !old);
  };
  const handleRejectedChanged = () => {
    setRejectedChecked((old) => !old);
  };

  const handleVendorChanged = (data: any) => {
    console.log({ vendorchanged: data });
  };

  const handleSearchVendor = (data: any) => {
    console.log({ vendorsearched: data });
  };

  const handleExport = () => {
    console.log({ exporting: true });
  };

  const handleApprove = async () => {
    console.log({ approvingproducts: true });
    const result = await approveProducts({
      variables: { productIds: selectedProductIds },
    });
    console.log({ approveproductresult: result });
    message.info("products approved successfully");
  };
  const handleReject = async () => {
    console.log({ rejectingproducts: true });
    const result = await rejectProducts({
      variables: { productIds: selectedProductIds },
    });
    console.log({ rejectprodutresult: result });
    message.info("products rejected sucessfully");
  };

  const dataActions = [
    { name: "approve", icon: <CheckSquareOutlined />, action: handleApprove },
    { name: "reject", icon: <CloseSquareOutlined />, action: handleReject },
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
            <div className="flex items-center justify-between p-2 space-x-2 lowercase">
              <span>Status :</span>
              <div className="flex items-center">
                <Checkbox
                  checked={pendingChecked}
                  onChange={handlePendingChanged}
                >
                  {ProductStatuses.pending}
                </Checkbox>
                <Checkbox
                  checked={approvedChecked}
                  onChange={handleApprovedChanged}
                >
                  {ProductStatuses.approved}
                </Checkbox>
                <Checkbox
                  checked={rejectedChecked}
                  onChange={handleRejectedChanged}
                >
                  {ProductStatuses.rejected}
                </Checkbox>
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
            {data?.products_aggregate.aggregate.count}
          </span>
        </div>
      </div>

      {/* table section */}
      <div className="flex flex-col justify-between w-full ">
        <div className="flex items-center justify-between py-2 space-x-4 font-semibold">
          <Link to="/products/create">
            <div
              // onClick={() => navigate("/products/create")}
              className="flex items-center p-2 space-x-4 transition-all shadow cursor-pointer text-cold-gray-500 justify-self-start bg-background-light hover:bg-background-darker hover:shadow"
            >
              <span>Add</span>
              <PlusSquareOutlined style={{ fontSize: "24px" }} />
            </div>
          </Link>
          <div className="flex items-center space-x-4">
            <div
              onClick={handleExport}
              className="flex items-center px-2 py-1 ml-auto space-x-2 shadow cursor-pointer bg-background-darker active:shadow-sm"
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
        </div>
        <Table
          rowSelection={{ ...rowSelection }}
          dataSource={data?.products.map((el: any) => ({ ...el, key: el.id }))}
          columns={columns}
        />
      </div>
    </section>
  );
};

export default ProductsPage;
