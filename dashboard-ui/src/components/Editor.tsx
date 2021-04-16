import React, {useState} from "react";
import ReactQuill, { Quill } from "react-quill";
// import { ImageDrop } from "quill-image-drop-module";
// import MagicUrl from "quill-magic-url";
import BlotFormatter from "quill-blot-formatter";

interface Props {
  defaultValue?: any;
  readOnly?: boolean;
  value: string;
  onValueChange: any
}

// Quill.register("modules/imageDrop", ImageDrop);
// Quill.register("modules/magicUrl", MagicUrl);
Quill.register("modules/blotFormatter", BlotFormatter);

const Editor: React.FC<Props> = ({ defaultValue, value, onValueChange, readOnly }) => {

  let modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5] }, { font: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ align: [] }],
      // ["link", "image", "video"],
      ["clean"],
    ],
    // imageDrop: true,
    // magicUrl: {
    //   urlRegularExpression: /(https?:\/\/|www\.)[\w-\.]+\.[\w-\.]+(\/([\S]+)?)?/i,
    // },
    // blotFormatter: {
    //   overlay: {
    //     style: {
    //       border: "1px solid #0C4A6E",
    //     },
    //   },
    // },
  };
  


  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    // "link",
    "font",
    // "image",
    // "video",
    "color",
    "background",
    // "imageBlot", // #5 Optinal if using custom formats
    "align",
  ];

  return (
    <ReactQuill
      theme="snow"
      modules={modules}
      value={value}
      defaultValue={defaultValue}
      readOnly={readOnly}
      formats={formats}
      onChange={onValueChange}
    />
  );
};

export default Editor;
