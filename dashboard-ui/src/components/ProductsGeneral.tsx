import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Menu, Select, Typography, message, Button } from "antd";

import { GET_CATEGORIES, CREATE_PRODUCT } from "@queries";
import { useQuery, useMutation } from "@apollo/client";

interface Props {
  productId: string;
  setProductId: Function;
  onNext: Function;
}

const ProductsGeneral: React.FC<Props> = ({
  productId,
  setProductId,
  onNext,
}) => {
  const { data, loading, error } = useQuery(GET_CATEGORIES);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [
    createProduct,
    {
      data: createProductData,
      loading: createProductLoading,
      error: createProductError,
    },
  ] = useMutation(CREATE_PRODUCT);
  const navigate = useNavigate();

  const [generalForm] = Form.useForm();

  const handleSelectCategory = (data: any) => {
    console.log({ selectdata: data });
    setSelectedCategory(data?.key);
  };

  const handleFilterCategoryChange = (id: string) => {
    console.log({ filtercategorydata: id });
    setSelectedCategory(id);
  };

  const handleFormChange = (data: any) => {
    console.log({
      formdata: generalForm.getFieldsValue(true),
      selectedCategory,
    });
  };

  const handleCreateProduct = async () => {
    const formData = generalForm.getFieldsValue(true);
    const result = await createProduct({
      variables: {
        categoryId: selectedCategory,
        name: formData.Name,
        title: formData.Title,
        manufacturer: formData.Manufacturer,
        brand: formData.Brand,
      },
    });
    console.log({ createproductresult: result });
    setProductId(result?.data?.insert_products_one?.id);
    onNext();
  };

  const generalInformations = [
    { name: "Name" },
    { name: "Title" },
    { name: "Manufacturer" },
    { name: "Brand" },
  ];
  return (
    <>
      <div className="grid grid-cols-2 px-40 py-16 space-x-16 place-items-center">
        <div className="">
          <Form
            form={generalForm}
            onChange={handleFormChange}
            size="large"
            layout="horizontal"
            className="space-y-8"
          >
            {generalInformations.map((el, id) => (
              <Form.Item
                className="space-x-8 justify-items-start"
                key={id}
                name={el.name}
                label={el.name}
              >
                {el.name === "Title" ? <Input.TextArea /> : <Input />}
              </Form.Item>
            ))}
          </Form>
        </div>
        <div className="flex flex-col space-y-8">
          <div>
            <Typography.Paragraph>Category</Typography.Paragraph>
            <Select
              showSearch
              style={{ width: 300 }}
              placeholder="Select a category"
              optionFilterProp="children"
              onChange={handleFilterCategoryChange}
              filterOption={(input, option) =>
                option?.children?.toLowerCase().indexOf(input.toLowerCase()) >=
                0
              }
            >
              {data?.product_categories.map((el: any) => (
                <Select.Option value={el.id}>{el.name}</Select.Option>
              ))}
            </Select>
          </div>
          <div>
            <Typography.Paragraph>Browse categories</Typography.Paragraph>
            <Menu mode="inline" onSelect={handleSelectCategory}>
              {data?.product_categories.map((el: any) => {
                if (el?.categories.length > 0) {
                  return (
                    <Menu.SubMenu key={el.id} title={el.name}>
                      {el.categories.map((el: any) => (
                        <Menu.Item key={el.id}>{el.name}</Menu.Item>
                      ))}
                    </Menu.SubMenu>
                  );
                }
                return <Menu.Item key={el.id}>{el.name}</Menu.Item>;
              })}
            </Menu>
          </div>
        </div>
      </div>
      <div className="flex px-8 py-6 space-x-6">
        <Button
          className="px-8 ml-auto"
          type="ghost"
          onClick={() => navigate("/products")}
        >
          cancel
        </Button>
        <Button
          className="px-10"
          type="primary"
          onClick={handleCreateProduct}
          loading={createProductLoading}
        >
          next
        </Button>
      </div>
    </>
  );
};

export default ProductsGeneral;
