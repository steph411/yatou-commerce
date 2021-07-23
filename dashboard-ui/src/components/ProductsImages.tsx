import React, { useState, useEffect } from "react";
import { Upload, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { customUpload } from "../utils/functions";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { ADD_PRODUCT_IMAGES, GET_PRODUCT_IMAGES, DELETE_PRODUCT_IMAGES } from "@queries";

interface Props {
  productId?: string;
  onNext: Function;
  productData: any;
  setProductData?: Function;
}

const uploadButton = (
  <div>
    <PlusOutlined />
    <div style={{ marginTop: 8 }}>Upload</div>
  </div>
);

const ProductsImages: React.FC<Props> = ({ productId, onNext, productData, setProductData }) => {
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
  const [
    deleteProductImages,
    {
      data: deleteproductimagesData,
      loading: deleteproductimagesLoading,
      error: deleteproductimagesError,
    },
  ] = useMutation(DELETE_PRODUCT_IMAGES);
  const navigate = useNavigate();
  const [fileList, setFileList] = useState(productId && productData?.product_images?.map((el:any, index:number) => ({
      uid: el?.id,
      name: `${index}`,
      status: 'done',
      url: el?.url,
  })) || []);
  
  // useEffect(() => {}, [productData])

  console.log({fileList, productData});

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
    const imagesData = fileList?.map((el: any) => {
      return { productId: productId, url: el?.xhr || el?.url };
    });
    // first delete existing images to avoid duplicates and replace them by the updated image list
    console.log({imagesData, fileList});
    if (productId){
      const deleteResult = await deleteProductImages({
        variables: {productId}
      });
      console.log({deleteProductImages: deleteResult});

    }

    const result = await createProductImages({
      variables: { images: imagesData },
    });
    console.log({ createproductimagesresult: result });
    onNext();
  };

  return (
    <>
      <div className="px-4 py-16 space-x-16 overflow-x-auto">
        {/* <div className="grid self-start bg-white shadow p- place-items-center"> */}

        <Upload
          onChange={handleChange}
          className="w-20"
          headers={{ "Access-Control-Allow-Headers": "*" }}
          customRequest={customUpload}
          listType="picture-card"
          fileList={fileList}
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
          loading={ deleteproductimagesLoading || createproductimagesLoading}
        >
          {productId ? "save": "next"}
        </Button>
      </div>
    </>
  );
};

export default ProductsImages;
