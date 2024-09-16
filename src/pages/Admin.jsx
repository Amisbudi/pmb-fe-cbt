import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import TrisaktiLogo from '../assets/img/Logo-Usakti-White.png'
import { faBars, faQuestionCircle, faRankingStar, faTags, faUsers } from '@fortawesome/free-solid-svg-icons'
import PackageQuestions from '../components/PackageQuestions'
import Questions from '../components/Questions'
import Results from '../components/Results'

const Admin = () => {
  const [sidebar, setSidebar] = useState(true);
  const [page, setPage] = useState('packagequestions');

  const renderContent = () => {
    switch (page) {
      case 'packagequestions':
        return <PackageQuestions />;
      case 'questions':
        return <Questions />
      case 'results':
        return <Results />
      default:
        return <PackageQuestions />;
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pageParam = params.get('page') || 'packagequestions';
    setPage(pageParam);
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
                <a href={`/admin?page=questions`} className='block cursor-pointer text-gray-200 hover:text-gray-300 text-sm bg-gray-700 hover:bg-gray-900 py-4 px-5 rounded-xl transition-all ease-in-out'>
                  <p className='space-x-3'>
                    <FontAwesomeIcon icon={faQuestionCircle} />
                    <span>Questions</span>
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