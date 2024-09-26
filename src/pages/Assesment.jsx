import { useRef, useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import TrisaktiLogo from "../assets/img/Logo-Usakti-White.png";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

const Assesment = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const [timeLeft, setTimeLeft] = useState('00:00:00');
  const [scheduleTime, setScheduleTime] = useState(null);

  const [identityNumber, setIdentityNumber] = useState('');

  const [loading, setLoading] = useState(false);

  const [questions, setQuestions] = useState([]);

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [questionActive, setQuestionActive] = useState('');
  const [answersActive, setAnswersActive] = useState([]);
  const [record, setRecord] = useState(null);

  const [answered, setAnswered] = useState('');
  const [isAnswered, setIsAnswered] = useState('');

  const [indexQuestion, setIndexQuestion] = useState('');

  const [update, setUpdate] = useState(false);

  const getQuestions = async () => {
    setLoading(true);
    try {
      const activePackage = localStorage.getItem('CBT:package');
      if (activePackage) {
        const data = JSON.parse(activePackage)
        const responseQuestions = await axios.get(`http://localhost:3000/questionusers/packagequestion/${data.package_question_id}/${data.user_id}`);
        setQuestions(responseQuestions.data)
        setQuestionActive(responseQuestions.data[0].question);
        setIndexQuestion(responseQuestions.data[0].number);
        setScheduleTime(new Date(responseQuestions.data[0].date_end));
        getRecord(responseQuestions.data[0].question_id, responseQuestions.data[0].package_question_id);
        getAnswers(responseQuestions.data[0].question_id);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.log(error);
    }
  }

  const updateQuestions = async () => {
    try {
      const activePackage = localStorage.getItem('CBT:package');
      if (activePackage) {
        const data = JSON.parse(activePackage)
        const responseQuestions = await axios.get(`http://localhost:3000/questionusers/packagequestion/${data.package_question_id}/${data.user_id}`);
        setQuestions(responseQuestions.data)
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getRecord = async (question, pkg) => {
    await axios.get(`http://localhost:3000/records/question/${question}/${pkg}`)
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
      const responseAnwers = await axios.get(`http://localhost:3000/answers/question/${id}`);
      setAnswersActive(responseAnwers.data);
    } catch (error) {
      console.log(error.message);
    }
  }

  const changeQuestion = async (id, packageQuestion) => {
    try {
      const responseQuestions = await axios.get(`http://localhost:3000/questionusers/${id}/${packageQuestion}`);
      setQuestionActive(responseQuestions.data.question);
      getAnswers(responseQuestions.data.question_id);
      getRecord(responseQuestions.data.question_id, responseQuestions.data.package_question_id);
      setIndexQuestion(id);
    } catch (error) {
      console.log(error.message);
    }
  }

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
    }
    setSelectedAnswer(event.target.value);
    setRecord(data);
  }

  const saveRecord = async () => {
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
          const response = await axios.patch(`http://localhost:3000/records/${record.question_id}/${record.package_question_id}`, {
            user_id: 1,
            answer_id: record.answer_id,
            photo: imageDataURL,
          });
          if (response.data) {
            setTimeout(() => {
              setLoading(false);
            }, 500);
          }
        } else {
          const response = await axios.post(`http://localhost:3000/records`, {
            question_user_id: record.question_user_id,
            question_id: record.question_id,
            package_question_id: record.package_question_id,
            user_id: identityNumber,
            answer_id: record.answer_id,
            photo: imageDataURL,
          });
          if (response.data) {
            setTimeout(() => {
              setLoading(false);
            }, 500);
          }
        }
        const nextPage = record.number + 1;
        if (nextPage <= questions.length) {
          changeQuestion(nextPage, record.package_question_id);
        } else {
          changeQuestion(1, record.package_question_id);
        }
        setIndexQuestion(null);
        setSelectedAnswer(null);
        updateQuestions();
      } else {
        alert('Kamera tidak aktif!');
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleFinish = () => {
    if (window.confirm('Apakah anda yakin akan menyelesaikan tes ini?')) {
      localStorage.removeItem('CBT:package');
      navigate('/dashboard');
    }
  }

  useEffect(() => {
    const getInfo = async () => {
      try {
        const token = localStorage.getItem('CBTtrisakti:token');
        if (!token) {
          navigate('/');
          throw new Error('Token tidak ditemukan');
        }
        const authData = JSON.parse(token);
        const currentTime = Math.floor(Date.now() / 1000);
        const tokenReceivedTime = authData.received;
        const expiredTime = authData.expired;

        if (currentTime - tokenReceivedTime >= expiredTime) {
          alert('Mohon maaf, sesi telah habis!');
          localStorage.removeItem('CBTtrisakti:token');
          navigate('/');
          throw new Error('Token sudah kedaluwarsa');
        }
        const response = await axios.get('https://dev-gateway.trisakti.ac.id/d3b1b0f38e11d357db8a6ae20b09ff23?username=haisyammaulana22@gmail.com', {
          headers: {
            Authorization: `Bearer ${authData.token}`
          }
        });
        setIdentityNumber(response.data.identify_number);
        const decoded = jwtDecode(token);
        if (decoded.scopes[0] == 'admission-admin') {
          return navigate('/admin');
        }
      } catch (error) {
        console.log(error.message);
      }
    }

    getInfo();

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

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
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
        localStorage.removeItem('CBT:package');
        alert("Waktu anda telah habis!");
        navigate('/dashboard');
      } else {
        const hours = Math.floor(timeDiff / (1000 * 60 * 60)).toString().padStart(2, '0');
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000).toString().padStart(2, '0');
        setTimeLeft(`${hours}:${minutes}:${seconds}`);
      }
    }, 1000);

    return () => clearInterval(countdown);
  }, [scheduleTime]);

  return (
    <main className='h-screen bg-gray-100 flex md:py-10'>
      <div className='w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center md:gap-5'>
        <section className='order-2 md:order-1 w-full md:w-9/12 bg-white shadow-md p-10 h-screen md:h-full md:rounded-3xl md:overflow-y-auto'>
          <div className='space-y-8'>
            <div className='space-y-3'>
              {
                questionActive.image &&
                <img
                  src={`http://localhost:3000/questions/image/${questionActive.id}`}
                  alt="Question Image"
                  className='w-64 rounded-xl'
                />
              }
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
                    <div key={index} className="flex items-center p-4 border border-gray-200 hover:bg-gray-50 transition ease-in-out rounded-2xl">
                      <input id={`answer-${answer.id}`} name="answer" data-question={answer.question_id} data-package={answer.question.package_question_id} value={answer.id} onChange={handleChange} type="radio" className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded-2xl focus:ring-emerald-500" checked={selectedAnswer === answer.id.toString()} />
                      <label htmlFor={`answer-${answer.id}`} className="w-full py-4 ms-2 text-sm font-medium text-gray-900">{answer.name}</label>
                      {
                        answer.image &&
                        <img
                          src={`http://localhost:3000/answers/image/${answer.id}`}
                          alt="Answer Image"
                          className='w-36 rounded-xl'
                        />
                      }
                    </div>
                  )
                ) : (
                  <div>
                    <h4 className='text-lg text-red-500 font-bold'>Peringatan!</h4>
                    <p className='text-gray-600 text-sm'>Maka ujian untuk sementara tidak bisa dilanjutkan. Silahkan aktifkan kamera atau minta izin ke panitia tes seleksi masuk.</p>
                  </div>
                )
              }
            </div>
            {
              !loading &&
              <div className='flex justify-center md:justify-start items-center gap-3'>
                {
                  questions.length > 0 &&
                  <button type='button' onClick={saveRecord} className='bg-sky-500 hover:bg-sky-600 text-white transition-all ease-in-out px-5 py-2.5 space-x-1 text-sm rounded-xl'>
                    <FontAwesomeIcon icon={faSave} />
                    <span>Simpan Jawaban</span>
                  </button>
                }
              </div>
            }
          </div>
        </section>
        <section className='order-1 md:order-2 w-full md:w-3/12 bg-sky-700 shadow-md p-8 h-screen md:h-full md:rounded-3xl md:overflow-y-auto'>
          <div className='flex flex-col gap-5'>
            <div className='h-full  flex flex-col items-center gap-4'>
              <img
                src={TrisaktiLogo}
                className="h-20"
                alt="Logo-Usakti"
              />
              <h5 className='w-full text-center font-bold text-md rounded-2xl py-2.5 text-white border-2 border-sky-600'>{timeLeft}</h5>
            </div>
            {
              questions.length > 0 && (
                <div className='h-full grid grid-cols-10 md:grid-cols-5 gap-2 overflow-y-auto'>
                  {
                    questions.map((question, index) =>
                      <button key={index} type='button' onClick={() => changeQuestion(question.number, question.package_question_id)} className={`flex items-center justify-center w-10 h-10 rounded-xl border-2 font-bold transition-all ease-in-out ${question.answered ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-gray-100 text-sky-800 hover:text-white hover:bg-sky-700 border-sky-600'}`}>{index + 1}</button>
                    )
                  }
                </div>
              )
            }
            <div className='h-full'>
              <button type='button' onClick={handleFinish} className='w-full block bg-red-500 hover:bg-red-600 py-2.5 rounded-xl text-white transition-all ease-in-out font-bold text-sm'>Selesai</button>
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