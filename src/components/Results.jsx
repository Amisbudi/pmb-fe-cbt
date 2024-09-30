import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faEye, faPlusCircle, faSave, faTrashAlt, faXmark, faXmarkCircle } from '@fortawesome/free-solid-svg-icons'
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons'
import axios from 'axios'
import LoadingScreen from './LoadingScreen'

const Results = () => {
  const [results, setResults] = useState([]);
  const [paginations, setPaginations] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [limit, setLimit] = useState(0);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(true);

  const getData = async (page = 1) => {
    setLoading(true);
    await axios.get(`https://be-cbt.trisakti.ac.id/questionusers/results?page=${page}`,{
      headers: {
        'api-key': 'b4621b89b8b68387'
      }
    })
      .then((response) => {
        console.log(response.data);
        setResults(response.data.data);
        setCurrentPage(response.data.currentPage);
        setTotal(response.data.totalItems);
        setTotalPages(response.data.totalPages);
        setLimit(response.data.limit);
        const paginate = [];
        const maxButtons = 4;

        for (let i = 0; i < response.data.totalItems; i++) {
          if (i < 2) {
            paginate.push(
              <li key={i} className='hidden md:inline-block'>
                <button
                  type='button'
                  onClick={() => getData(i + 1)}
                  className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 transition-all ease-in-out"
                >
                  {i + 1}
                </button>
              </li>
            );
          }

          if (i === 2 && response.data.totalItems > maxButtons && response.data.totalPages > maxButtons) {
            paginate.push(
              <li key="dots" className='hidden md:inline-block'>
                <span className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300">...</span>
              </li>
            );
          }

          if (response.data.totalItems > 10) {
            if (i === response.data.totalItems - 1 && response.data.totalItems > maxButtons) {
              paginate.push(
                <li key={i} className='hidden md:inline-block'>
                  <button
                    type='button'
                    onClick={() => getData(response.data.totalPages)}
                    className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 transition-all ease-in-out"
                  >
                    {response.data.totalPages}
                  </button>
                </li>
              );
            }
          }

          if (response.data.totalItems <= maxButtons && i >= 2 && i < response.data.totalItems - 1) {
            paginate.push(
              <li key={i} className='hidden md:inline-block'>
                <button
                  type='button'
                  onClick={() => getData(i + 1)}
                  className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 transition-all ease-in-out"
                >
                  {i + 1}
                </button>
              </li>
            );
          }
        }
        setPaginations(paginate);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const handleDelete = async (data) => {
    if (confirm('Apakah yakin akan menghapus riwayat pengerjaan soal?')) {
      await axios.delete(`https://be-cbt.trisakti.ac.id/questionusers/results/${data.package_question_id}/${data.user_id}`,{
        headers: {
          'api-key': 'b4621b89b8b68387'
        }
      })
        .then((response) => {
          alert(response.data.message);
          getData();
        })
        .catch((error) => {
          console.log(error.message);
        })
    }
  }

  useEffect(() => {
    getData();
  }, []);
  return (
    loading ? (
      <LoadingScreen/>
    ) : (
      <main className='w-full md:w-10/12 h-screen bg-gray-100 pt-10 px-4 md:px-8 overflow-auto pb-10'>
      <div className='space-y-1'>
        <h2 className='font-bold text-xl text-gray-900'>Results</h2>
        <p className='text-sm text-gray-700'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic, cumque!</p>
      </div>
      <section className='mt-5'>
        <div className="overflow-x-auto border rounded-2xl">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr className='border-b'>
                <th scope="col" className="px-6 py-4 rounded-tl-xl">
                  No.
                </th>
                <th scope="col" className="px-6 py-4">
                  Nama Paket Soal
                </th>
                <th scope="col" className="px-6 py-4">
                  Betul
                </th>
                <th scope="col" className="px-6 py-4">
                  Salah
                </th>
                <th scope="col" className="px-6 py-4">
                  Nilai
                </th>
                <th scope="col" className="px-6 py-4">
                  User
                </th>
                <th scope="col" className="px-6 py-4 rounded-tr-xl">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {
                results.length > 0 ? (
                  results.map((result, index) =>
                    <tr key={index} className="odd:bg-white even:bg-gray-50 border-b">
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {limit * (currentPage - 1) + index + 1}
                      </th>
                      <td className="px-6 py-4">
                        {result.package_name}
                      </td>
                      <td className="px-6 py-4">
                        {result.correct_answers}
                      </td>
                      <td className="px-6 py-4">
                        {result.incorrect_answers}
                      </td>
                      <td className="px-6 py-4">
                        {((result.correct_answers / result.total_questions) * 100).toFixed()}
                      </td>
                      <td className="px-6 py-4">
                        {result.user_id}
                      </td>
                      <td className="px-6 py-4 flex flex-col md:flex-row gap-1">
                        <button type="button" onClick={() => handleDelete(result)} className="text-white bg-red-600 hover:bg-red-700 font-medium rounded-xl text-xs px-3 py-1.5 text-center">
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                      </td>
                    </tr>
                  )
                ) : (
                  <tr className="bg-white">
                    <td colSpan={7} className="px-6 py-4 text-center">
                      Data tidak ditemukan.
                    </td>
                  </tr>
                )
              }
            </tbody>
          </table>
          {
            total > limit &&
            <nav className="flex items-center flex-column flex-wrap md:flex-row justify-between p-5 bg-white">
              <span className="text-sm font-normal text-gray-500 mb-4 md:mb-0 block w-full md:inline md:w-auto">
                Saat ini terdapat <span className="font-bold text-gray-700">{total}</span> data.
              </span>
              <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                <li>
                  <button type='button' onClick={() => getData(currentPage - 1)} className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 transition-all ease-in-out">Previous</button>
                </li>
                {paginations}
                <li>
                  <button type='button' onClick={() => getData(totalPages == currentPage ? currentPage : currentPage + 1)} className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 transition-all ease-in-out">Next</button>
                </li>
              </ul>
            </nav>
          }
        </div>
      </section>
    </main>
    )
  )
}

export default Results