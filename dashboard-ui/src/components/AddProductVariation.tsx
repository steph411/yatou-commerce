import React from "react";
import { Form, Input, Button, Space, Typography } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { ADD_PRODUCT_VARIATIONS } from "@queries";

interface Props {
  productId?: string;
  onClose: Function;
}

const AddProductVariation: React.FC<Props> = ({ productId, onClose }) => {
  console.log({ productidinsideaddvariations: productId });
  const [createProductVariations, { data, loading, error }] = useMutation(
    ADD_PRODUCT_VARIATIONS
  );
  const onFinish = async (values: any) => {
    console.log({ varaitioncreatevalues: values });
    const result = await createProductVariations({
      variables: {
        productId,
        name: values?.name,
        options: { data: values?.options },
      },
    });
    console.log({ createvariationsresult: result });
    onClose(result.data.insert_product_variants_one.id);
  };

  return (
    <Form name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off">
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: "missing variation name" }]}
      >
        <Input type="text" placeholder="variation name"></Input>
      </Form.Item>
      <div className="py-4">
        <Typography.Paragraph>Variation options</Typography.Paragraph>
      </div>
      <Form.List name="options">
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
                  rules={[{ required: true, message: "missing option value" }]}
                >
                  <Input placeholder="option value" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, "price"]}
                  fieldKey={[fieldKey, "price"]}
                  // rules={[{ message: "missing variation option price" }]}
                >
                  <Input type="number" placeholder="option price" />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Add option
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
export default AddProductVariation;
