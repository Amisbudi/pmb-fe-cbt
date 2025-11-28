import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEdit,
    faPlusCircle,
    faTrashAlt,
    faXmarkCircle,
  } from "@fortawesome/free-solid-svg-icons";
import ModalGrouping from "./Modal/ModalGrouping";
import axios from "axios";
import LoadingScreen from './LoadingScreen';
import Select from "react-select";
import { customStyles } from '../helpers/stylingSelect'

function QuestionsGrup() {
  const [isOpen, setIsOpen] = useState(false);
  const [detail, setDataDetail] = useState(null);

  // Data State
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [packageName, setPackageName] = useState('');
  const [optionFilters, setOptionFilters] = useState([])
  const [packageQuestions, setPackageQuestions] = useState([]);
  const [groupingDataQuestion, setGroupingDataQuestion] = useState([]);

  // UI State
  const [reloadData, setReloadData] = useState(0);
  const [loading, setLoading] = useState(true);
  const [paginations, setPaginations] = useState([]);

  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;
  const API_KEY = "b4621b89b8b68387";

  const getGruopingQuestions = async (page = 1, perPage = limit) => {
    await axios
      .get(`${API_URL}/groupquestions?page=${page}&limit=${perPage}&package_name=${packageName}`, {
        headers: {
          "api-key": API_KEY,
        },
      })
      .then((response) => {
          setGroupingDataQuestion(response.data.data);
          setCurrentPage(response.data.currentPage);
          setTotal(response.data.totalItems);
          setTotalPages(response.data.totalPages);
          setLimit(response.data.limit);

          const paginate = [];
          const maxButtons = 4;

          for (let i = 0; i < response.data.totalPages; i++) {
            const pageNumber = i + 1;
            const isActive = pageNumber === response.data.currentPage;
            
            if (i < 2) {
              paginate.push(
                <li key={i} className="hidden md:inline-block">
                  <button
                    type="button"
                    onClick={() => getGruopingQuestions(pageNumber, perPage)}
                    className={`flex items-center justify-center px-3 h-8 leading-tight border border-gray-300 transition-all ease-in-out ${
                      isActive
                        ? 'text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 font-semibold'
                        : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700'
                    }`}
                  >
                    {pageNumber}
                  </button>
                </li>,
              );
            }

            if (
              i === 2 &&
              response.data.totalPages > maxButtons
            ) {
              paginate.push(
                <li key="dots" className="hidden md:inline-block">
                  <span className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300">
                    ...
                  </span>
                </li>,
              );
            }

            if (response.data.totalPages > maxButtons) {
              if (i === response.data.totalPages - 1) {
                const isLastActive = response.data.totalPages === response.data.currentPage;
                paginate.push(
                  <li key={i} className="hidden md:inline-block">
                    <button
                      type="button"
                      onClick={() => getGruopingQuestions(response.data.totalPages, perPage)}
                      className={`flex items-center justify-center px-3 h-8 leading-tight border border-gray-300 transition-all ease-in-out ${
                        isLastActive
                          ? 'text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 font-semibold'
                          : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700'
                      }`}
                    >
                      {response.data.totalPages}
                    </button>
                  </li>,
                );
              }
            }

            if (
              response.data.totalPages <= maxButtons &&
              i >= 2 &&
              i < response.data.totalPages
            ) {
              paginate.push(
                <li key={i} className="hidden md:inline-block">
                  <button
                    type="button"
                    onClick={() => getGruopingQuestions(pageNumber, perPage)}
                    className={`flex items-center justify-center px-3 h-8 leading-tight border border-gray-300 transition-all ease-in-out ${
                      isActive
                        ? 'text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 font-semibold'
                        : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700'
                    }`}
                  >
                    {pageNumber}
                  </button>
                </li>,
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
    };

    const handleLimitChange = (e) => {
      const newLimit = parseInt(e.target.value);
      setLimit(newLimit);
      getGruopingQuestions(1, newLimit);
    };

    const handleDelete = async (id) => {
      if (confirm("Apakah yakin akan menghapus data soal ini?")) {
        await axios
          .delete(`${API_URL}/groupquestions/${id}`, {
            headers: {
              "api-key": API_KEY,
            },
          })
          .then((response) => {
            alert(response.data.message);
            setReloadData(reloadData + 1);
            getGruopingQuestions(currentPage, limit);
          })
         .catch((error) => {
            if (error.response && error.response.status === 400) {
              alert(error.response.data.message);
            } else {
              console.log(error);
            }
        });
      }
    };
    
    const handleEdit = (data) => { 
        setIsOpen(true)
        setDataDetail(data)
    }

    const getPackageQuestions = async () => {
      await axios
        .get(`${API_URL}/packagequestions`, {
          params: {
            limit: 25,
          },
          headers: {
            "api-key": API_KEY,
          },
        })
        .then((response) => {
          setPackageQuestions(response.data.data);
        })
        .catch((error) => {
          console.log(error.message);
        });
    };

    useEffect(() => {
      if(packageQuestions) {
        const result = packageQuestions?.map((item) => {
          return {
            value: item.id,
            label: item.name
          }
        })
        setOptionFilters(result)
      }
    }, [packageQuestions])
    
    useEffect(() => {
      getGruopingQuestions()
      getPackageQuestions()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    } ,[reloadData, packageName])

    return loading ? (
        <LoadingScreen />
      ) : (
        <main className="w-full md:w-10/12 h-screen bg-gray-100 pt-10 px-4 md:px-8 overflow-auto pb-10">
            <div className="space-y-1">
                <h2 className="font-bold text-xl text-gray-900">Kelompok Soal</h2>
                <p className="text-sm text-gray-700">
                    Di bawah ini adalah menu untuk pengelompokan paket soal. Anda dapat mengelompokan, menambah, mengubah, dan mengatur paket soal yang tersedia sesuai kebutuhan.
                </p>
            </div>
            <section className="mt-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
                    <button
                        type="button"
                        onClick={() => {
                            setIsOpen(true);
                            setDataDetail([])
                        }}
                        className="text-white bg-sky-700 hover:bg-sky-800 font-medium rounded-xl text-sm px-5 py-2.5 space-x-2 text-center w-full md:w-auto"
                    >
                        <FontAwesomeIcon icon={faPlusCircle} />
                        <span>Tambah</span>
                    </button>

                    <div className="flex gap-x-2 items-center">
                       <div className="relative">
                        <Select
                          options={optionFilters}
                          styles={customStyles}
                          value={packageName !== '' ? undefined : ''}
                          onChange={(selectedOption) => {
                            setPackageName(selectedOption.label);
                          }}
                          placeholder="Select..."
                        />
                        {packageName && (
                          <span
                            onClick={() => setPackageName('')} 
                            className="absolute cursor-pointer font-bold right-1/4 top-[0.6rem] text-sm"
                          >
                          <FontAwesomeIcon icon={faXmarkCircle} />
                          </span>
                        )}
                      </div>

                      <select
                        id="limit"
                        value={limit}
                        onChange={handleLimitChange}
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 px-2 py-2 transition-all ease-in-out"
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                    </div>
                </div>

                <div className="overflow-x-auto border rounded-2xl">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr className="border-b">
                                <th scope="col" className="px-6 py-4 rounded-tl-xl">
                                    No.
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    Paket Soal
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    Gambar
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    Narasi
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    Duration
                                </th>
                                <th scope="col" className="px-6 py-4 rounded-tr-xl">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                         <tbody>
                          {groupingDataQuestion?.length > 0 ? (
                            groupingDataQuestion.map((data, index) => (
                            <tr key={index} className="odd:bg-white even:bg-gray-50 border-b" >
                                <th
                                scope="row"
                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                                >
                                {limit * (currentPage - 1) + index + 1}
                                </th>
                                <td className="px-6 py-4">{data?.package_questions?.name}</td>
                                <td className="px-6 py-4">{data.name}</td>
                                <td className="px-6 py-4">
                                {data.image ? (
                                    <img
                                    src={`${import.meta.env.VITE_APP_API_BASE_URL}/questions/image/${data.id}`}
                                    alt="Question Image"
                                    className="w-32 rounded-xl"
                                    />
                                ) : (
                                    <span>Tidak ada gambar</span>
                                )}
                                    </td>
                                    <td className="px-6 py-4">{data.naration?.replace(/<[^>]*>/g, '')?.replace(/["']/g, '')}</td>
                                    <td className="px-6 py-4">{data.duration} menit</td>
                                <td className="px-6 py-4 flex flex-col md:flex-row gap-1">
                                <button
                                    type="button"
                                    onClick={() => handleEdit(data)}
                                    className="text-white bg-amber-500 hover:bg-amber-600 font-medium rounded-xl text-xs px-3 py-1.5 text-center"
                                >
                                    <FontAwesomeIcon icon={faEdit} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(data.id)}
                                    className="text-white bg-red-600 hover:bg-red-700 font-medium rounded-xl text-xs px-3 py-1.5 text-center"
                                >
                                    <FontAwesomeIcon icon={faTrashAlt} />
                                </button>
                                </td>
                            </tr>
                            ))
                        ) : (
                            <tr className="bg-white">
                            <td colSpan={7} className="px-6 py-4 text-center">
                                Data tidak ditemukan.
                            </td>
                            </tr>
                        )}
                      </tbody>
                    </table>

                  {total > limit && (
                    <nav className="flex items-center flex-column flex-wrap md:flex-row justify-between p-5 bg-white">
                      <span className="text-sm font-normal text-gray-500 mb-4 md:mb-0 block w-full md:inline md:w-auto">
                        Menampilkan{" "}
                        <span className="font-bold text-gray-700">
                          {limit * (currentPage - 1) + 1}
                        </span>{" "}
                        hingga{" "}
                        <span className="font-bold text-gray-700">
                          {Math.min(limit * currentPage, total)}
                        </span>{" "}
                        dari{" "}
                        <span className="font-bold text-gray-700">{total}</span> data.
                      </span>
                      <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                        <li>
                          <button
                            type="button"
                            onClick={() => getGruopingQuestions(currentPage - 1, limit)}
                            disabled={currentPage === 1}
                            className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight border border-gray-300 rounded-s-lg transition-all ease-in-out ${
                              currentPage === 1
                                ? 'text-gray-300 bg-gray-100 cursor-not-allowed'
                                : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700'
                            }`}
                          >
                            Previous
                          </button>
                        </li>
                        {paginations}
                        <li>
                          <button
                            type="button"
                            onClick={() =>
                              getGruopingQuestions(
                                totalPages === currentPage
                                  ? currentPage
                                  : currentPage + 1,
                                limit
                              )
                            }
                            disabled={currentPage === totalPages}
                            className={`flex items-center justify-center px-3 h-8 leading-tight border border-gray-300 rounded-e-lg transition-all ease-in-out ${
                              currentPage === totalPages
                                ? 'text-gray-300 bg-gray-100 cursor-not-allowed'
                                : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700'
                            }`}
                          >
                            Next
                          </button>
                        </li>
                      </ul>
                    </nav>
                    )}
                    
                </div>
            </section>

            
            <ModalGrouping
              detail={detail}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              reloadData={reloadData}
              setDetail={setDataDetail}
              setReloadData={setReloadData}
            />
        </main>
    );
};

export default QuestionsGrup;