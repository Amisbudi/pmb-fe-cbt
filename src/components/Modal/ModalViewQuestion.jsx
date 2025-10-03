import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import axios from "axios";
import { useState, useEffect } from "react";

function ModalViewQuestion({ isOpen, setIsOpen, id }) {
  const [detail, setDetail] = useState({});
  const [answersActive, setAnswersActive] = useState({});

  const removeHtmlTags = (htmlString) => {
    return htmlString?.replace(/<[^>]*>/g, "")?.replace(/['"]+/g, "");
  };

  const viewData = async () => {
    await axios
      .get(`${import.meta.env.VITE_APP_API_BASE_URL}/answers/question/${id}`, {
        headers: {
          "api-key": "b4621b89b8b68387",
        },
      })
      .then((response) => {
        // setCountAnswer(0);
        // setCountAnswer(response.data.length);
        const content = response.data[0].question;
        let data = {
          id: content.id,
          package_question_id: content.package_question_id,
          package: content.package,
          id_group_questions: content.id_group_questions,
          naration: content.naration,
          name: content.name,
          image: content.image,
          status: content.status,
        };

        setDetail(data);
        setAnswersActive(response.data)
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const onClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    viewData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log("detatil : ", detail);

  return (
    <Dialog
      open={isOpen}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClose={onClose}
    >
      <DialogPanel className="w-1/2 max-w-1/2 bg-white rounded-lg p-6 shadow-lg h-[70vh] relative">
        <DialogTitle>View Question</DialogTitle>

        <div className="mt-10 flex flex-col gap-y-7">
          <span>{removeHtmlTags(detail.name)}</span>

          {detail.image ? (
            <img
              src={`${import.meta.env.VITE_APP_API_BASE_URL}/questions/image/${
                detail.id
              }`}
              alt="Question Image"
              className="relative max-w-fit max-h-[50vh] rounded-xl"
            />
          ) : (
            <span>Tidak ada gambar</span>
          )}

          <div className="space-y-2">
            {detail?.package?.type_of_question !== "Essay" &&
              answersActive.length > 0 &&
              answersActive.map((answer, index) => (
                <div
                  key={index}
                  className="flex items-center p-4 border border-gray-200 hover:bg-gray-50 transition ease-in-out rounded-2xl"
                >
                  <input
                    id={`answer-${answer.id}`}
                    name="answer"
                    data-question={answer?.question_id}
                    data-package={answer?.question?.package_question_id}
                    readOnly
                    type="radio"
                    className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded-2xl focus:ring-emerald-500"
                  />
                  <label
                    htmlFor={`answer-${answer.id}`}
                    className="w-full py-4 ms-2 text-sm font-medium text-gray-900"
                  >
                    {answer.name}
                  </label>
                  {/* {answer.image && (
                    <img
                      src={`${
                        import.meta.env.VITE_APP_API_BASE_URL
                      }/answers/image/${answer.id}`}
                      alt="Answer Image"
                      className="w-36 rounded-xl"
                    />
                  )} */}
                </div>
              ))}

            {detail?.package?.type_of_question === "Essay" && (
              <>
                <div
                  {...getRootProps({
                    className:
                      "dropzone flex items-center justify-center bg-gray-200 p-10 rounded-md",
                  })}
                >
                  {!file && (
                    <div className="flex flex-col gap items-center">
                      <input {...getInputProps()} />
                      <FontAwesomeIcon icon={faFileArrowUp} size="2x" />

                      <p className="font-bold text-sm">
                        Select a file to upload
                      </p>
                      <p className="text-sm text-slate-400">
                        or drag and drop it here
                      </p>
                    </div>
                  )}

                  {file && (
                    <div className="flex flex-col gap-2 items-center">
                      <FontAwesomeIcon icon={faImages} size="2x" />

                      <p className="font-bold">File Uploaded</p>
                    </div>
                  )}
                </div>

                {preview && (
                  <>
                    <div
                      style={{ marginTop: "20px" }}
                      className="flex items-end flex-col"
                    >
                      <img
                        src={preview}
                        alt="Preview"
                        style={{
                          maxWidth: "50%",
                          maxHeight: "170px",
                          borderRadius: "10px",
                          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                        }}
                      />
                      <p
                        style={{ marginTop: "10px" }}
                        className="text-sm opacity-60"
                      >
                        {file?.name}
                      </p>
                    </div>

                    <div className="mt-4 flex justify-end space-x-3">
                      <button
                        onClick={() => setFile(null)} // Reset untuk unggah ulang
                        className="px-3 py-1 bg-orange-300 text-white font-semibold rounded-lg hover:bg-orange-500 transition"
                      >
                        <FontAwesomeIcon icon={faPencilAlt} />
                      </button>
                      <button
                        onClick={handleDeleteImage}
                        className="px-3 py-1 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
        {/* Tombol aksi */}
        <div className="flex justify-end gap-2 absolute bottom-4 right-5">
          <button
            type="button"
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </DialogPanel>
    </Dialog>
  );
}

export default ModalViewQuestion;
