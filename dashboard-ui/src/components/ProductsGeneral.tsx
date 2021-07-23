import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Menu, Select, Typography, message, Button } from "antd";

import { GET_CATEGORIES, CREATE_PRODUCT, GET_PRODUCT, UPDATE_PRODUCT_GENERAL } from "@queries";
import { useQuery, useMutation } from "@apollo/client";

interface Props {
  productId: string;
  setProductId: Function;
  onNext: Function;
  productData: any;
  setProductData: Function;
}

const ProductsGeneral: React.FC<Props> = ({
  productId,
  setProductId,
  onNext,
  productData,
  setProductData
}) => {
  const { data, loading, error } = useQuery(GET_CATEGORIES);
  // const { data: productData, loading: productLoading, error: productError} = useQuery(GET_PRODUCT, {variables: {
  //   productId: String(productId)
  // }})

  console.log({productData})

  const [selectedCategory, setSelectedCategory] = useState(productData?.products_by_pk?.categoryId);
  const [
    createProduct,
    {
      data: createProductData,
      loading: createProductLoading,
      error: createProductError,
    },
  ] = useMutation(CREATE_PRODUCT);
  const [
    updateProductGeneral,
    {
      data: updateProductData,
      loading: updateProductLoading,
      error: updateProductError,
    },
  ] = useMutation(UPDATE_PRODUCT_GENERAL);
  
  const navigate = useNavigate();

  const [generalForm] = Form.useForm();

  useEffect(() => { 
    generalForm.resetFields();
    // setSelectedCategory(productData?.products_by_pk?.categoryId);
    // setProductData(productData?.products_by_pk || {});
  }, [productData]);

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
    const variables = {
      categoryId: selectedCategory,
      name: formData.Name,
      title: formData.Title,
      manufacturer: formData.Manufacturer,
      brand: formData.Brand,
      price: formData.price
    }
    if (!productId){
      const result = await createProduct({
        variables: {...variables}
      });
      console.log({ createproductresult: result });
      setProductId(result?.data?.insert_products_one?.id);
      setProductData(result?.data?.insert_products_one);
    }
    else{
      const result = await updateProductGeneral({
        variables:{
          ...variables,
          productId: productId
        }
      })
      console.log({updateproductresult: result, updateProductLoading, updateProductError});
      setProductData(result?.data?.update_products_by_pk);
    }
    onNext();
  };

  // console.log({globalProductData});
  const generalInformations = [
    // { name: "Name", initial: "" },
    { name: "Title", initial: productId ? productData?.title : ""  },
    { name: "Manufacturer", initial: productId ? productData?.manufacturer : "" },
    { name: "Brand", initial: productId ? productData?.brand : "" },
    { name: "price", initial: productId ? productData?.price : "" }
  ];

  // console.log({prodfdfdf: productData?.products_by_pk});
  return (
    <>
      <div className="grid grid-cols-2 px-2 py-16 space-x-16 overflow-x-auto place-items-center">
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
                initialValue={el.initial}
                className="space-x-8 justify-items-start"
                key={id}
                name={el.name}
                label={el.name}
              >
                {
                  el.name === "Title" ? 
                  <Input.TextArea  placeholder={el.initial} /> : 
                  <Input placeholder={el.initial}  />
                }
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
              placeholder={productData?.product_category?.name || "Select a category"}
              optionFilterProp="children"
              onChange={handleFilterCategoryChange}
              filterOption={(input, option) =>
                option?.children?.toLowerCase().indexOf(input.toLowerCase()) >=
                0
              }
            >
              {data?.product_categories.map((el: any) => (
                <Select.Option key={el.id} value={el.id}>{el.name}</Select.Option>
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
