import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import TrisaktiLogo from '../assets/img/Logo-Usakti-White.png'
import { faBars, faCamera, faQuestionCircle, faRankingStar, faSignOut, faTags, faUserCircle, faLayerGroup } from '@fortawesome/free-solid-svg-icons'
import PackageQuestions from '../components/PackageQuestions'
import QuestionssGroup from '../components/QuestionsGroup'
import Questions from '../components/Questions'
import Results from '../components/Results'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import RequestCamera from '../components/RequestCamera'

const Admin = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('loading...');
  const [sidebar, setSidebar] = useState(true);
  const [page, setPage] = useState('packagequestions');

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

      const response = await axios.get('https://api.trisakti.ac.id/issueprofile', {
        headers: {
          Authorization: `Bearer ${authData.token}`
        }
      });
      setName(response.data.fullname);
      const decoded = jwtDecode(authData.token);
      if (decoded.scopes[0] == 'admission-participant') {
        navigate('/dashboard');
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const renderContent = () => {
    switch (page) {
      case 'packagequestions':
        return <PackageQuestions />;
      case 'questions':
        return <Questions />;
      case 'camera':
        return <RequestCamera />;
      case 'group-questions':
        return <QuestionssGroup />
      case 'results':
        return <Results />;
      default:
        return <PackageQuestions />;
    }
  };

  const handleLogout = () => {
    if (window.confirm('Apakah anda yakin akan keluar?')) {
      const token = localStorage.getItem('CBTtrisakti:token');
      if (!token) {
        alert('Mohon maaf, token tidak valid!');
      } else {
        localStorage.removeItem('CBTtrisakti:token');
        navigate('/')
      }
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pageParam = params.get('page') || 'packagequestions';
    setPage(pageParam);
    
    getInfo();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='relative flex'>
      {
        sidebar && (
          <aside className='absolute md:relative flex flex-col items-center justify-between w-full md:w-2/12 bg-gray-800 h-screen px-5'>
            <div className='w-full flex flex-col justify-center items-center'>
              <a href='#' className='w-full block space-y-3 pt-5'>
                <img src={TrisaktiLogo} alt="Logo Trisakti" className='w-24 mx-auto' />
                <h2 className='text-center font-bold text-white'>Computer-Based Test</h2>
              </a>
              <ul className='w-full mt-6 space-y-2'>
                <a href={`/admin?page=packagequestions`} className='block w-full cursor-pointer text-gray-200 hover:text-gray-300 text-sm bg-gray-700 hover:bg-gray-900 py-4 px-5 rounded-xl transition-all ease-in-out'>
                  <p className='space-x-3'>
                    <FontAwesomeIcon icon={faTags} />
                    <span>Package Questions</span>
                  </p>
                </a>
                <a href={`/admin?page=group-questions`} className='block cursor-pointer text-gray-200 hover:text-gray-300 text-sm bg-gray-700 hover:bg-gray-900 py-4 px-5 rounded-xl transition-all ease-in-out'>
                  <p className='space-x-3'>
                    <FontAwesomeIcon icon={faLayerGroup} />
                    <span>Group Questions</span>
                  </p>
                </a>
                <a href={`/admin?page=questions`} className='block cursor-pointer text-gray-200 hover:text-gray-300 text-sm bg-gray-700 hover:bg-gray-900 py-4 px-5 rounded-xl transition-all ease-in-out'>
                  <p className='space-x-3'>
                    <FontAwesomeIcon icon={faQuestionCircle} />
                    <span>Questions</span>
                  </p>
                </a>
                <a href={`/admin?page=camera`} className='block cursor-pointer text-gray-200 hover:text-gray-300 text-sm bg-gray-700 hover:bg-gray-900 py-4 px-5 rounded-xl transition-all ease-in-out'>
                  <p className='space-x-3'>
                    <FontAwesomeIcon icon={faCamera} />
                    <span>Camera Requests</span>
                  </p>
                </a>
                <a href={`/admin?page=results`} className='block cursor-pointer text-gray-200 hover:text-gray-300 text-sm bg-gray-700 hover:bg-gray-900 py-4 px-5 rounded-xl transition-all ease-in-out'>
                  <p className='space-x-3'>
                    <FontAwesomeIcon icon={faRankingStar} />
                    <span>Results</span>
                  </p>
                </a>
              </ul>
            </div>
            <div className='w-full space-y-4'>
              <h2 className="text-white space-x-2 text-center">
                <FontAwesomeIcon icon={faUserCircle} />
                <span className='font-medium'>{name}</span>
              </h2>
              <button type='button' onClick={handleLogout} className='w-full block bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl text-sm space-x-1'>
                <FontAwesomeIcon icon={faSignOut} />
                <span>Keluar</span>
              </button>
            </div>
            <p className='text-center text-xs py-3 text-gray-400'>© 2023 Universitas Trisakti</p>
          </aside>
        )
      }
      <button type='button' onClick={() => setSidebar(!sidebar)} className='block md:hidden absolute text-center right-5 top-5'>
        <FontAwesomeIcon icon={faBars} className='text-gray-300 hover:text-gray-400 transition-all ease-in-out' size='xl' />
      </button>
      {renderContent()}
    </div>
  )
}

export default Admin