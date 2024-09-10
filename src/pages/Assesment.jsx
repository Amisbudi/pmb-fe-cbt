import { useRef, useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import TrisaktiLogo from "../assets/img/Logo-Usakti-White.png";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Assesment = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);

  const [questions, setQuestions] = useState([]);

  const [questionActive, setQuestionActive] = useState('');
  const [answersActive, setAnswersActive] = useState([]);
  const [record, setRecord] = useState(null);

  const [answered, setAnswered] = useState('');
  const [isAnswered, setIsAnswered] = useState('');

  const [indexQuestion, setIndexQuestion] = useState('');

  const [update, setUpdate] = useState(false);

  const capturePhoto = async () => {
    if (videoRef.current && videoRef.current.srcObject) {
      // Mendapatkan stream track video
      const track = videoRef.current.srcObject.getVideoTracks()[0];
      const imageCapture = new ImageCapture(track);

      // Mengambil snapshot menggunakan ImageCapture API
      const blob = await imageCapture.takePhoto();
      
      // Mengonversi blob menjadi data URL
      const imageDataURL = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      setCapturedImage(imageDataURL);
      console.log(imageDataURL);
    } else {
      console.log('tidak ada');
      
    }
  };

  const getQuestions = async () => {
    try {
      const activePackage = localStorage.getItem('CBT:package');
      if (activePackage) {
        const data = JSON.parse(activePackage)
        const responseQuestions = await axios.get(`https://sbpmb-express.amisbudi.cloud/questionusers/packagequestion/${data.package_question_id}/${data.user_id}`);
        setQuestions(responseQuestions.data)
        setQuestionActive(responseQuestions.data[0].question);
        setIndexQuestion(responseQuestions.data[0].id);
        getRecord(responseQuestions.data[0].question_id, responseQuestions.data[0].package_question_id);
        getAnswers(responseQuestions.data[0].question_id);
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const getRecord = async (question, pkg) => {
    await axios.get(`https://sbpmb-express.amisbudi.cloud/records/question/${question}/${pkg}`)
      .then((response) => {
        setAnswered(response.data.answer.name);
        setIsAnswered(true);
        setUpdate(true);
      })
      .catch((error) => {
        setAnswered('');
        setIsAnswered(false);
        setUpdate(false);
        console.log(error.message);
      });
  }

  const getAnswers = async (id) => {
    try {
      const responseAnwers = await axios.get(`https://sbpmb-express.amisbudi.cloud/answers/question/${id}`);
      setAnswersActive(responseAnwers.data);
    } catch (error) {
      console.log(error.message);
    }
  }

  const changeQuestion = async (id) => {
    try {
      const responseQuestions = await axios.get(`https://sbpmb-express.amisbudi.cloud/questionusers/${id}`);
      setQuestionActive(responseQuestions.data.question);
      getAnswers(responseQuestions.data.question_id);
      getRecord(responseQuestions.data.question_id, responseQuestions.data.package_question_id);
      setIndexQuestion(id);
    } catch (error) {
      console.log(error.message);
    }
  }

  const backQuestion = () => {
    if(indexQuestion > 1 &&  indexQuestion <= questions.length){
      changeQuestion(indexQuestion - 1)
      setIndexQuestion(null);
    }
  }

  const handleChange = async (e) => {
    const questionId = e.target.getAttribute("data-question");
    const packageQuestionId = e.target.getAttribute("data-package");
    const answerId = e.target.value;

    const data = {
      question_user_id: indexQuestion,
      question_id: questionId,
      package_question_id: packageQuestionId,
      answer_id: answerId,
      user_id: 1,
    }

    setRecord(data);
  }

  const saveRecord = async () => {
    try {
      // let buffer;
      // if (videoRef.current && videoRef.current.srcObject) {
      //   const track = videoRef.current.srcObject.getVideoTracks()[0];
      //   const imageCapture = new ImageCapture(track);
      //   const blob = await imageCapture.takePhoto();

      //   const imageDataURL = await new Promise((resolve, reject) => {
      //     const reader = new FileReader();
      //     reader.onloadend = () => resolve(reader.result);
      //     reader.onerror = reject;
      //     reader.readAsDataURL(blob);
      //   });
  
        // const arrayBuffer = await blob.arrayBuffer();
        
        // buffer = arrayBuffer;
        // buffer = imageDataURL;

      if (update) {
        const response = await axios.patch(`https://sbpmb-express.amisbudi.cloud/records/${record.question_id}/${record.package_question_id}`, {
          user_id: 1,
          answer_id: record.answer_id
        });
        console.log(response.data);
      } else {
        const response = await axios.post(`https://sbpmb-express.amisbudi.cloud/records`, {
          question_user_id: record.question_user_id,
          question_id: record.question_id,
          package_question_id: record.package_question_id,
          user_id: 1,
          answer_id: record.answer_id
        });
        console.log(response.data);
      }
      const nextPage = record.question_user_id + 1;
      if (nextPage <= questions.length) {
        changeQuestion(nextPage);
      } else {
        changeQuestion(1);
      }
      setIndexQuestion(null);
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          getQuestions();
        }
      } catch (error) {
        console.error('Error accessing the camera:', error);
      }
    };

    getQuestions();
    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);
  return (
    <main className='h-screen bg-gray-100 flex md:py-10'>
      <div className='w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center md:gap-5'>
        <section className='order-2 md:order-1 w-full md:w-9/12 bg-white shadow-md p-10 h-full md:rounded-3xl'>
          <div className='space-y-8'>
            <div className='space-y-2'>
              <p className='text-gray-900'>{questionActive.name}</p>
              {
                isAnswered &&
                <div className='inline-block bg-emerald-100 text-emerald-900 px-4 py-2.5 text-sm rounded-xl'>Anda sudah menjawab: <span className='font-medium'>{answered}</span></div>
              }
            </div>
            <div className='space-y-2'>
              {
                answersActive.length > 0 ? (
                  answersActive.map((answer, index) =>
                    <div key={index} className="flex items-center ps-4 border border-gray-200 hover:bg-gray-50 transition ease-in-out rounded-2xl">
                      <input id={`answer-${answer.id}`} name="answer" data-question={answer.question_id} data-package={answer.question.package_question_id} value={answer.id} onChange={handleChange} type="radio" className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded-2xl focus:ring-emerald-500" />
                      <label htmlFor={`answer-${answer.id}`} className="w-full py-4 ms-2 text-sm font-medium text-gray-900">{answer.name}</label>
                    </div>
                  )
                ) : (
                  <p>Tidak ada</p>
                )
              }
            </div>
            <div className='flex justify-center md:justify-start items-center gap-3'>
              <button type='button' onClick={backQuestion} className='bg-gray-100 hover:bg-gray-300 text-gray-400 transition-all ease-in-out w-10 h-10 rounded-full'>
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              <button type='button' onClick={saveRecord} className='bg-sky-500 hover:bg-sky-600 text-white transition-all ease-in-out w-10 h-10 rounded-full'>
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          </div>
        </section>
        <section className='order-1 md:order-2 w-full md:w-3/12 bg-sky-700 shadow-md p-8 h-full md:rounded-3xl'>
          <div className='flex flex-col gap-5'>
            <div className='h-full  flex flex-col items-center gap-4'>
              <img
                src={TrisaktiLogo}
                className="h-20"
                // className="h-12"
                alt="Logo-Usakti"
              />
              <h5 className='w-full text-center font-bold text-md rounded-2xl py-2.5 text-white border-2 border-sky-600'>00:30:32</h5>
            </div>
            {
              questions.length > 0 ? (
                <div className='h-full grid grid-cols-10 md:grid-cols-5 gap-2 overflow-y-auto'>
                  {
                    questions.map((question, index) =>
                      <button key={index} type='button' onClick={() => changeQuestion(question.id)} className="flex items-center justify-center w-10 h-10 rounded-xl border-2 font-bold transition-all ease-in-out bg-gray-100 text-sky-800 hover:text-white hover:bg-sky-700 border-sky-600">{index + 1}</button>
                    )
                  }
                </div>
              ) : (
                <p className="text-center text-sm">Belum ada soal</p>
              )
            }
            <div className='h-full'>
              <button type='button' className='w-full block bg-red-500 hover:bg-red-600 py-2.5 rounded-xl text-white transition-all ease-in-out font-bold text-sm'>Selesai</button>
            </div>
            <div className='h-full'>
              <video ref={videoRef} autoPlay playsInline className='rounded-2xl' />
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default Assesment