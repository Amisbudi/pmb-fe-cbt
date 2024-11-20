import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEdit,
    faPlusCircle,
    faTrashAlt,
  } from "@fortawesome/free-solid-svg-icons";
import ModalGrouping from "./Modal/ModalGrouping";
import htmlparse from 'html-react-parser';
import axios from "axios";

function QuestionsGrup() {
    const [isOpen, setIsOpen] = useState(false);
    const [, setCountAnswer] = useState(0);
    const [, setTotal] = useState(0);
    const [, setTotalPages] = useState(0);
    const [limit, setLimit] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [groupingDataQuestion, setGroupingDataQuestion] = useState([]);
    const [reloadData, setReloadData] = useState(0)
    const [detail, setDataDetail] = useState('')

    const getGruopingQuestions = async () => {
        await axios
          .get(`https://be-cbt.trisakti.ac.id/groupquestions`, {
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
          })
          .catch((error) => {
            console.log(error.message);
          });
    };

    const handleDelete = async (id) => {
        if (confirm("Apakah yakin akan menghapus data soal ini?")) {
          await axios
            .delete(`https://be-cbt.trisakti.ac.id/groupquestions/${id}`, {
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

    return (
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
                            setCountAnswer(0);
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
                                    src={`https://be-cbt.trisakti.ac.id/questions/image/${data.id}`}
                                    alt="Question Image"
                                    className="w-32 rounded-xl"
                                    />
                                ) : (
                                    <span>Tidak ada gambar</span>
                                )}
                                    </td>
                                    <td className="px-6 py-4">{htmlparse(data.naration)}</td>
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
}

export default QuestionsGrup;
