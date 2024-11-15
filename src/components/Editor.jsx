import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const TextEditor = ({handleChangeEditor, name, value, createModal}) => {
  // State to handle changes in the text editor content
  const [content, setContent] = useState(value);

  // Quill modules configuration
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
    ],
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    },
  };

  // Handle changes in the quill text editor
  const handleChange = (content, delta, source, editor) => {
    setContent(editor.getContents());

    handleChangeEditor(name, content);
  };

  return createModal && (
    <>
      {/* <div className="w-full p-3 mb-5"> */}
            <ReactQuill
              className="h-[10rem]"
              theme="snow"
              formats={[
                "header",
                "bold",
                "italic",
                "underline",
                "list",
                "bullet",
              ]}
              placeholder={`Write something ${name === 'name' ? 'question' : name}...`}
              modules={modules}
              value={content}
              onChange={handleChange}
            />
      {/* </div> */}
    </>
  );
};

export default TextEditor;