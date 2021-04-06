import React from 'react';
import {Form, Upload, Input, Select, Button} from 'antd'
import {InboxOutlined} from '@ant-design/icons'
import ImgCrop from "antd-img-crop";

interface Props{}



const AddCategory: React.FC<Props> = ({}) => {
  const [form] = Form.useForm()

  const onParentCategoryChange = (data: any) => {
    console.log({parentcategorychange: data})
  }


  const handleUploadChange = (e: any) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const handleUpload = (data:any) => {
    console.log({uploading: data})
    return ""
  }

  const handleSubmit = (data:any) => {
    console.log({submitcategorydata: data})
  }

  const parentCategories = [
    {name: "shoes", value:"shoes"},
    {name: "clothes", value:"clothes"},
    {name: "phone", value:"phones"},
  ]

  return (
    <div className="py-5 px-7">
      <Form 
        onFinish={handleSubmit}
        form={form} 
        layout="vertical">
        <Form.Item label="Name">
          <Input placeholder="category name" />
        </Form.Item>

        <Form.Item label="Description">
          <Input.TextArea placeholder="description" />
        </Form.Item>

        <Form.Item label="Parent category">
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Select a category"
            optionFilterProp="children"
            onChange={onParentCategoryChange}
            // onFocus={onFocus}
            // onBlur={onBlur}
            // onSearch={onSearch}
            filterOption={(input, option) => {
              console.log({ option });
              return true;
              // return option?.toLowerCase().indexOf(input.toLowerCase()) >= 0;
            }}
          >
            {parentCategories.map((el, id) => (
              <Select.Option key={id} value={el.value}>{el.name}</Select.Option>
            ))}
          </Select>
          ,
        </Form.Item>

        <Form.Item label="Dragger">
          <Form.Item
            name="dragger"
            valuePropName="fileList"
            getValueFromEvent={handleUploadChange}
            noStyle
          >

            <ImgCrop rotate>
              <Upload.Dragger name="files" action={handleUpload}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Support for a single or bulk upload.
                </p>
              </Upload.Dragger>
            </ImgCrop>
          </Form.Item>
        </Form.Item>

        <Form.Item >
          <Button type="primary" htmlType="submit">
            Create
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}


export default AddCategory