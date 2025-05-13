import { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faFileArrowUp, faImages, faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
import TrisaktiLogo from "../assets/img/Logo-Usakti-White.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {useDropzone} from 'react-dropzone'

const Assesment = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const [timeLeft, setTimeLeft] = useState("00:00:00");
  const [scheduleTime, setScheduleTime] = useState(null);
  const [identityNumber, setIdentityNumber] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [questionActive, setQuestionActive] = useState("");
  const [answersActive, setAnswersActive] = useState([]);
  const [record, setRecord] = useState(null);
  const [answered, setAnswered] = useState("");

  const [isAnswered, setIsAnswered] = useState("");
  const [indexQuestion, setIndexQuestion] = useState("");
  const [update, setUpdate] = useState(false);
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
        const selectedFile = acceptedFiles[0];
        if (selectedFile) {
          setFile(selectedFile);
          setPreview(URL.createObjectURL(selectedFile));
        }
    },
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
    },
    maxFiles: 1,
  })

  // Code untuk bersihkan URL sementara untuk mencegah kebocoran memori
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);
  
  const getQuestions = async () => {
    setLoading(true);
    try {
      const activePackage = localStorage.getItem("CBT:package");
      if (activePackage) {
        const data = JSON.parse(activePackage);
        const responseQuestions = await axios.get(
          `${import.meta.env.VITE_APP_API_BASE_URL}/questionusers/packagequestion/${data?.package_question_id}/${data.user_id}/${data.registration_number}`,
          {
            headers: {
              "api-key": "b4621b89b8b68387",
            },
          },
        );
        setQuestions(responseQuestions.data);
        setQuestionActive(responseQuestions.data[0].question);
        setIndexQuestion(responseQuestions.data[0].number);
        setScheduleTime(new Date(responseQuestions.data[0].date_end));
      
        getRecord(
          responseQuestions.data[0]?.question_id,
          responseQuestions.data[0]?.package_question_id,
          responseQuestions.data[0]?.registration_number
        );
        setRegNumber(responseQuestions.data[0].registration_number);
        getAnswers(responseQuestions.data[0].question_id);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateQuestions = async () => {
    try {
      const activePackage = localStorage.getItem("CBT:package");
      if (activePackage) {
        const data = JSON.parse(activePackage);
        const responseQuestions = await axios.get(
          `${import.meta.env.VITE_APP_API_BASE_URL}/questionusers/packagequestion/${data.package_question_id}/${data.user_id}/${data.registration_number}`,
          {
            headers: {
              "api-key": "b4621b89b8b68387",
            },
          },
        );
        setQuestions(responseQuestions.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getRecord = async (question, pkg, noreg) => {
    await axios
      .get(
        `${import.meta.env.VITE_APP_API_BASE_URL}/records/question/${question}/${pkg}/${noreg}`,
        {
          headers: {
            "api-key": "b4621b89b8b68387",
          },
        },
      )
      .then((response) => {
        setAnswered(response.data.answer.name);
        setIsAnswered(true);
        setUpdate(true);
      })
      .catch((error) => {
        setAnswered("");
        setIsAnswered(false);
        setUpdate(false);
        console.log(error.message);
      });
  };

  const getAnswers = async (id) => {
    try {
      const responseAnwers = await axios.get(
        `${import.meta.env.VITE_APP_API_BASE_URL}/answers/question/${id}`,
        {
          headers: {
            "api-key": "b4621b89b8b68387",
          },
        },
      );
      setAnswersActive(responseAnwers.data);
      // console.log('responseAnwers.data :', responseAnwers.data)
    } catch (error) {
      console.log(error.message);
    }
  };

  const changeQuestion = async (id, packageQuestion, noreg) => {
    try {
      const responseQuestions = await axios.get(
        `${import.meta.env.VITE_APP_API_BASE_URL}/questionusers/${id}/${packageQuestion}/${noreg}`,
        {
          headers: {
            "api-key": "b4621b89b8b68387",
          },
        },
      );
      setQuestionActive(responseQuestions.data.question);
      getAnswers(responseQuestions.data.question_id);
      getRecord(
        responseQuestions.data.question_id,
        responseQuestions.data.package_question_id,
        responseQuestions.data.registration_number
      );
      setRegNumber(responseQuestions.data.registration_number);
      setIndexQuestion(id);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleChange = async (e) => {
    const questionId = e.target.getAttribute("data-question");
    const packageQuestionId = e.target.getAttribute("data-package");
    const answerId = e.target.value;

    const data = {
      number: indexQuestion,
      question_user_id: indexQuestion,
      question_id: questionId,
      package_question_id: packageQuestionId,
      answer_id: answerId,
      user_id: identityNumber,
      registration_number: regNumber,
    };
    setSelectedAnswer(e.target.value);
    setRecord(data);
  };

  const convertFileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file); 
    });

  const saveRecord = async (e) => {
    e.preventDefault()
    try {
      if (videoRef.current && videoRef.current.srcObject) {
        setLoading(true);
        const track = videoRef.current.srcObject.getVideoTracks()[0];
        const imageCapture = new ImageCapture(track);
        const blob = await imageCapture.takePhoto();

        const imageDataURL = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });

        if (update) {
          const response = await axios.patch(
            `${import.meta.env.VITE_APP_API_BASE_URL}/records/${record?.question_id}/${record?.package_question_id}`,
            {
              user_id: 1,
              answer_id: record.answer_id,
              photo: imageDataURL,
              essay_image: file
            },
            {
              headers: {
                "api-key": "b4621b89b8b68387",
              },
            },
          );
          if (response.data) {
            setTimeout(() => {
              setLoading(false);
            }, 500);
          }
        } else {
          setFile(null)
          setPreview(null)
          const base64File = file ? await convertFileToBase64(file) : null;
          let payload = {};

          if (questionActive.package?.type_of_question === 'Multiple choice') {
            payload = {
              question_user_id: record.question_user_id || null,
              question_id: record.question_id || null,
              answer_id: record.answer_id || null,
              package_question_id: record?.package_question_id || questionActive?.package_question_id,
              user_id: identityNumber || '',
              registration_number: regNumber,
              essay_image: base64File,
            };
          }
          
          if (questionActive.package?.type_of_question === 'Essay') {
            payload = {
              question_id: questionActive.id,
              package_question_id: questionActive?.package_question_id,
              registration_number: regNumber,
              user_id: identityNumber || '',
              essay_image: base64File,
            };
          }

          const response = await axios.post(
            `${import.meta.env.VITE_APP_API_BASE_URL}/records`,
            payload,
            {
              headers: {
                'api-key': 'b4621b89b8b68387',
              },
            }
          );
          if (response.data) {
            setTimeout(() => {
              setLoading(false);
            }, 500);
          }
        }

        let nextPage = null
        let packageQuestId = null

        if (questionActive.package?.type_of_question === 'Essay') {
          nextPage = indexQuestion + 1;
          packageQuestId = questionActive?.package_question_id
        }
        
        if (questionActive.package?.type_of_question === 'Multiple choice') {
            nextPage = record.number + 1
            packageQuestId = record?.package_question_id
        }

        if (nextPage > questions.length) {
          nextPage = 1; 
        }

        if (nextPage <= questions.length) {
          changeQuestion(nextPage, packageQuestId, regNumber);
        } else {
          changeQuestion(1, packageQuestId, regNumber);
        }
        
        setIndexQuestion(null);
        setSelectedAnswer(null);
        updateQuestions();
      } else {
        // alert("Kamera tidak aktif!");
        setLoading(true);
        if (update) {
          const response = await axios.patch(
            `${import.meta.env.VITE_APP_API_BASE_URL}/records/${record?.question_id}/${record?.package_question_id}`,
            {
              user_id: 1,
              answer_id: record.answer_id,
            },
            {
              headers: {
                "api-key": "b4621b89b8b68387",
              },
            },
          );
          if (response.data) {
            setTimeout(() => {
              setLoading(false);
            }, 500);
          }
        } else {
          const base64File = file ? await convertFileToBase64(file) : null;
          let payload = {};

          if (questionActive.package?.type_of_question === 'Multiple choice') {
            payload = {
              question_user_id: record.question_user_id || null,
              question_id: record.question_id || null,
              answer_id: record.answer_id || null,
              package_question_id: record?.package_question_id || questionActive?.package_question_id,
              user_id: identityNumber || '',
              registration_number: regNumber,
              essay_image: file,
            };
          } else if (questionActive.package?.type_of_question === 'Essay') {
            payload = {
              package_question_id: questionActive?.package_question_id,
              user_id: identityNumber || '',
              registration_number: regNumber,
              essay_image: base64File,
            };
          }

          const response = await axios.post(
            '${import.meta.env.VITE_APP_API_BASE_URL}/records',
            payload,
            {
              headers: {
                'api-key': 'b4621b89b8b68387',
              },
            }
          );
          if (response.data) {
            setTimeout(() => {
              setLoading(false);
            }, 500);
          }
        }
        let nextPage = null
        let packageQuestId = null
        
        if (questionActive.package?.type_of_question === 'Essay') {
          nextPage = indexQuestion + 1;
          packageQuestId = questionActive?.package_question_id
        }
        
        if (questionActive.package?.type_of_question === 'Multiple choice') {
          nextPage = record.number + 1
          packageQuestId = record?.package_question_id
        }

        if (nextPage > questions.length) {
           nextPage = 1;
        }

        if (nextPage <= questions.length) {
          changeQuestion(nextPage, packageQuestId, regNumber);
        } else {
          changeQuestion(1, packageQuestId, regNumber);
        }

        setIndexQuestion(null);
        setSelectedAnswer(null);
        updateQuestions();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleFinish = () => {
    if (window.confirm("Apakah anda yakin akan menyelesaikan tes ini?")) {
      localStorage.removeItem("CBT:package");
      navigate("/dashboard");
    }
  };

  useEffect(() => {
    const getInfo = async () => {
      try {
        const token = localStorage.getItem("CBTtrisakti:token");
        if (!token) {
          navigate("/");
          throw new Error("Token tidak ditemukan");
        }
        const authData = JSON.parse(token);
        const currentTime = Math.floor(Date.now() / 1000);
        const tokenReceivedTime = authData.received;
        const expiredTime = authData.expired;

        if (currentTime - tokenReceivedTime >= expiredTime) {
          alert("Mohon maaf, sesi telah habis!");
          localStorage.removeItem("CBTtrisakti:token");
          navigate("/");
          throw new Error("Token sudah kedaluwarsa");
        }
        const response = await axios.get(
          "https://api.trisakti.ac.id/d3b1b0f38e11d357db8a6ae20b09ff23?username=haisyammaulana22@gmail.com",
          {
            headers: {
              Authorization: `Bearer ${authData.token}`,
            },
          },
        );
        setIdentityNumber(response.data.identify_number);
        const decoded = jwtDecode(token);
        if (decoded.scopes[0] == "admission-admin") {
          return navigate("/admin");
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    getInfo();

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          getQuestions();
        }
      } catch (error) {
        console.error("Error accessing the camera:", error);
        const packageStorage = localStorage.getItem('CBT:package');
        const packageParse = JSON.parse(packageStorage);
        const response = await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/packagequestionusers/check/${packageParse?.package_question_id}`,{
          headers: {
            "api-key": "b4621b89b8b68387",
          },
        });
        if(response.data.camera_status){
          getQuestions();
        }
      }
    };

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (!scheduleTime) return;

    const countdown = setInterval(() => {
      const now = new Date();
      const timeDiff = scheduleTime - now;
      if (timeDiff <= 0) {
        clearInterval(countdown);
        localStorage.removeItem("CBT:package");
        alert("Waktu anda telah habis!");
        navigate("/dashboard");
      } else {
        const hours = Math.floor(timeDiff / (1000 * 60 * 60))
          .toString()
          .padStart(2, "0");
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
          .toString()
          .padStart(2, "0");
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000)
          .toString()
          .padStart(2, "0");
        setTimeLeft(`${hours}:${minutes}:${seconds}`);
     }
    }, 1000);

    return () => clearInterval(countdown);
  }, [scheduleTime]);

  const handleDeleteImage = () => {
    setFile(null);
    setPreview(null);
  };

  return (
    <main className="h-screen bg-gray-100 flex md:py-10">
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center md:gap-5">
        <section className="order-2 md:order-1 w-full md:w-9/12 bg-white shadow-md p-10 h-screen md:h-full md:rounded-3xl md:overflow-y-auto">
          {questionActive?.group_questions !== null &&
            answersActive.length !== 0 && (
            <div className="mb-2 space-y-2">
              <h1 className="text-xl font-bold">
                {questionActive?.group_questions?.name}
                <b className="mx-2">waktu {questionActive?.group_questions?.duration} menit</b>
              </h1>
              <p className="text-sm tracking-wide">{questionActive?.group_questions?.naration?.replace(/<[^>]*>/g, '')?.replace(/&nbsp;/g, ' ')?.replace(/"/g, '')?.trim()}</p>
            </div>
          )}
          <div className="space-y-8">
            <div className="space-y-3">
              {questionActive?.image && (
                <img
                  src={`${import.meta.env.VITE_APP_API_BASE_URL}/questions/image/${questionActive.id}`}
                  alt="Question Image"
                  className="w-[500px] rounded-xl"
                />
              )}
              {questionActive?.naration && 
                <p className="text-gray-900">{document.createElement("div").innerHTML = questionActive?.naration?.replace(/<[^>]*>/g, '')?.replace(/&nbsp;/g, ' ')?.replace(/"/g, '')?.trim()}</p>
              }
              {questionActive?.name && 
              <p className="text-gray-900">{document.createElement("div").innerHTML = questionActive?.name?.replace(/<[^>]*>/g, '')?.replace(/&nbsp;/g, ' ')?.replace(/"/g, '')?.trim()}</p>
              }
              {isAnswered && (
                <div className="inline-block bg-emerald-100 text-emerald-900 px-4 py-2.5 text-sm rounded-xl">
                  Anda sudah menjawab:{" "}
                  <span className="font-medium">{answered}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              {questionActive?.package?.type_of_question !== 'Essay' &&
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
                      value={answer.id}
                      onChange={handleChange}
                      type="radio"
                      className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded-2xl focus:ring-emerald-500"
                      checked={selectedAnswer === answer.id.toString()}
                    />
                    <label
                      htmlFor={`answer-${answer.id}`}
                      className="w-full py-4 ms-2 text-sm font-medium text-gray-900"
                    >
                      {answer.name}
                    </label>
                    {answer.image && (
                      <img
                        src={`${import.meta.env.VITE_APP_API_BASE_URL}/answers/image/${answer.id}`}
                        alt="Answer Image"
                        className="w-36 rounded-xl"
                      />
                    )}
                  </div>
                ))}
              
              {questionActive?.package?.type_of_question === 'Essay' && (
                <>
                 <div
                    {...getRootProps({
                      className:
                        'dropzone flex items-center justify-center bg-gray-200 p-10 rounded-md',
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
                
                        <p className="font-bold">
                          File Uploaded
                        </p>
                      </div>
                    )}
                 </div>
                
                  {preview && (
                    <>
                    <div style={{ marginTop: "20px" }} className='flex items-end flex-col'>
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
                      <p style={{ marginTop: "10px" }} className='text-sm opacity-60'>{file?.name}</p>
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
              
              {answersActive.length === 0 && !questionActive && (
                <div>
                  <h4 className="text-lg text-red-500 font-bold">
                    Peringatan!
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Maka ujian untuk sementara tidak bisa dilanjutkan. Silahkan
                    aktifkan kamera atau minta izin ke panitia tes seleksi
                    masuk.
                  </p>
                </div>
              )}
             
            </div>
            {!loading && (
              <div className="flex justify-center md:justify-start items-center gap-3">
                {questions.length > 0 && (
                  <button
                    type="button"
                    onClick={saveRecord}
                    className="bg-sky-500 hover:bg-sky-600 text-white transition-all ease-in-out px-5 py-2.5 space-x-1 text-sm rounded-xl"
                  >
                    <FontAwesomeIcon icon={faSave} />
                    <span>Simpan Jawaban</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </section>
        <section className="order-1 md:order-2 w-full md:w-3/12 bg-sky-700 shadow-md p-8 h-screen md:h-full md:rounded-3xl md:overflow-y-auto">
          <div className="flex flex-col gap-5">
            <div className="h-full  flex flex-col items-center gap-4">
              <img src={TrisaktiLogo} className="h-20" alt="Logo-Usakti" />
              <h5 className="w-full text-center font-bold text-md rounded-2xl py-2.5 text-white border-2 border-sky-600">
                {timeLeft}
              </h5>
            </div>
            {questions?.length > 0 && (
              <div className="h-full grid grid-cols-10 md:grid-cols-5 gap-2 overflow-y-auto">
                {questions?.map((question, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() =>
                      changeQuestion(
                        question?.number,
                        question?.package_question_id,
                        regNumber
                      )
                    }
                    className={`flex items-center justify-center w-10 h-10 rounded-xl border-2 font-bold transition-all ease-in-out ${question.answered ? "bg-emerald-500 text-white border-emerald-400" : "bg-gray-100 text-sky-800 hover:text-white hover:bg-sky-700 border-sky-600"}`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
            <div className="h-full">
              <button
                type="button"
                onClick={handleFinish}
                className="w-full block bg-red-500 hover:bg-red-600 py-2.5 rounded-xl text-white transition-all ease-in-out font-bold text-sm"
              >
                Selesai
              </button>
            </div>
            <div className="h-full">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="rounded-2xl"
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Assesment;
