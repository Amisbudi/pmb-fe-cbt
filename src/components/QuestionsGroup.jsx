import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEdit,
    faPlusCircle,
    faTrashAlt,
  } from "@fortawesome/free-solid-svg-icons";
import ModalGrouping from "./Modal/ModalGrouping";
import axios from "axios";
import LoadingScreen from './LoadingScreen';

function QuestionsGrup() {
    const [isOpen, setIsOpen] = useState(false);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [limit, setLimit] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [groupingDataQuestion, setGroupingDataQuestion] = useState([]);
    const [reloadData, setReloadData] = useState(0)
    const [detail, setDataDetail] = useState('')
    const [paginations, setPaginations] = useState([]);
    const [loading, setLoading] = useState(true);

    const getGruopingQuestions = async () => {
        await axios
          .get(`${import.meta.env.REACT_APP_API_BASE_URL}/groupquestions`, {
            headers: {
              "api-key": "b4621b89b8b68387",
            },
          })
          .then((response) => {
              setGroupingDataQuestion(response.data.data);
              setCurrentPage(response.data.currentPage);
              setTotal(response.data.totalItems);
              setTotalPages(response.data.totalPages);
              setLimit(response.data.limit);

              const paginate = [];
              const maxButtons = 3;

            for (let i = 0; i < response.data.totalPages; i++) {
                const isActive = i + 1 === response.data.currentPage;
        
                if (
                    i < 2 ||
                    (i >= response.data.currentPage - 1 && i <= response.data.currentPage + 1) ||
                    i === response.data.totalPages - 1
                ) {
                    paginate.push(
                    <li key={i} className="hidden md:inline-block">
                        <button
                        type="button"
                        onClick={() => getGruopingQuestions(i + 1)}
                        className={`flex items-center justify-center px-3 h-8 leading-tight border border-gray-300 transition-all ease-in-out ${
                            isActive
                            ? "bg-blue-500 text-white hover:bg-blue-600"
                            : "bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        }`}
                        >
                        {i + 1}
                        </button>
                    </li>
                    );
                }
        
                if (
                    i === 2 &&
                    response.data.totalPages > maxButtons &&
                    response.data.totalPages > maxButtons
                ) {
                    paginate.push(
                    <li key="dots" className="hidden md:inline-block">
                        <button className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300">
                        ...
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
    };

    const handleDelete = async (id) => {
        if (confirm("Apakah yakin akan menghapus data soal ini?")) {
          await axios
            .delete(`${import.meta.env.REACT_APP_API_BASE_URL}/groupquestions/${id}`, {
              headers: {
                "api-key": "b4621b89b8b68387",
              },
            })
            .then((response) => {
              alert(response.data.message);
              setReloadData(reloadData + 1);
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
    
    useEffect(() => {
        getGruopingQuestions()
    } ,[reloadData])

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
                <div className="flex items-center w-full justify-between">
                    <button
                        type="button"
                        onClick={() => {
                            setIsOpen(true);
                            setDataDetail([])
                        }}
                        className="text-white bg-sky-700 hover:bg-sky-800 font-medium rounded-xl text-sm px-5 py-2.5 space-x-2 mb-5 text-center"
                    >
                        <FontAwesomeIcon icon={faPlusCircle} />
                        <span>Tambah</span>
                    </button>
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
                          {groupingDataQuestion.length > 0 ? (
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
                                    src={`${import.meta.env.REACT_APP_API_BASE_URL}/questions/image/${data.id}`}
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
                            <td colSpan={6} className="px-6 py-4 text-center">
                                Data tidak ditemukan.
                            </td>
                            </tr>
                        )}
                      </tbody>
                    </table>

                  {total > limit && (
                    <nav className="flex items-center flex-column flex-wrap md:flex-row justify-between p-5 bg-white">
                    <span className="text-sm font-normal text-gray-500 mb-4 md:mb-0 block w-full md:inline md:w-auto">
                        Saat ini terdapat{" "}
                        <span className="font-bold text-gray-700">{total}</span> data.
                    </span>
                    <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                        <li>
                        <button
                            type="button"
                            onClick={() => getGruopingQuestions(currentPage - 1)}
                            className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 transition-all ease-in-out"
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
                                totalPages == currentPage
                                ? currentPage
                                : currentPage + 1,
                            )
                            }
                            className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 transition-all ease-in-out"
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
                setDetail={setDataDetail}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                reloadData={reloadData}
                setReloadData={setReloadData}
            />
        </main>
    );
};

export default QuestionsGrup;
