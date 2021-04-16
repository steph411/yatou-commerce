import React, { useState } from "react";
import { PlusSquareOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Modal,
  Typography,
  Select,
  Menu,
  Carousel,
  Image,
  Upload,
  Button,
} from "antd";
import ImageUpload from "./ImageUpload";
import AddProductVariation from "./AddProductVariation";
import { useQuery, useMutation } from "@apollo/client";
import { GET_PRODUCT_VARIATIONS, ADD_PRODUCT_VARIATION_IMAGES } from "@queries";
import { useNavigate } from "react-router-dom";
import { customUpload } from "../utils/functions";

interface Props {
  productId: string;
  setProductId: Function;
  onNext: Function;
}

const ProductsVariations: React.FC<Props> = ({
  productId,
  setProductId,
  onNext,
}) => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedVariation, setSelectedVariation] = useState("");
  const [selectedVariationOption, setSelectedVariationOption] = useState("");
  const { data, loading, error, refetch: refetchVariations } = useQuery(
    GET_PRODUCT_VARIATIONS,
    {
      variables: { productId },
    }
  );

  const [
    createVariationOptionImages,
    {
      data: createVariationOptionImagesData,
      loading: createVariationOptionImagesLoading,
      error: createVariationOptionImagesError,
    },
  ] = useMutation(ADD_PRODUCT_VARIATION_IMAGES);
  // const [createProductVariations, {data: createVariationsData, loading: createVariationsLoading, error: createVariationsError}] = useMutation()

  const [fileList, setFileList] = useState([]);

  const handleSearchVariation = (data: any) => {
    console.log({ variationsearched: data });
  };

  const handleVariationChanged = (data: any) => {
    setSelectedVariation(data);
    console.log({ variationchanged: data });
  };

  const handleSelectedOptionChange = (data: any) => {
    setSelectedVariationOption(data.key);
    console.log({ selectedoptionchanged: data });
  };

  const handleCreateVariationOptionImages = async () => {
    console.log({ creatingvariationimages: true });
    console.log({ fileList });
    const imagesData = fileList.map((el: any) => {
      return { productVariantOptionId: selectedVariationOption, url: el?.xhr };
    });
    console.log({ imagesData });
    const result = await createVariationOptionImages({
      variables: { images: imagesData },
    });
    console.log({ createvariantoptionimagesresult: result });
    onNext();
  };

  console.log({ data, loading, error });

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const handleChange = (data: any) => {
    setFileList(data.fileList);
    console.log({ fileuploadeddata: data });
  };

  return (
    <>
      <div className="px-40 py-16 space-x-16">
        <div className="flex justify-items-end">
          <div
            onClick={() => setIsModalVisible(true)}
            className="flex items-center p-2 ml-auto space-x-4 transition-all shadow cursor-pointer bg-background-light hover:bg-background-darker hover:shadow-md"
          >
            <span>Add</span>
            <PlusSquareOutlined style={{ fontSize: "24px" }} />
          </div>
        </div>
        <div className="my-6">
          <Typography.Paragraph>variations</Typography.Paragraph>
          <Select
            showSearch
            className="flex-1"
            style={{ width: 300 }}
            placeholder="Select a variation"
            optionFilterProp="children"
            onChange={handleVariationChanged}
            // onFocus={onFocus}
            // onBlur={onBlur}
            onSearch={handleSearchVariation}
            filterOption={(input, option) => {
              console.log({ input, option });
              return true;
            }}
          >
            {data?.product_variants?.map((el: any, id: any) => (
              <Select.Option key={el?.id} value={el?.id}>
                {el?.name}
              </Select.Option>
            ))}
          </Select>
        </div>
        <div className="flex space-x-8 h-96">
          <Menu
            style={{ minWidth: "228px" }}
            className="self-start bg-white shadow"
            onSelect={handleSelectedOptionChange}
          >
            {data?.product_variants
              ?.find((el: any) => el?.id === selectedVariation)
              ?.product_variant_options.map((el: any) => {
                console.log({ variantoption: el });
                return <Menu.Item key={el.id}>{el.value}</Menu.Item>;
              })}
          </Menu>
          <div className="grid self-start p-8 bg-white shadow place-items-center">
            {/* <Carousel slidesToShow={3}> */}
            <Upload
              customRequest={customUpload}
              listType="picture-card"
              onChange={handleChange}
              defaultFileList={[]} //for the already present files when updating
            >
              {fileList.length >= 8 ? null : uploadButton}
            </Upload>
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
          onClick={handleCreateVariationOptionImages}
          loading={createVariationOptionImagesLoading}
        >
          next
        </Button>
      </div>
      <Modal
        title="Create product variation"
        visible={isModalVisible}
        centered
        onOk={console.log}
        // getContainer={() => parentRef?.current}
        okText="create"
        footer={null}
        onCancel={() => setIsModalVisible(false)}
      >
        <AddProductVariation
          onClose={async (newVariationId: string) => {
            await refetchVariations();
            setIsModalVisible(false);
            setSelectedVariation(newVariationId);
          }}
          productId={productId}
        />
      </Modal>
    </>
  );
};

export default ProductsVariations;
