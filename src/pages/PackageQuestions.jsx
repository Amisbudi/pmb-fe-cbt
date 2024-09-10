import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import TrisaktiLogo from '../assets/img/Logo-Usakti-White.png'
import { faChevronCircleLeft, faPlusCircle, faSave, faTags, faTrashAlt, faXmark, faXmarkCircle } from '@fortawesome/free-solid-svg-icons'
import { faCheckCircle, faCircleQuestion, faUserCircle } from '@fortawesome/free-regular-svg-icons'
import axios from 'axios'

const PackageQuestions = () => {
  const [createModal, setCreateModal] = useState(false);
  const [data, setData] = useState([]);

  const [formData, setFormData] = useState({
    type_id: '',
    name: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getData = async () => {
    await axios.get(`http://localhost:3000/packagequestions`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  const handleSave = async (e) => {
    e.preventDefault();
    await axios.post(`http://localhost:3000/packagequestions`, {
      type_id: formData.type_id,
      name: formData.name,
      status: true,
    })
    .then((response) => {
      alert(response.data.message);
      setCreateModal(false);
      getData();
    })
    .catch((error) => {
      console.log(error.message);
    });
  }

  const handleDelete = async (id) => {
    if(confirm('Apakah yakin akan menghapus paket soal?')){
      await axios.delete(`http://localhost:3000/packagequestions/${id}`)
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
    <div className='relative flex'>
      <aside className='absolute md:relative flex flex-col items-center justify-between w-full md:w-2/12 bg-gray-800 h-screen px-5'>
        <div className='w-full flex flex-col justify-center items-center'>
          <a href='#' className='w-full block space-y-3 pt-5'>
            <img src={TrisaktiLogo} alt="Logo Trisakti" className='w-24 mx-auto' />
            <h2 className='text-center font-bold text-white'>Computer-Based Test</h2>
          </a>
          <ul className='w-full mt-6 space-y-2'>
            <li className='w-full cursor-pointer text-gray-200 hover:text-gray-300 text-sm bg-gray-700 hover:bg-gray-900 py-4 px-5 rounded-xl transition-all ease-in-out'>
              <button type='button' className='space-x-3'>
                <FontAwesomeIcon icon={faTags} />
                <span>Package Questions</span>
              </button>
            </li>
            <li className='cursor-pointer text-gray-200 hover:text-gray-300 text-sm bg-gray-700 hover:bg-gray-900 py-4 px-5 rounded-xl transition-all ease-in-out'>
              <button type='button' className='space-x-3'>
                <FontAwesomeIcon icon={faCircleQuestion} />
                <span>Questions</span>
              </button>
            </li>
            <li className='cursor-pointer text-gray-200 hover:text-gray-300 text-sm bg-gray-700 hover:bg-gray-900 py-4 px-5 rounded-xl transition-all ease-in-out'>
              <button type='button' className='space-x-3'>
                <FontAwesomeIcon icon={faUserCircle} />
                <span>Questions</span>
              </button>
            </li>
          </ul>
          <button type='button' className='text-center mt-10'>
            <FontAwesomeIcon icon={faChevronCircleLeft} className='text-gray-300 hover:text-gray-400' size='xl' />
          </button>
        </div>
        <p className='text-center text-xs py-3 text-gray-400'>© 2023 Universitas Trisakti</p>
      </aside>
      <main className='w-full md:w-10/12 h-screen bg-gray-100 p-8'>
        <div className='space-y-1'>
          <h2 className='font-bold text-xl text-gray-900'>Package Questions</h2>
          <p className='text-sm text-gray-700'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic, cumque!</p>
        </div>
        <section className='mt-8'>
          <button type="button" onClick={() => setCreateModal(!createModal)} className="text-white bg-sky-700 hover:bg-sky-800 font-medium rounded-xl text-sm px-5 py-2.5 space-x-2 mb-5 text-center">
            <FontAwesomeIcon icon={faPlusCircle} />
            <span>Tambah</span>
          </button>
          <div className="overflow-x-auto">
            <table className="w-full shadow-xl text-sm text-left rtl:text-right text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-white">
                <tr className='border-b'>
                  <th scope="col" className="px-6 py-4 rounded-tl-xl">
                    No.
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Nama Paket Soal
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Tipe
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-4 rounded-tr-xl">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {
                  data.length > 0 ? (
                    data.map((content, index) =>
                      <tr key={index} className="bg-white">
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                          {index + 1}
                        </th>
                        <td className="px-6 py-4">
                          {content.name}
                        </td>
                        <td className="px-6 py-4">
                          {content.type.name}
                        </td>
                        <td className="px-6 py-4">
                          {content.status ? <FontAwesomeIcon icon={faCheckCircle} className='text-emerald-600' /> : <FontAwesomeIcon icon={faXmarkCircle} className='text-red-600' />}
                        </td>
                        <td className="px-6 py-4">
                          <button type="button" onClick={() => handleDelete(content.id)} className="text-white bg-red-600 hover:bg-red-700 font-medium rounded-lg text-sm px-3 py-1.5 text-center">
                            <FontAwesomeIcon icon={faTrashAlt} />
                          </button>
                        </td>
                      </tr>
                    )
                  ) : (
                    <tr className="bg-white">
                      <td colSpan={6} className="px-6 py-4">
                        Data tidak ditemukan.
                      </td>
                    </tr>
                  )
                }
              </tbody>
            </table>
          </div>
        </section >
      </main >

      {
        createModal &&
        <div tabIndex={-1} className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-2xl shadow">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                <h3 className="text-lg font-semibold text-gray-900">
                  Tambah Paket Soal
                </h3>
                <button type="button" onClick={() => setCreateModal(!createModal)} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-xl text-sm w-8 h-8 ms-auto inline-flex justify-center items-center">
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </div>
              <form onSubmit={handleSave} className="p-4 md:p-5">
                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-span-2">
                    <label htmlFor="type_id" className="block mb-2 text-sm font-medium text-gray-900">Tipe Soal</label>
                    <select name="type_id" onChange={handleChange} id="type_id" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5">
                      <option>Pilih</option>
                      <option value="1">TPA</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Nama Paket Soal</label>
                    <input type="text" name="name" id="name" onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="Type of package name" required />
                  </div>
                </div>
                <button type="submit" className="text-white inline-flex items-center bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-xl space-x-2 text-sm px-5 py-2.5 text-center">
                  <FontAwesomeIcon icon={faSave} />
                  <span>Simpan</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      }

    </div >
  )
}

export default PackageQuestions