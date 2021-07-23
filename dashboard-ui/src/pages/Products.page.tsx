import React, { useState, useRef } from "react";
import Filter from "@assets/filter.svg?component";
import { useNavigate, Link } from "react-router-dom";
import {
  DatePicker,
  // Table,
  Checkbox,
  Select,
  Dropdown,
  Menu,
  Tag,
  Button,
  message,
  Input
} from "antd";
import { Table, ExportTableButton } from "ant-table-extensions";
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
import { 
  GET_PRODUCTS_VENDOR, 
  GET_PRODUCTS_ADMIN, 
  GET_FILTERED_PRODUCTS_ADMIN,
  GET_FILTERED_PRODUCTS_VENDOR,
  GET_USERS,
  APPROVE_PRODUCTS, 
  REJECT_PRODUCTS 
} from "@queries";
import { format } from "date-fns";
import {roles} from '@types';

const { RangePicker } = DatePicker;

interface Props {
  authState: AuthState;
}


const statuses = {
  PENDING: { color: "orange", value: "PENDING" },
  APPROVED: { color: "cyan", value: "APPROVED" },
  REJECTED: { color: "red", value: "REJECTED" },
}


const columns = [
  {
    title: "Name",
    dataIndex: "title",
    key: "name",
    render: (name: string) => {
      return <span key={name} className="inline-block max-w-full truncate">{name}</span>
    }
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
    render: (status: ('PENDING' | 'APPROVED' | 'REJECTED')) => {
      return <Tag color={statuses[status].color} key={status}>{status.toUpperCase()}</Tag>;
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


const productsQueries = {
  [roles.admin]: {
    regular: GET_PRODUCTS_ADMIN,
    filtered: GET_FILTERED_PRODUCTS_ADMIN
  },
  [roles.vendor]: {
    regular: GET_PRODUCTS_VENDOR,
    filtered: GET_FILTERED_PRODUCTS_VENDOR
  }
}

interface ProductsQueryVariables {
  vendorId?: string;
  lowerDate?: string;
  upperDate?: string;
  vendor?: string;
  statuses?: string[];
  name?: string;
}


interface UserQueryVariables {
  name?: string
  role?: string
}

enum ProductStatuses {
  pending = "PENDING",
  approved = "APPROVED",
  rejected = "REJECTED",
}

const ProductsPage: React.FC<Props> = ({ authState }) => {
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  
  // authState.user?.getIdTokenResult().then((result) => {
  //   console.log({ idtokenresult: result });
  // });

  const [nameInputValue, setNameInputValue] = useState<string>("")
  
  const tableRef = useRef<HTMLDivElement>(null);

  const [productQuery, setProductQuery] = useState(productsQueries[authState?.userRole as any].regular)

  const [userQueryVariables, setUserQueryVariables] = useState<UserQueryVariables>({
    name: `%%`,
    role: authState?.userRole === roles.admin ? roles.vendor : roles.public
  })

  const [usersLoading, setUsersLoading] = useState<Boolean>(false);


  const {data: usersData, loading: userDataLoading, error: userDataError} = useQuery(GET_USERS, {variables: userQueryVariables})

  const [pendingChecked, setPendingChecked] = useState(false);
  const [approvedChecked, setApprovedChecked] = useState(false);
  const [rejectedChecked, setRejectedChecked] = useState(false);
  const [dateRange, setDateRange] = useState<string[]>([])
  const selectedStatuses = [
    {name: ProductStatuses.approved, checked: approvedChecked},
    {name: ProductStatuses.pending, checked: pendingChecked},
    {name: ProductStatuses.rejected, checked: rejectedChecked}
  ]


  // const productQuery = productsQueries[authState?.userRole as any]; // we can not be here if the user is not authenticated
  const [productQueryVariables, setProductQueryVariables] = useState<ProductsQueryVariables>({})
  // if (authState?.userRole === roles.vendor){
  //   setProductQueryVariables(old => ({...old, vendorId: authState?.user?.uid})) 
  // }
  const { data, loading: productsLoading, error: productsError } = useQuery(productQuery, {
    variables: productQueryVariables
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

  console.log({
    top: tableRef?.current?.getBoundingClientRect().top
  })
  const parentRef = useRef(null);

  


  const handleRangeChanged = (value: any, dateString: string[]) => {
    console.log({value, dateString})
    setDateRange(dateString)
  }

  const handleFilterProducts = () => {
    if (productsLoading) return
    setProductQuery(productsQueries[authState?.userRole as any].filtered)
    let statuses = selectedStatuses.filter(el => el.checked).map(el => el.name)
    if (statuses.length == 0){
      statuses = selectedStatuses.map(el => el.name);
    }
    let variables: ProductsQueryVariables = { 
      statuses,
      lowerDate: dateRange[0] || "1967-01-01",
      upperDate: (dateRange[1] && `${dateRange[1]}T23:59:59`) || `${new Date().toISOString().split("T")[0]}T23:59:59`,
      name: `%%`
    }
    if (authState.userRole === roles.admin){
      variables.vendor = `%%`
    }
    if (authState.userRole === roles.vendor){
      variables.vendorId = authState?.user?.uid
    }
    if (nameInputValue){
      variables.name = `%${nameInputValue}%`
    }
    console.log({productQueryVariables: variables})
    setProductQueryVariables(variables)
  }

  const handlePendingChanged = () => {
    setPendingChecked((old) => !old)
    
  };
  const handleApprovedChanged = () => {
    setApprovedChecked((old) => !old);
  };
  const handleRejectedChanged = () => {
    setRejectedChecked((old) => !old);
  };

  const handleVendorChanged = (data: any, option: any) => {
    // the id of the user is in the key attribute of the option
    console.log({ vendorchanged: data, data: {data, option} });
    setProductQueryVariables(old => ({
      ...old,
      vendorId: option?.key 
    }))
  };

  const handleSearchVendor = (data: any) => {
    console.log({ vendorsearched: data });
    setUserQueryVariables(old => ({
      ...old,
      name: `%${data}%`
    }))
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

  console.log({products: data, usersData});

  return (
    <section className="space-y-8" id="products" ref={parentRef}>
      {/* filter and add section */}
      <div className="flex items-start justify-between font-semibold text-black">
        <div className="flex flex-col space-y-3">
          <div onClick={handleFilterProducts} className="flex self-start p-2 space-x-4 transition-all shadow cursor-pointer bg-background-light hover:bg-background-darker hover:shadow-md">
            <span>filter</span>
            <span>
              <Filter />
            </span>
          </div>

          <div className="flex flex-col shadow bg-background-light">
            <div className="flex items-center justify-between p-2 space-x-2">
              <span className="flex-none">Name :</span>
              <Input 
                placeholder="product name..." 
                value={nameInputValue} 
                onChange={ (e) => setNameInputValue(e.target.value)} 
                />
            </div>
            <div className="flex items-center justify-between p-2 space-x-2">
              <span className="flex-none">Date :</span>
              <RangePicker
                onChange={handleRangeChanged}
                format="YYYY-MM-DD" 
                className="flex-1" />
            </div>
            <div className="flex items-center justify-between p-2 space-x-2 lowercase">
              <span className="flex-none">Status :</span>
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
              <span>{authState.userRole === roles.admin ? 'vendor' : 'user'} :</span>
              <Select
                showSearch
                className="flex-1"
                style={{ width: 228 }}
                placeholder="Select a person"
                optionFilterProp="children"
                onChange={handleVendorChanged}
                loading={userDataLoading}
                // onFocus={onFocus}
                // onBlur={onBlur}
                onSearch={handleSearchVendor}
                filterOption={(input, option) => {
                  console.log({ input, option });
                  return true;
                }}
              >
                {usersData?.users?.map((el : any) => (
                  <Select.Option  key={el?.id} value={el.displayName}>
                    {el.displayName}
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
              // onClick={handleExport}
              className="flex items-center ml-auto space-x-2 shadow cursor-pointer bg-background-darker active:shadow-sm"
            >
              <ExportTableButton
                dataSource={data?.products.map((el: any) => ({ ...el, key: el.id }))}
                columns={columns}
                btnProps={{ type: "text", block: true }}
                fields={{
                  Name: {header: "Name", formatter:(fieldValue, record, index) =>  record?.title },
                  SKU: {header: "SKU", formatter:(fieldValue, record, index) => String(record.id.split("-")[0])},
                  vendor: {header: "vendor", formatter:(fieldValue, record, index) => String(record?.user?.displayName)},
                  category: {header: "category", formatter:(fieldValue, record, index) => String(record?.product_category?.name)},
                  status: {header: "status", formatter:(fieldValue, record, index) => String(fieldValue)},
                  "Date Added": {header: "date_added", formatter:(fieldValue, record, index) => String(record?.created_at.split(".")[0])},
                }}
                fileName={`products_${new Date().toISOString()}`}
                showColumnPicker
              >
                <span>export</span>
                <DownloadOutlined style={{ fontSize: "20px" }} />
              </ExportTableButton>
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

        <div ref={tableRef}>
          <Table
            onRow={(data: any, index: any) => ({
              onClick: (event) => navigate(`/products/${data?.id}`)
            })}
            rowSelection={{ ...rowSelection }}
            scroll={{
              y: window.innerHeight - 590
            }}
            sticky
            // exportable={true}
            loading={productsLoading}
            dataSource={data?.products.map((el: any) => ({ ...el, key: el.id }))}
            columns={columns}
          />
        </div>
      </div>
    </section>
  );
};

export default ProductsPage;
