import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useState, useEffect } from "react";

function ModalViewQuestion({ isOpen, setIsOpen, id }) {
  const [detail, setDetail] = useState({});
  const [answersActive, setAnswersActive] = useState([]);
  const [loading, setLoading] = useState(true);

  const removeHtmlTags = (htmlString) => {
    return htmlString?.replace(/<[^>]*>/g, "")?.replace(/['"]+/g, "");
  };

  const viewData = async () => {
    setLoading(true);
    await axios
      .get(`${import.meta.env.VITE_APP_API_BASE_URL}/answers/question/${id}`, {
        headers: {
          "api-key": "b4621b89b8b68387",
        },
      })
      .then((response) => {
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
        setAnswersActive(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error.message);
        setLoading(false);
      });
  };

  const onClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen && id) {
      viewData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, id]);

  return (
    <Dialog
      open={isOpen}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClose={onClose}
    >
      <DialogPanel className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col mx-4">
        {/* Header - Fixed */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <DialogTitle className="text-xl font-bold text-gray-900">
            View Question Details
          </DialogTitle>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {/* Package Info */}
              {detail?.package && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-blue-800">
                      Question Type:
                    </span>
                    <span className="text-sm text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                      {detail.package.type_of_question}
                    </span>
                  </div>
                </div>
              )}

              {/* Narasi - if exists */}
              {detail.naration && removeHtmlTags(detail.naration).trim() && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Narasi:
                  </h3>
                  <p className="text-gray-800">{removeHtmlTags(detail.naration)}</p>
                </div>
              )}

              {/* Question */}
              <div className="bg-white border border-gray-300 rounded-xl p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Pertanyaan:
                </h3>
                <p className="text-base text-gray-900 font-medium">
                  {removeHtmlTags(detail.name)}
                </p>
              </div>

              {/* Question Image */}
              {detail.image && detail.image.data && detail.image.data.length > 0 ? (
                <div className="flex justify-center">
                  <img
                    src={`${import.meta.env.VITE_APP_API_BASE_URL}/questions/image/${detail.id}`}
                    alt="Question Image"
                    className="max-w-full max-h-[400px] rounded-xl shadow-md object-contain"
                  />
                </div>
              ) : null}

              {/* Answers - Multiple Choice */}
              {detail?.package?.type_of_question !== "Essay" && answersActive.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Pilihan Jawaban:
                  </h3>
                  {answersActive.map((answer, index) => (
                    <div
                      key={answer.id}
                      className={`relative flex items-start p-4 border-2 rounded-xl transition-all duration-200 ${
                        answer.is_right
                          ? "border-green-400 bg-green-50 shadow-md"
                          : "border-gray-200 bg-white hover:bg-gray-50"
                      }`}
                    >
                      {/* Radio Button */}
                      <input
                        id={`answer-${answer.id}`}
                        name="answer"
                        type="radio"
                        checked={answer.is_right}
                        readOnly
                        className={`mt-1 w-5 h-5 border-2 focus:ring-2 cursor-default ${
                          answer.is_right
                            ? "text-green-600 border-green-600 focus:ring-green-500"
                            : "text-gray-400 border-gray-300"
                        }`}
                      />

                      {/* Answer Content */}
                      <div className="flex-1 ml-4">
                        <label
                          htmlFor={`answer-${answer.id}`}
                          className="flex items-start gap-3 cursor-default"
                        >
                          {/* Answer Letter */}
                          <span className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                            answer.is_right
                              ? "bg-green-600 text-white"
                              : "bg-gray-200 text-gray-700"
                          }`}>
                            {String.fromCharCode(65 + index)}
                          </span>

                          {/* Answer Text */}
                          <div className="flex-1">
                            <span className={`text-base ${
                              answer.is_right
                                ? "text-gray-900 font-semibold"
                                : "text-gray-700"
                            }`}>
                              {answer.name}
                            </span>
                          </div>
                        </label>

                        {/* Answer Image - if exists */}
                        {answer.image && (
                          <img
                            src={`${import.meta.env.VITE_APP_API_BASE_URL}/answers/image/${answer.id}`}
                            alt={`Answer ${index + 1} Image`}
                            className="mt-3 max-w-xs rounded-lg shadow-sm"
                          />
                        )}
                      </div>

                      {/* Correct/Incorrect Badge */}
                      <div className="flex-shrink-0 ml-3">
                        {answer.is_right ? (
                          <div className="flex items-center gap-2 bg-green-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm">
                            <FontAwesomeIcon icon={faCheckCircle} className="text-sm" />
                            <span>Jawaban Benar</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 bg-gray-200 text-gray-600 px-3 py-1.5 rounded-full text-xs font-medium">
                            <FontAwesomeIcon icon={faTimesCircle} className="text-sm" />
                            <span>Salah</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Essay Type */}
              {detail?.package?.type_of_question === "Essay" && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <p className="text-sm text-yellow-800 text-center font-medium">
                    Tipe soal Essay - Tidak ada pilihan jawaban
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer - Fixed */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button
            type="button"
            className="px-6 py-2.5 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-xl transition-all duration-200 shadow-sm"
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