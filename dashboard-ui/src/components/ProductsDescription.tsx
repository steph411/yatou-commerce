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
}

const ProductsDescription: React.FC<Props> = ({
  productId,
  onClose,
  onNext,
}) => {
  const [updateProductDescription, { data, loading, error }] = useMutation(
    UPDATE_PRODUCT_DESCRIPTION
  );

  const navigate = useNavigate();
  const onFinish = async (values: any) => {
    const description = values.description;
    const terms = values.searchTerms.map((el: any) => el.value);
    const features = values.keyFeatures.map((el: any) => el.value);
    console.log({ productdescriptioncreationvalues: values });
    const result = await updateProductDescription({
      variables: { description, terms, features, productId },
    });
    console.log({ upddateproductdescriptionresult: result });
    navigate("/products");
    message.info("product added successfully");
  };

  return (
    // <div>
    <>
      <div className="grid px-40 py-16 space-x-16 place-items-center">
        <Form
          // layout="vertical"
          name="dynamic_form_nest_item"
          onFinish={onFinish}
          autoComplete="off"
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
              <Form.List name="keyFeatures">
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
                          style={{ minWidth: "500px" }}
                          rules={[
                            {
                              required: true,
                              message: "missing value for feature",
                            },
                          ]}
                        >
                          <Input placeholder="feature" />
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
