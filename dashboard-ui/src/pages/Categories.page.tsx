import React, { useState, useRef } from "react";
import Filter from "@assets/filter.svg?component";
import { DatePicker, Table, Modal, Input } from "antd";
import { Loading3QuartersOutlined, PlusSquareOutlined } from "@ant-design/icons";
import AddCategory from "@components/AddCategory";
import { useQuery } from "@apollo/client";
import { GET_CATEGORIES } from "@queries";
import { AuthState } from "../Auth";

import { format } from "date-fns";


interface GetCategoriesVariables{
  name: string; 
  lowerDate?: string;
  upperDate?: string;
}

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
    dataIndex: "created_at",
    key: "created_at",
    render: (date: string) => {
      return <span key={date}>{format(new Date(date), "MMM d, H:m")}</span>;
    },
  },
];




const CategoriesPage: React.FC<Props> = ({}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dateRange, setDateRange] = useState<string[]>([])
  const [categoryNameFilter, setCategoryNameFilter] = useState<string>("")
  const [queryVariables, setQueryVariables] = useState<GetCategoriesVariables>({name: `%%`})
  const { data, loading, error } = useQuery(GET_CATEGORIES, {variables: queryVariables});

  const parentRef = useRef(null);
  const categories: any[] = [];
  console.log({categoriesData: data})
 
  const handleRangeChanged = (value: any, dateString: string[]) => {
    console.log({value, dateString})
    setDateRange(dateString)
  }

  const handleFilterCategories = () => {
    if (loading) return
    
    let variables: GetCategoriesVariables = { 
      lowerDate: dateRange[0] || "1967-01-01",
      upperDate: (dateRange[1] && `${dateRange[1]}T23:59:59`) || `${new Date().toISOString().split("T")[0]}T23:59:59`,
      name: `%%`
    }
    
    if (categoryNameFilter){
      variables.name = `%${categoryNameFilter}%`
    }
    console.log({productQueryVariables: variables})
    setQueryVariables(variables)
  }


  return (
    <section className="space-y-8" id="categories" ref={parentRef}>
      {/* filter and add section */}
      <div className="flex items-start justify-between font-semibold text-black">
        <div className="flex flex-col space-y-3">
          <div onClick={handleFilterCategories} className="flex self-start p-2 space-x-4 transition-all shadow cursor-pointer bg-background-light hover:bg-background-darker hover:shadow-md">
            <span>filter</span>
            <span>
              <Filter />
            </span>
          </div>
          <div className="flex flex-col shadow bg-background-light">
            <div className="flex items-center justify-between p-2 space-x-2">
              <span className="flex-none">Name :</span>
              <Input 
                placeholder="category name..." 
                value={categoryNameFilter} 
                onChange={ (e) => setCategoryNameFilter(e.target.value)} 
                />
            </div>
            <div className="flex items-center p-2 space-x-2">
              <span>Date :</span>
              <RangePicker 
                onChange={handleRangeChanged}
                format="YYYY-MM-DD" 
                className="flex-1"
              />

            </div>
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
          scroll={{
              y: window.innerHeight - 534 
            }}
          sticky
          loading={loading}
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
