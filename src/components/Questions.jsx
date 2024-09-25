import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faKey, faPlusCircle, faSave, faTrashAlt, faUpload, faXmark, faXmarkCircle } from '@fortawesome/free-solid-svg-icons'
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons'
import axios from 'axios'
import LoadingScreen from './LoadingScreen'
import ExampleImportQuestion from '../assets/example-import-questions.xlsx'

const Questions = () => {
  const [createModal, setCreateModal] = useState(false);
  const [importModal, setImportModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [packageQuestions, setPackageQuestions] = useState([]);
  const [paginations, setPaginations] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [limit, setLimit] = useState(0);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    id: '',
    package_question_id: '',
    name: '',
    image: '',
    status: false,
    answer_1: '',
    answer_1_id: null,
    answer_1_status: false,
    answer_2: '',
    answer_2_id: null,
    answer_2_status: false,
    answer_3: '',
    answer_3_id: null,
    answer_3_status: false,
    answer_4: '',
    answer_4_id: null,
    answer_4_status: false,
    excel: ''
  });

  const getData = async (page = 1) => {
    setLoading(true);
    await axios.get(`https://sbpmb-express.amisbudi.cloud/questions?page=${page}`)
      .then((response) => {
        setQuestions(response.data.data);
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
        console.log(error.message);
      });
  }

  const getPackageQuestions = async () => {
    await axios.get(`https://sbpmb-express.amisbudi.cloud/packagequestions`)
      .then((response) => {
        setPackageQuestions(response.data.data);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  const handleChange = (e) => {
    if (e.target.name === 'excel' && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          excel: reader.result,
        });
      };
      reader.readAsDataURL(file);
    } else if (e.target.name === 'image' && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          image: reader.result,
        });
      };
      reader.readAsDataURL(file);
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleEdit = async (content) => {
    await axios.get(`https://sbpmb-express.amisbudi.cloud/answers/question/${content.id}`)
      .then((response) => {
        setFormData({
          id: content.id,
          package_question_id: content.package_question_id,
          name: content.name,
          image: content.image,
          status: content.status,
          answer_1: response.data[0].name,
          answer_1_id: response.data[0].id,
          answer_1_status: response.data[0].is_right.toString(),
          answer_2: response.data[1].name,
          answer_2_id: response.data[1].id,
          answer_2_status: response.data[1].is_right.toString(),
          answer_3: response.data[2].name,
          answer_3_id: response.data[2].id,
          answer_3_status: response.data[2].is_right.toString(),
          answer_4: response.data[3].name,
          answer_4_id: response.data[3].id,
          answer_4_status: response.data[3].is_right.toString(),
        });
        setEditModal(true);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  const handleImport = async (e) => {
    // setLoading(true);
    e.preventDefault();
    await axios.post(`https://sbpmb-express.amisbudi.cloud/questions/import`, {
      package_question_id: formData.package_question_id,
      excel: formData.excel,
    })
      .then((response) => {
        alert(response.data.message);
        setImportModal(false);
        getData();
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      })
      .catch((error) => {
        console.log(error.message);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      });
  }

  const handleSave = async (e) => {
    setLoading(true);
    e.preventDefault();
    await axios.post(`https://sbpmb-express.amisbudi.cloud/questions`, {
      package_question_id: formData.package_question_id,
      name: formData.name,
      image: formData.image,
      status: true,
      answer_1: formData.answer_1,
      answer_1_status: formData.answer_1_status,
      answer_2: formData.answer_2,
      answer_2_status: formData.answer_2_status,
      answer_3: formData.answer_3,
      answer_3_status: formData.answer_3_status,
      answer_4: formData.answer_4,
      answer_4_status: formData.answer_4_status,
    })
      .then((response) => {
        alert(response.data.message);
        setCreateModal(false);
        getData();
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      })
      .catch((error) => {
        console.log(error.message);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      });
  }

  const handleUpdate = async (e) => {
    setLoading(true);
    e.preventDefault();
    await axios.patch(`https://sbpmb-express.amisbudi.cloud/questions/${formData.id}`, {
      package_question_id: formData.package_question_id,
      name: formData.name,
      image: formData.image,
      status: formData.status,
      answer_1: formData.answer_1,
      answer_1_id: formData.answer_1_id,
      answer_1_status: formData.answer_1_status,
      answer_2: formData.answer_2,
      answer_2_id: formData.answer_2_id,
      answer_2_status: formData.answer_2_status,
      answer_3: formData.answer_3,
      answer_3_id: formData.answer_3_id,
      answer_3_status: formData.answer_3_status,
      answer_4: formData.answer_4,
      answer_4_id: formData.answer_4_id,
      answer_4_status: formData.answer_4_status,
    })
      .then((response) => {
        alert(response.data.message);
        setEditModal(false);
        getData();
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          alert(error.response.data.message);
        } else {
          console.log(error);
        }
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      });
  }

  const handleDelete = async (id) => {
    if (confirm('Apakah yakin akan menghapus paket soal?')) {
      await axios.delete(`https://sbpmb-express.amisbudi.cloud/questions/${id}`)
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
    getPackageQuestions();
    getData();
  }, []);
  return (
    loading ? (
      <LoadingScreen />
    ) : (
      <main className='w-full md:w-10/12 h-screen bg-gray-100 pt-10 px-4 md:px-8 overflow-auto pb-10'>
        <div className='space-y-1'>
          <h2 className='font-bold text-xl text-gray-900'>Questions</h2>
          <p className='text-sm text-gray-700'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic, cumque!</p>
        </div>
        <section className='mt-5'>
          <div className='flex items-center justify-between'>
            <button type="button" onClick={() => setCreateModal(!createModal)} className="text-white bg-sky-700 hover:bg-sky-800 font-medium rounded-xl text-sm px-5 py-2.5 space-x-2 mb-5 text-center">
              <FontAwesomeIcon icon={faPlusCircle} />
              <span>Tambah</span>
            </button>
            <button type="button" onClick={() => setImportModal(!importModal)} className="text-white bg-sky-700 hover:bg-sky-800 font-medium rounded-xl text-sm px-5 py-2.5 space-x-2 mb-5 text-center">
              <FontAwesomeIcon icon={faUpload} />
              <span>Import</span>
            </button>
          </div>
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
                    Gambar
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
                  questions.length > 0 ? (
                    questions.map((question, index) =>
                      <tr key={index} className="odd:bg-white even:bg-gray-50 border-b">
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                          {limit * (currentPage - 1) + index + 1}
                        </th>
                        <td className="px-6 py-4">
                          {question.name}
                        </td>
                        <td className="px-6 py-4">
                          {
                            question.image ? (
                              <img
                                src={`https://sbpmb-express.amisbudi.cloud/questions/image/${question.id}`}
                                alt="Question Image"
                                className='w-32 rounded-xl'
                              />
                            ) : (
                              <span>Tidak ada gambar</span>
                            )
                          }
                        </td>
                        <td className="px-6 py-4">
                          {question.package.name}
                        </td>
                        <td className="px-6 py-4">
                          {question.status ? <FontAwesomeIcon icon={faCheckCircle} className='text-emerald-600' /> : <FontAwesomeIcon icon={faXmarkCircle} className='text-red-600' />}
                        </td>
                        <td className="px-6 py-4 flex flex-col md:flex-row gap-1">
                          <button type="button" onClick={() => handleEdit(question)} className="text-white bg-amber-500 hover:bg-amber-600 font-medium rounded-xl text-xs px-3 py-1.5 text-center">
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button type="button" onClick={() => handleDelete(question.id)} className="text-white bg-red-600 hover:bg-red-700 font-medium rounded-xl text-xs px-3 py-1.5 text-center">
                            <FontAwesomeIcon icon={faTrashAlt} />
                          </button>
                        </td>
                      </tr>
                    )
                  ) : (
                    <tr className="bg-white">
                      <td colSpan={6} className="px-6 py-4 text-center">
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
        {
          createModal &&
          <div tabIndex={-1} className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
            <div className="relative p-4 w-full max-w-lg max-h-full">
              <div className="relative bg-white rounded-2xl shadow">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Tambah Soal
                  </h3>
                  <button type="button" onClick={() => setCreateModal(!createModal)} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-xl text-sm w-8 h-8 ms-auto inline-flex justify-center items-center">
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                </div>
                <form onSubmit={handleSave} encType="multipart/form-data" className="p-4 md:p-5">
                  <div className="grid gap-4 mb-4 grid-cols-2">
                    <div className="col-span-2">
                      <label htmlFor="package_question_id" className="block mb-2 text-sm font-medium text-gray-900">Paket Soal</label>
                      <select name="package_question_id" onChange={handleChange} id="package_question_id" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5">
                        <option value="">Pilih</option>
                        {
                          packageQuestions.length > 0 &&
                          packageQuestions.map((packageQuestion, index) =>
                            <option value={packageQuestion.id} key={index}>{packageQuestion.name}</option>
                          )
                        }
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label htmlFor="image" className="block mb-2 text-sm font-medium text-gray-900">Gambar</label>
                      <input type='file' name="image" id="image" onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" />
                    </div>
                    <div className="col-span-2">
                      <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Soal</label>
                      <textarea name="name" id="name" onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="Questions" required></textarea>
                    </div>
                  </div>
                  <hr className='my-3' />
                  <div className="grid gap-4 mb-5 grid-cols-2">
                    <div>
                      <label htmlFor="answer_1" className="block mb-2 text-sm font-medium text-gray-900">Jawaban A</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                          <FontAwesomeIcon icon={faKey} className='text-gray-300 text-sm' />
                        </div>
                        <input type="text" name="answer_1" id="answer_1" onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5" placeholder="Jawaban A" required />
                      </div>
                      <div className="flex mt-2 ml-2">
                        <div className="flex items-center me-4">
                          <input id="answer_1_true" name="answer_1" type="radio" defaultValue={true} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500" />
                          <label htmlFor="answer_1_true" className="ms-2 text-xs font-medium text-gray-700">Benar</label>
                        </div>
                        <div className="flex items-center me-4">
                          <input id="answer_1_false" name="answer_1" type="radio" defaultValue={false} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500" />
                          <label htmlFor="answer_1_false" className="ms-2 text-xs font-medium text-gray-700">Salah</label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="answer_2" className="block mb-2 text-sm font-medium text-gray-900">Jawaban B</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                          <FontAwesomeIcon icon={faKey} className='text-gray-300 text-sm' />
                        </div>
                        <input type="text" name="answer_2" id="answer_2" onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5" placeholder="Jawaban B" required />
                      </div>
                      <div className="flex mt-2 ml-2">
                        <div className="flex items-center me-4">
                          <input id="answer_2_true" name="answer_2" type="radio" defaultValue={true} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500" />
                          <label htmlFor="answer_2_true" className="ms-2 text-xs font-medium text-gray-700">Benar</label>
                        </div>
                        <div className="flex items-center me-4">
                          <input id="answer_2_false" name="answer_2" type="radio" defaultValue={false} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500" />
                          <label htmlFor="answer_2_false" className="ms-2 text-xs font-medium text-gray-700">Salah</label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="answer_3" className="block mb-2 text-sm font-medium text-gray-900">Jawaban C</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                          <FontAwesomeIcon icon={faKey} className='text-gray-300 text-sm' />
                        </div>
                        <input type="text" name="answer_3" id="answer_3" onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5" placeholder="Jawaban B" required />
                      </div>
                      <div className="flex mt-2 ml-2">
                        <div className="flex items-center me-4">
                          <input id="answer_3_true" name="answer_3" type="radio" defaultValue={true} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500" />
                          <label htmlFor="answer_3_true" className="ms-2 text-xs font-medium text-gray-700">Benar</label>
                        </div>
                        <div className="flex items-center me-4">
                          <input id="answer_3_false" name="answer_3" type="radio" defaultValue={false} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500" />
                          <label htmlFor="answer_3_false" className="ms-2 text-xs font-medium text-gray-700">Salah</label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="answer_4" className="block mb-2 text-sm font-medium text-gray-900">Jawaban D</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                          <FontAwesomeIcon icon={faKey} className='text-gray-300 text-sm' />
                        </div>
                        <input type="text" name="answer_4" id="answer_4" onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5" placeholder="Jawaban B" required />
                      </div>
                      <div className="flex mt-2 ml-2">
                        <div className="flex items-center me-4">
                          <input id="answer_4_true" name="answer_4" type="radio" defaultValue={true} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500" />
                          <label htmlFor="answer_4_true" className="ms-2 text-xs font-medium text-gray-700">Benar</label>
                        </div>
                        <div className="flex items-center me-4">
                          <input id="answer_4_false" name="answer_4" type="radio" defaultValue={false} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500" />
                          <label htmlFor="answer_4_false" className="ms-2 text-xs font-medium text-gray-700">Salah</label>
                        </div>
                      </div>
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

        {
          editModal &&
          <div tabIndex={-1} className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
            <div className="relative p-4 w-full max-w-lg max-h-full">
              <div className="relative bg-white rounded-2xl shadow">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Edit Soal
                  </h3>
                  <button type="button" onClick={() => setEditModal(!editModal)} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-xl text-sm w-8 h-8 ms-auto inline-flex justify-center items-center">
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                </div>
                <form onSubmit={handleUpdate} encType="multipart/form-data" className="p-4 md:p-5">
                  <div className="grid gap-4 mb-5 grid-cols-2">
                    <div className="col-span-2">
                      <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Soal</label>
                      <textarea name="name" id="name" value={formData.name} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="Questions" required></textarea>
                    </div>
                    <div className="col-span-2">
                      <label htmlFor="image" className="block mb-2 text-sm font-medium text-gray-900">Gambar</label>
                      <input type='file' name="image" id="image" onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" />
                    </div>
                    <div className="col-span-1">
                      <label htmlFor="package_question_id" className="block mb-2 text-sm font-medium text-gray-900">Paket Soal</label>
                      <select name="package_question_id" value={formData.package_question_id} onChange={handleChange} id="package_question_id" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5">
                        {
                          packageQuestions.length > 0 &&
                          packageQuestions.map((packageQuestion, index) =>
                            <option value={packageQuestion.id} key={index}>{packageQuestion.name}</option>
                          )
                        }
                      </select>
                    </div>
                    <div className="col-span-1">
                      <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-900">Status</label>
                      <select name="status" value={formData.status} onChange={handleChange} id="status" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5">
                        <option value="true">Aktif</option>
                        <option value="false">Tidak aktif</option>
                      </select>
                    </div>
                  </div>
                  <hr className='my-3' />
                  <div className="grid gap-4 mb-5 grid-cols-2">
                    <div>
                      <label htmlFor="answer_1" className="block mb-2 text-sm font-medium text-gray-900">Jawaban A</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                          <FontAwesomeIcon icon={faKey} className='text-gray-300 text-sm' />
                        </div>
                        <input type="text" name="answer_1" id="answer_1" value={formData.answer_1} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5" placeholder="Jawaban A" required />
                      </div>
                      <div className="flex mt-2 ml-2">
                        <div className="flex items-center me-4">
                          <input id="answer_1_true" name="answer_1_status" type="radio" value="true" onChange={handleChange} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500" checked={formData.answer_1_status == "true"} />
                          <label htmlFor="answer_1_true" className="ms-2 text-xs font-medium text-gray-700">Benar</label>
                        </div>
                        <div className="flex items-center me-4">
                          <input id="answer_1_false" name="answer_1_status" type="radio" value="false" onChange={handleChange} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500" checked={formData.answer_1_status == "false"} />
                          <label htmlFor="answer_1_false" className="ms-2 text-xs font-medium text-gray-700">Salah</label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="answer_2" className="block mb-2 text-sm font-medium text-gray-900">Jawaban B</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                          <FontAwesomeIcon icon={faKey} className='text-gray-300 text-sm' />
                        </div>
                        <input type="text" name="answer_2" id="answer_2" value={formData.answer_2} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5" placeholder="Jawaban B" required />
                      </div>
                      <div className="flex mt-2 ml-2">
                        <div className="flex items-center me-4">
                          <input id="answer_2_true" name="answer_2_status" type="radio" value="true" onChange={handleChange} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500" checked={formData.answer_2_status == "true"} />
                          <label htmlFor="answer_2_true" className="ms-2 text-xs font-medium text-gray-700">Benar</label>
                        </div>
                        <div className="flex items-center me-4">
                          <input id="answer_2_false" name="answer_2_status" type="radio" value="false" onChange={handleChange} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500" checked={formData.answer_2_status == "false"} />
                          <label htmlFor="answer_2_false" className="ms-2 text-xs font-medium text-gray-700">Salah</label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="answer_3" className="block mb-2 text-sm font-medium text-gray-900">Jawaban C</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                          <FontAwesomeIcon icon={faKey} className='text-gray-300 text-sm' />
                        </div>
                        <input type="text" name="answer_3" id="answer_3" value={formData.answer_3} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5" placeholder="Jawaban B" required />
                      </div>
                      <div className="flex mt-2 ml-2">
                        <div className="flex items-center me-4">
                          <input id="answer_3_true" name="answer_3_status" type="radio" value="true" onChange={handleChange} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500" checked={formData.answer_3_status == "true"} />
                          <label htmlFor="answer_3_true" className="ms-2 text-xs font-medium text-gray-700">Benar</label>
                        </div>
                        <div className="flex items-center me-4">
                          <input id="answer_3_false" name="answer_3_status" type="radio" value="false" onChange={handleChange} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500" checked={formData.answer_3_status == "false"} />
                          <label htmlFor="answer_3_false" className="ms-2 text-xs font-medium text-gray-700">Salah</label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="answer_4" className="block mb-2 text-sm font-medium text-gray-900">Jawaban D</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                          <FontAwesomeIcon icon={faKey} className='text-gray-300 text-sm' />
                        </div>
                        <input type="text" name="answer_4" id="answer_4" value={formData.answer_4} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5" placeholder="Jawaban B" required />
                      </div>
                      <div className="flex mt-2 ml-2">
                        <div className="flex items-center me-4">
                          <input id="answer_4_true" name="answer_4_status" type="radio" value="true" onChange={handleChange} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500" checked={formData.answer_4_status == "true"} />
                          <label htmlFor="answer_4_true" className="ms-2 text-xs font-medium text-gray-700">Benar</label>
                        </div>
                        <div className="flex items-center me-4">
                          <input id="answer_4_false" name="answer_4_status" type="radio" value="false" onChange={handleChange} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500" checked={formData.answer_4_status == "false"} />
                          <label htmlFor="answer_4_false" className="ms-2 text-xs font-medium text-gray-700">Salah</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button type="submit" className="text-white inline-flex items-center bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-xl space-x-2 text-sm px-5 py-2.5 text-center">
                    <FontAwesomeIcon icon={faSave} />
                    <span>Simpan Perubahan</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        }
        {
          importModal &&
          <div tabIndex={-1} className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
            <div className="relative p-4 w-full max-w-lg max-h-full">
              <div className="relative bg-white rounded-2xl shadow">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Import Soal
                  </h3>
                  <button type="button" onClick={() => setImportModal(!importModal)} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-xl text-sm w-8 h-8 ms-auto inline-flex justify-center items-center">
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                </div>
                <form onSubmit={handleImport} accept=".xlsx, .xls" encType="multipart/form-data" className="p-4 md:p-5">
                  <div className="grid gap-4 mb-4 grid-cols-2">
                    <div className="col-span-2">
                      <label htmlFor="package_question_id" className="block mb-2 text-sm font-medium text-gray-900">Paket Soal</label>
                      <select name="package_question_id" onChange={handleChange} id="package_question_id" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5">
                        <option value="">Pilih</option>
                        {
                          packageQuestions.length > 0 &&
                          packageQuestions.map((packageQuestion, index) =>
                            <option value={packageQuestion.id} key={index}>{packageQuestion.name}</option>
                          )
                        }
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label htmlFor="excel" className="block mb-2 text-sm font-medium text-gray-900">Excel</label>
                      <input type='file' name="excel" id="excel" onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" />
                    </div>
                    <div className="col-span-2">
                      <a href={ExampleImportQuestion} className='text-xs underline' download="example-import-questions.xlsx">
                        Download Example Template
                      </a>
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
      </main>
    )
  )
}

export default Questions