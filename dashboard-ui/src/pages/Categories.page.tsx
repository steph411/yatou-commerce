import React, { useState, useRef } from "react";
import Filter from "@assets/filter.svg?component";
import { DatePicker, Table, Modal } from "antd";
import { PlusSquareOutlined } from "@ant-design/icons";
import AddCategory from "@components/AddCategory";
import { useQuery } from "@apollo/client";
import { GET_CATEGORIES } from "@queries";
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
    title: "Description",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
    key: "quantity",
  },
  {
    title: "Date added",
    dataIndex: "date_added",
    key: "date_added",
  },
];

const CategoriesPage: React.FC<Props> = ({}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { data, loading, error } = useQuery(GET_CATEGORIES);

  const parentRef = useRef(null);
  const categories: any[] = [];

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
        <div
          onClick={() => setIsModalVisible(true)}
          className="flex items-center p-2 space-x-4 transition-all shadow cursor-pointer bg-background-light hover:bg-background-darker hover:shadow-md"
        >
          <span>Add</span>
          <PlusSquareOutlined style={{ fontSize: "24px" }} />
        </div>
      </div>

      {/* table section */}
      <div className="w-full">
        <Table
          dataSource={data?.product_categories}
          rowSelection={{
            type: "checkbox",
          }}
          columns={columns}
        />
      </div>

      <Modal
        title="Create product category"
        visible={isModalVisible}
        centered
        onOk={console.log}
        // getContainer={() => parentRef?.current}
        okText="create"
        footer={null}
        onCancel={() => setIsModalVisible(false)}
      >
        <AddCategory close={() => setIsModalVisible(false)} />
      </Modal>
    </section>
  );
};

export default CategoriesPage;
