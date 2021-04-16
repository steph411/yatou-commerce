import React, { useState } from "react";
import { Upload, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { customUpload } from "../utils/functions";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { ADD_PRODUCT_IMAGES, GET_PRODUCT_IMAGES } from "@queries";

interface Props {
  productId?: string;
  onNext: Function;
}

const uploadButton = (
  <div>
    <PlusOutlined />
    <div style={{ marginTop: 8 }}>Upload</div>
  </div>
);

const ProductsImages: React.FC<Props> = ({ productId, onNext }) => {
  const { data, loading, error } = useQuery(GET_PRODUCT_IMAGES, {
    variables: { productId },
  });
  const [
    createProductImages,
    {
      data: createproductimagesData,
      loading: createproductimagesLoading,
      error: createproductimagesError,
    },
  ] = useMutation(ADD_PRODUCT_IMAGES);
  const navigate = useNavigate();
  const [fileList, setFileList] = useState([]);

  console.log({ productimages: data, loading, error });
  console.log({
    createproductimagesData,
    createproductimagesError,
    createproductimagesLoading,
  });
  const handleChange = (data: any) => {
    setFileList(data?.fileList);
    console.log({ uploaedproductimagechange: data });
  };

  const handleCreateProductImages = async () => {
    const imagesData = fileList.map((el: any) => {
      return { productId: productId, url: el?.xhr };
    });
    const result = await createProductImages({
      variables: { images: imagesData },
    });
    console.log({ createproductimagesresult: result });
    onNext();
  };

  return (
    <>
      <div className="px-40 py-16 space-x-16">
        {/* <div className="grid self-start bg-white shadow p- place-items-center"> */}

        <Upload
          onChange={handleChange}
          headers={{ "Access-Control-Allow-Headers": "*" }}
          customRequest={customUpload}
          listType="picture-card"
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
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
          onClick={handleCreateProductImages}
          loading={createproductimagesLoading}
        >
          next
        </Button>
      </div>
    </>
  );
};

export default ProductsImages;
