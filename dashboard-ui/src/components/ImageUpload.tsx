import React, { useState } from "react";
import { Upload, message } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

function getBase64(img: any, callback: any) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file: any) {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt16M = file.size / 1024 / 1024 < 16;
  if (!isLt16M) {
    message.error("Image must smaller than 16MB!");
  }
  return isJpgOrPng && isLt16M;
}

interface Props {
  initialUrl?: string;
}

const ImageUpload: React.FC<Props> = ({ initialUrl = "" }) => {
  const [state, setState] = useState({ loading: false, imageUrl: initialUrl });

  const handleChange = (info: any) => {
    if (info.file.status === "uploading") {
      setState({ loading: true, imageUrl: "" });
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl: string) =>
        setState({
          imageUrl,
          loading: false,
        })
      );
    }
  };

  const handleUpload = async (file: any) => {
    console.log({ fileuploading: file });
    return "";
  };

  const { loading, imageUrl } = state;
  const uploadButton = (
    <div className="grid w-full h-full place-items-center">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Upload
      name="avatar"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      style={{ width: "228px" }}
      action={handleUpload}
      beforeUpload={beforeUpload}
      onChange={handleChange}
    >
      {imageUrl ? (
        <img src={imageUrl} alt="avatar" className="w-40 h-auto" />
      ) : (
        uploadButton
      )}
    </Upload>
  );
};

export default ImageUpload;
