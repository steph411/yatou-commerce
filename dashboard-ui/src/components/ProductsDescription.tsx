import React from "react";
import { Form, Input, Button, Space, Typography, message } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { UPDATE_PRODUCT_DESCRIPTION } from "@queries";

interface Props {
  productId?: string;
  onClose?: Function;
  onNext: Function;
  productData: any;
  setProductData?: Function; 
}

const ProductsDescription: React.FC<Props> = ({
  productId,
  onClose,
  onNext,
  productData,
  setProductData
}) => {
  const [updateProductDescription, { data, loading, error }] = useMutation(
    UPDATE_PRODUCT_DESCRIPTION
  );
  
  console.log({productDataInsideDescription: productData});

  const [descriptionForm] = Form.useForm()

  const navigate = useNavigate();
  const onFinish = async (values: any) => {
    const productSpecs: any = {};
    const description = values.description;
    const terms = values.searchTerms.map((el: any) => el.value);
    const features = values.keyFeatures.map((el: any) => el.value);
    values?.characteristics?.forEach((el: {name: string, value: string}) => {
      productSpecs[el?.name] = el?.value
    });


    console.log({ productdescriptioncreationvalues: values, productSpecs });
    const result = await updateProductDescription({
      variables: { description, terms, features, productId, characteristics: productSpecs },
    });
    console.log({ upddateproductdescriptionresult: result });
    navigate("/products");
    message.info("product updated successfully");
  };

  const formInitialValues = {
    description: productData?.description,
    keyFeatures: productData?.keyFeatures?.map((el: string) => ({value: el})),
    searchTerms: productData?.searchTerms?.map((el: string) => ({value: el})),
    characteristics: Object.keys(productData?.characteristics || {}).map((el:string) => (
      {name: el, value: productData?.characteristics[el]}
    ))
  }

  return (
    // <div>
    <>
      <div className="grid px-2 py-8  overflow-auto max-h-[calc(100vh-224px)] place-items-center">
        <Form
          // layout="vertical"
          form={descriptionForm}
          name="dynamic_form_nest_item"
          onFinish={onFinish}
          autoComplete="off"
          initialValues={formInitialValues}
        >
          <div className="flex w-full space-x-6">
            <Typography.Title level={5}>Description</Typography.Title>
            <Form.Item
              // label="Description"
              name="description"
              style={{ minWidth: "500px" }}
              rules={[
                {
                  required: true,
                  min: 50,
                  message: "you should add a good product description",
                },
              ]}
            >
              <Input.TextArea
                rows={5}
                placeholder="description"
              ></Input.TextArea>
            </Form.Item>
          </div>
          <div className="flex space-x-6">
            <Typography.Title level={5}>key features</Typography.Title>
            <div>
              <Form.List name="keyFeatures" >
                {(fields, { add, remove, ...rest }) => { 
                  console.log({fields, rest});
                  return (
                    <>
                      {fields.map(({ key, name, fieldKey, ...restField }) => (
                        <Space
                          key={key}
                          style={{ display: "flex", marginBottom: 8 }}
                          align="baseline"
                        >
                          <Form.Item
                            {...restField}
                            name={[name, "value"]}
                            fieldKey={[fieldKey, "value"]}
                            style={{ minWidth: "500px" }}
                            rules={[
                              {
                                required: true,
                                message: "missing value for feature",
                              },
                            ]}
                          >
                            <Input placeholder="feature"  />
                          </Form.Item>
                          <MinusCircleOutlined onClick={() => remove(name)} />
                        </Space>
                      ))}
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          // block

                          icon={<PlusOutlined />}
                        >
                          add more
                        </Button>
                      </Form.Item>
                    </>
                  )}
                }
              </Form.List>
            </div>
          </div>
          <div className="flex space-x-6">
            <Typography.Title level={5}>search terms</Typography.Title>

            <div>
              <Form.List name="searchTerms">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, fieldKey, ...restField }) => (
                      <Space
                        key={key}
                        style={{ display: "flex", marginBottom: 8 }}
                        align="baseline"
                      >
                        <Form.Item
                          {...restField}
                          name={[name, "value"]}
                          fieldKey={[fieldKey, "value"]}
                          rules={[
                            {
                              required: true,
                              message: "missing value for term",
                            },
                          ]}
                        >
                          <Input placeholder="term" />
                        </Form.Item>
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </Space>
                    ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        // block
                        icon={<PlusOutlined />}
                      >
                        add more
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </div>
          </div>
          <div className="flex space-x-6">
            <Typography.Title level={5}>characteristics</Typography.Title>

            <div>
              <Form.List name="characteristics">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, fieldKey, ...restField }) => (
                      <Space
                        key={key}
                        style={{ display: "flex", marginBottom: 8 }}
                        align="start"
                      >
                        <Form.Item
                          {...restField}
                          name={[name, "name"]}
                          fieldKey={[fieldKey, "name"]}
                          rules={[{ required: true, message: "missing option name" }]}
                        >
                          <Input placeholder="option name" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, "value"]}
                          fieldKey={[fieldKey, "value"]}
                        >
                          <Input.TextArea rows={2} placeholder="option value" />
                        </Form.Item>
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </Space>
                    ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        // block
                        icon={<PlusOutlined />}
                      >
                        add more
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </div>
          </div>
          <Form.Item>
            <Button loading={loading} type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default ProductsDescription;
