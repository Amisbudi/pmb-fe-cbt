import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faKey,
  faPlusCircle,
  faSave,
  faTrashAlt,
  faUpload,
  faXmark,
  faXmarkCircle,
  faLayerGroup,
  faEye,
  faFileExport
} from "@fortawesome/free-solid-svg-icons";
import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import axios from "axios";
import LoadingScreen from "./LoadingScreen";
import ExampleImportQuestion from "../assets/example-import-questions.xlsx";
import TextEditor from "./Editor";
import ModalGrouping from "./Modal/ModalGrouping";
import ModalViewQuestion from "./Modal/ModalViewQuestion";
import { API_KEY, API_BASE_URL } from "../helpers/constant";
import { customStyles } from '../helpers/stylingSelect'
import Select from "react-select";

const Questions = () => {
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [importModal, setImportModal] = useState(false);

  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [questions, setQuestions] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [countAnswer, setCountAnswer] = useState(0);
  const [paginations, setPaginations] = useState([]);
  const [packageName, setPackageName] = useState('');
  const [optionFilters, setOptionFilters] = useState([])
  const [idGroupQuestion, setIdGroupQuestion] = useState("");
  const [packageQuestions, setPackageQuestions] = useState([]);

  const [getId, setGetIdView] = useState();
  const [viewModal, setViewModal] = useState(false);
  const [questionType, setQuestionType] = useState("");
  const [openModalGrouping, setOpenModalGrouping] = useState(false);
  const [groupingDataQuestion, setGroupingDataQuestion] = useState([]);

  const [formData, setFormData] = useState({
    id: "",
    package_question_id: "",
    id_group_questions: "",
    naration: null,
    name: null,
    image: "",
    status: false,
    answer_1: "",
    answer_1_id: null,
    answer_1_image: "",
    answer_1_status: false,
    answer_2: "",
    answer_2_id: null,
    answer_2_image: "",
    answer_2_status: false,
    answer_3: "",
    answer_3_id: null,
    answer_3_image: "",
    answer_3_status: false,
    answer_4: "",
    answer_4_id: null,
    answer_4_image: "",
    answer_4_status: false,
    answer_5: "",
    answer_5_id: null,
    answer_5_image: "",
    answer_5_status: false,
    excel: "",
  });

  const getData = async (page = 1, perPage = limit) => {
    await axios
    .get(
        `${API_BASE_URL}/questions?page=${page}&limit=${perPage}&package.name=${packageName}`,
        {
          headers: {
            "api-key": API_KEY,
          },
        }
      )
      .then((response) => {
        setQuestions(response.data.data);
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
                  onClick={() => getData(pageNumber, perPage)}
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
                    onClick={() => getData(response.data.totalPages, perPage)}
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
                  onClick={() => getData(pageNumber, perPage)}
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
        if (error.response && error.response.status === 400) {
          alert(error.response.data.message);
        } else {
          console.log(error);
        }
      });
  };

  const handleLimitChange = (e) => {
    const newLimit = parseInt(e.target.value);
    setLimit(newLimit);
    getData(1, newLimit);
  };

  const getGruopingQuestions = async () => {
    await axios
      .get(`${API_BASE_URL}/groupquestions`, {
        params: {
          limit :  100
        },
        headers: {
          "api-key": API_KEY,
        },
      })
      .then((response) => {
        let filteredData = null
        if(formData.package_question_id){
          filteredData = response.data.data.filter(g => g.package_question_id == formData.package_question_id);
        }else{
          filteredData = response.data.data;
        }
        setGroupingDataQuestion(filteredData);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const getPackageQuestions = async () => {
    await axios
      .get(`${API_BASE_URL}/packagequestions`, {
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

  const handleChange = (e) => {
    if (e.target.name === "excel" && e.target.files?.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          excel: reader.result,
        });
      };
      reader.readAsDataURL(file);
    } else if (e.target.name === "package_question_id") {
      getGruopingQuestions();
      setCountAnswer(
        parseInt(e.target.selectedOptions[0].getAttribute("data-count-answer"))
      );
      setQuestionType(
        e.target.options[e.target.selectedIndex].dataset.typeOfQuestion
      );
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });

      const filteredData = groupingDataQuestion.filter(g => g.package_question_id === e.target.value)
      setGroupingDataQuestion(filteredData);
    } else if (e.target.name === "image" && e.target.files?.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          image: reader.result,
        });
      };
      reader.readAsDataURL(file);
    } else if (
      e.target.name === "answer_1_image" &&
      e.target.files.length > 0
    ) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          answer_1_image: reader.result,
        });
      };
      reader.readAsDataURL(file);
    } else if (
      e.target.name === "answer_2_image" &&
      e.target.files.length > 0
    ) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          answer_2_image: reader.result,
        });
      };
      reader.readAsDataURL(file);
    } else if (
      e.target.name === "answer_3_image" &&
      e.target.files.length > 0
    ) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          answer_3_image: reader.result,
        });
      };
      reader.readAsDataURL(file);
    } else if (
      e.target.name === "answer_4_image" &&
      e.target.files.length > 0
    ) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          answer_4_image: reader.result,
        });
      };
      reader.readAsDataURL(file);
    } else if (
      e.target.name === "answer_5_image" &&
      e.target.files.length > 0
    ) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          answer_5_image: reader.result,
        });
      };
      reader.readAsDataURL(file);
    } else if (
      e.target.name === "answer_6_image" &&
      e.target.files.length > 0
    ) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          answer_5_image: reader.result,
        });
      };
      reader.readAsDataURL(file);
    } else if (
      e.target.name === "answer_7_image" &&
      e.target.files.length > 0
    ) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          answer_5_image: reader.result,
        });
      };
      reader.readAsDataURL(file);
    } else if (
      e.target.name === "answer_8_image" &&
      e.target.files.length > 0
    ) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          answer_5_image: reader.result,
        });
      };
      reader.readAsDataURL(file);
    } else if (
      e.target.name === "answer_9_image" &&
      e.target.files.length > 0
    ) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          answer_5_image: reader.result,
        });
      };
      reader.readAsDataURL(file);
    } else if (
      e.target.name === "answer_10_image" &&
      e.target.files.length > 0
    ) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          answer_5_image: reader.result,
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

  function handleChangeEditor(name, value) {
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  const handleEdit = async (content) => {
    await axios
      .get(
        `${API_BASE_URL}/answers/question/${
          content.id
        }`,
        {
          headers: {
            "api-key": API_KEY,
          },
        }
      )
      .then((response) => {
        setCountAnswer(0);
        setCountAnswer(response.data.length);
        let data = {
          id: content.id,
          package_question_id: content.package_question_id,
          id_group_questions: content.id_group_questions,
          naration: content.naration,
          name: content.name,
          image: content.image,
          status: content.status,
        };
        for (let i = 0; i < response.data.length; i++) {
          data[`answer_${i + 1}`] = response.data[i].name;
          data[`answer_${i + 1}_id`] = response.data[i].id;
          data[`answer_${i + 1}_status`] = response.data[i].is_right.toString();
        }

        const filteredData = groupingDataQuestion.filter(g => g.package_question_id === content.package_question_id)
        setGroupingDataQuestion(filteredData);
        setFormData(data);
        setIdGroupQuestion(data.id_group_questions);
        setEditModal(true);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const handleImport = async (e) => {
    setLoading(true);
    e.preventDefault();
    await axios
      .post(
        `${API_BASE_URL}/questions/import`,
        {
          package_question_id: formData.package_question_id,
          excel: formData.excel,
        },
        {
          headers: {
            "api-key": API_KEY,
          },
        }
      )
      .then((response) => {
        alert(response.data.message);
        setImportModal(false);
        setCountAnswer(0);
        getData(currentPage, limit);
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
  };

  const handleSave = async (e) => {
    setLoading(true);
    e.preventDefault();

    let data = {
      package_question_id: formData.package_question_id,
      id_group_questions: parseFloat(idGroupQuestion),
      naration: JSON.stringify(formData.naration),
      name: JSON.stringify(formData.name),
      image: formData.image,
      status: true,
      count_answer: countAnswer,
    };

    for (let i = 0; i < parseInt(countAnswer); i++) {
      data[`answer_${i + 1}`] = formData[`answer_${i + 1}`];
      data[`answer_${i + 1}_image`] = formData[`answer_${i + 1}_image`];
      data[`answer_${i + 1}_status`] = formData[`answer_${i + 1}_status`];
    }

    await axios
      .post(`${API_BASE_URL}/questions`, data, {
        headers: {
          "api-key": API_KEY,
        },
      })
      .then((response) => {
        alert(response.data.message);
        setCreateModal(false);
        setCountAnswer(0);
        getData(currentPage, limit);
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
  };

  const handleUpdate = async (e) => {
    setLoading(true);
    e.preventDefault();
    let data = {
      package_question_id: formData.package_question_id,
      naration: formData.naration,
      name: formData.name,
      image: formData.image,
      status: formData.status,
      count_answer: countAnswer,
    };

    for (let i = 0; i < parseInt(countAnswer); i++) {
      data[`answer_${i + 1}`] = formData[`answer_${i + 1}`];
      data[`answer_${i + 1}_id`] = formData[`answer_${i + 1}_id`];
      data[`answer_${i + 1}_image`] = formData[`answer_${i + 1}_image`];
      data[`answer_${i + 1}_status`] = formData[`answer_${i + 1}_status`];
    }

    await axios
      .patch(
        `${API_BASE_URL}/questions/${formData.id}`,
        data,
        {
          headers: {
            "api-key": API_KEY,
          },
        }
      )
      .then((response) => {
        alert(response.data.message);
        setEditModal(false);
        setCountAnswer(0);
        getData(currentPage, limit);
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
  };

  const handleDelete = async (id) => {
    if (confirm("Apakah yakin akan menghapus paket soal?")) {
      await axios
        .delete(`${API_BASE_URL}/questions/${id}`, {
          headers: {
            "api-key": API_KEY,
          },
        })
        .then((response) => {
          alert(response.data.message);
          getData(currentPage, limit);
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

  const handleExport = async () => {
    try {
      setLoading(true);
  
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
      });
  
      if (packageName) {
        params.append('package.name', packageName);
      }
  
      const response = await axios.get(
        `${API_BASE_URL}/questions/export/pdf?${params.toString()}`,
        {
          headers: {
            "api-key": API_KEY,
          },
          responseType: 'blob',
        }
      );
  
      // Create blob and trigger download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `questions_page${currentPage}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
  
      setLoading(false);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export PDF. Please try again.');
      setLoading(false);
    }
  };

  const handleView = async (id) => {
    setGetIdView(id);
    setViewModal(true);
  };

  useEffect(() => {
    getData();

      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packageName])

  useEffect(() => {
    getGruopingQuestions();
    getPackageQuestions();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


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

  return loading ? (
    <LoadingScreen />
  ) : (
    <main className="w-full md:w-10/12 h-screen bg-gray-100 pt-10 px-4 md:px-8 overflow-auto pb-10">
      <div className="space-y-1">
        <h2 className="font-bold text-xl text-gray-900">Pertanyaan</h2>
        <p className="text-sm text-gray-700">
          Di bawah ini adalah menu pengelolaan paket soal. Anda dapat menambah,
          mengubah, dan mengatur paket soal yang tersedia sesuai kebutuhan.
        </p>
      </div>
      <section className="mt-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full md:w-auto">
            <button
              type="button"
              onClick={() => {
                setCreateModal(!createModal);
                setCountAnswer(0);
              }}
              className="text-white bg-sky-700 hover:bg-sky-800 font-medium rounded-xl text-sm px-5 py-2.5 space-x-2 text-center w-full sm:w-auto"
            >
              <FontAwesomeIcon icon={faPlusCircle} />
              <span>Tambah</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setOpenModalGrouping(true);
                setCountAnswer(0);
              }}
              className="text-white bg-slate-700 hover:bg-black font-medium rounded-xl text-sm px-5 py-2.5 space-x-2 text-center w-full sm:w-auto"
            >
              <FontAwesomeIcon icon={faLayerGroup} />
              <span>Group Questions</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setImportModal(!importModal);
                setCountAnswer(0);
              }}
              className="text-white bg-sky-700 hover:bg-sky-800 font-medium rounded-xl text-sm px-5 py-2.5 space-x-2 text-center w-full sm:w-auto"
            >
              <FontAwesomeIcon icon={faUpload} />
              <span>Import</span>
            </button>

            <button
              type="button"
              onClick={handleExport}
              className="text-white bg-sky-700 hover:bg-sky-800 font-medium rounded-xl text-sm px-5 py-2.5 space-x-2 text-center w-full sm:w-auto"
            >
              <FontAwesomeIcon icon={faFileExport} />
              <span>Export</span>
            </button>
          </div>

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

            <div className="flex items-center gap-3 w-full md:w-auto">
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
        </div>

        <div className="overflow-x-auto border rounded-2xl">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr className="border-b">
                <th scope="col" className="px-6 py-4 rounded-tl-xl">
                  No.
                </th>
                <th scope="col" className="px-6 py-4">
                  Soal
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
              {questions?.length > 0 ? (
                questions.map((question, index) => (
                  <tr
                    key={index}
                    className="odd:bg-white even:bg-gray-50 border-b"
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    >
                      {limit * (currentPage - 1) + index + 1}
                    </th>
                    <td className="px-6 py-4">
                      {question.name
                        ?.replace(/<[^>]*>/g, "")
                        ?.replace(/&nbsp;/g, " ")
                        ?.replace(/"/g, "")
                        ?.trim()}
                    </td>
                    <td className="px-6 py-4">
                      {question.image ? (
                        <img
                          src={`${
                            API_BASE_URL
                          }/questions/image/${question.id}`}
                          alt="Question Image"
                          className="w-32 rounded-xl"
                        />
                      ) : (
                        <span>Tidak ada gambar</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {question.package
                        ? question.package.name
                        : "Package not found"}
                    </td>
                    <td className="px-6 py-4">
                      {question.status ? (
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          className="text-emerald-600"
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faXmarkCircle}
                          className="text-red-600"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 flex flex-col md:flex-row gap-1">
                      <button
                        type="button"
                        className="text-black bg-gray-300 hover:bg-gray-400 font-medium rounded-xl text-xs px-3 py-1.5 text-center"
                        onClick={() => handleView(question?.id)}
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleEdit(question)}
                        className="text-white bg-amber-500 hover:bg-amber-600 font-medium rounded-xl text-xs px-3 py-1.5 text-center"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(question.id)}
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
                    onClick={() => getData(currentPage - 1, limit)}
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
                      getData(
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

      {/* Modals remain the same - createModal, editModal, importModal, etc. */}
      {createModal && (
        <div
          tabIndex={-1}
          className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50 overflow-auto"
        >
          <div className="relative p-4 w-full max-w-4xl max-h-full">
            <div className="relative bg-white rounded-2xl shadow">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                <h3 className="text-lg font-semibold text-gray-900">
                  Tambah Soal
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setCreateModal(!createModal);
                    setCountAnswer(0);
                  }}
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-xl text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </div>

              <form
                onSubmit={handleSave}
                encType="multipart/form-data"
                className="p-4 md:p-5"
              >
                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-span-1">
                    <label
                      htmlFor="package_question_id"
                      className="block mb-2 text-xs font-medium text-gray-900"
                    >
                      Paket Soal
                    </label>
                    <select
                      name="package_question_id"
                      onChange={handleChange}
                      id="package_question_id"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    >
                      <option value="">Pilih Soal</option>
                      {packageQuestions?.length > 0 &&
                        packageQuestions.map((packageQuestion, index) => (
                          <option
                            value={packageQuestion.id}
                            data-count-answer={packageQuestion.count_answer}
                            data-type-of-question={
                              packageQuestion.type_of_question
                            }
                            key={index}
                          >
                            {packageQuestion.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="col-span-1">
                    <label
                      htmlFor="id_group_questions"
                      className="block mb-2 text-xs font-medium text-gray-900"
                    >
                      Kelompok Soal
                    </label>
                    <select
                      name="id_group_questions"
                      onChange={(e) => setIdGroupQuestion(e.target.value)}
                      id="id_group_questions"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    >
                      <option value="">Pilih Kelompok Soal</option>
                      {groupingDataQuestion.length > 0 &&
                        groupingDataQuestion.map((data, index) => (
                          <option value={data.id} key={index}>
                            {data.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="col-span-1">
                    <label
                      htmlFor="image"
                      className="block mb-2 text-xs font-medium text-gray-900"
                    >
                      Gambar
                    </label>
                    <input
                      type="file"
                      name="image"
                      id="image"
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    />
                  </div>
                  <div className="col-span-2 mb-5 mt-3">
                    <label
                      htmlFor="naration"
                      className="block mb-2 text-xs font-medium text-gray-900"
                    >
                      Narasi
                    </label>
                    <TextEditor
                      handleChangeEditor={handleChangeEditor}
                      value={formData.naration
                        ?.replace(/<[^>]*>/g, "")
                        ?.replace(/["']/g, "")}
                      name="naration"
                      createModal={createModal}
                    />
                  </div>
                  <div className="col-span-2 mb-5 mt-3">
                    <label
                      htmlFor="name"
                      className="block mb-2 text-xs font-medium text-gray-900"
                    >
                      Soal
                    </label>
                    <TextEditor
                      handleChangeEditor={handleChangeEditor}
                      value={formData.name}
                      name="name"
                      createModal={createModal}
                    />
                  </div>
                </div>
                <hr className="my-3" />
                {questionType === "Multiple choice" && (
                  <div className="grid gap-4 mb-5 grid-cols-3">
                    {Array.from({ length: countAnswer }).map((_, index) => (
                      <div key={index}>
                        <label
                          htmlFor={`answer_${index + 1}`}
                          className="block mb-2 text-xs font-medium text-gray-900"
                        >
                          Jawaban {index + 1}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                            <FontAwesomeIcon
                              icon={faKey}
                              className="text-gray-300 text-sm"
                            />
                          </div>
                          <input
                            type="text"
                            name={`answer_${index + 1}`}
                            id={`answer_${index + 1}`}
                            onChange={handleChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5"
                            placeholder={`Jawaban ${index + 1}`}
                            required
                          />
                        </div>
                        <input
                          type="file"
                          name={`answer_${index + 1}_image`}
                          id={`answer_${index + 1}_image`}
                          onChange={handleChange}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 mt-2"
                        />
                        <div className="flex mt-2 ml-2">
                          <div className="flex items-center me-4">
                            <input
                              id={`answer_${index + 1}_true`}
                              name={`answer_${index + 1}_status`}
                              type="radio"
                              onChange={handleChange}
                              defaultValue={true}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                            />
                            <label
                              htmlFor={`answer_${index + 1}_true`}
                              className="ms-2 text-xs font-medium text-gray-700"
                            >
                              Benar
                            </label>
                          </div>
                          <div className="flex items-center me-4">
                            <input
                              id={`answer_${index + 1}_false`}
                              name={`answer_${index + 1}_status`}
                              type="radio"
                              onChange={handleChange}
                              defaultValue={false}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                            />
                            <label
                              htmlFor={`answer_${index + 1}_false`}
                              className="ms-2 text-xs font-medium text-gray-700"
                            >
                              Salah
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="submit"
                  className="text-white inline-flex items-center bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-xl space-x-2 text-xs px-5 py-2.5 text-center"
                >
                  <FontAwesomeIcon icon={faSave} />
                  <span>Simpan</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {editModal && (
        <div
          tabIndex={-1}
          className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50 overflow-auto"
        >
          <div className="relative p-4 w-full max-w-4xl max-h-full">
            <div className="relative bg-white rounded-2xl shadow">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                <h3 className="text-lg font-semibold text-gray-900">
                  Edit Soal
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setEditModal(!editModal);
                    setCountAnswer(0);
                  }}
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-xl text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </div>
              <form
                onSubmit={handleUpdate}
                encType="multipart/form-data"
                className="p-4 md:p-5"
              >
                <div className="grid gap-4 mb-5 grid-cols-2">
                  <div className="col-span-1">
                    <label
                      htmlFor="package_question_id"
                      className="block mb-2 text-xs font-medium text-gray-900"
                    >
                      Paket Soal
                    </label>
                    <select
                      name="package_question_id"
                      onChange={handleChange}
                      value={formData.package_question_id}
                      id="package_question_id"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    >
                      <option value="">Pilih Soal</option>
                      {packageQuestions?.length > 0 &&
                        packageQuestions.map((packageQuestion, index) => (
                          <option
                            value={packageQuestion.id}
                            data-count-answer={packageQuestion.count_answer}
                            data-type-of-question={
                              packageQuestion.type_of_question
                            }
                            key={index}
                          >
                            {packageQuestion.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="col-span-1">
                    <label
                      htmlFor="id_group_questions"
                      className="block mb-2 text-xs font-medium text-gray-900"
                    >
                      Kelompok Soal
                    </label>
                    <select
                      name="id_group_questions"
                      value={idGroupQuestion}
                      onChange={(e) => setIdGroupQuestion(e.target.value)}
                      id="id_group_questions"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    >
                      <option value="">Pilih Kelompok Soal</option>
                      {groupingDataQuestion.length > 0 &&
                        groupingDataQuestion.map((data, index) => (
                          <option value={data.id} key={index}>
                            {data.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                <div className="grid gap-4 mb-5 grid-cols-2">
                  <div className="col-span-1">
                    <label
                      htmlFor="image"
                      className="block mb-2 text-xs font-medium text-gray-900"
                    >
                      Gambar
                    </label>
                    <input
                      type="file"
                      name="image"
                      id="image"
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    />
                  </div>
                  <div className="col-span-1">
                    <label
                      htmlFor="status"
                      className="block mb-2 text-xs font-medium text-gray-900"
                    >
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      id="status"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    >
                      <option value="true">Aktif</option>
                      <option value="false">Tidak aktif</option>
                    </select>
                  </div>
                  <div className="col-span-3 mb-5 mt-3">
                    <label
                      htmlFor="naration"
                      className="block mb-2 text-xs font-medium text-gray-900"
                    >
                      Narasi
                    </label>
                    <TextEditor
                      handleChangeEditor={handleChangeEditor}
                      value={formData.naration}
                      name="naration"
                      createModal={editModal}
                    />
                  </div>
                  <div className="col-span-3 mb-5 mt-3">
                    <label
                      htmlFor="name"
                      className="block mb-2 text-xs font-medium text-gray-900"
                    >
                      Soal
                    </label>
                    <TextEditor
                      handleChangeEditor={handleChangeEditor}
                      value={formData.name}
                      name="name"
                      createModal={editModal}
                    />
                  </div>
                </div>
                <hr className="my-3" />
                <div className="grid gap-4 mb-5 grid-cols-3">
                  {Array.from({ length: countAnswer }).map((_, index) => (
                    <div key={index}>
                      <label
                        htmlFor={`answer_${index + 1}`}
                        className="block mb-2 text-xs font-medium text-gray-900"
                      >
                        Jawaban {index + 1}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                          <FontAwesomeIcon
                            icon={faKey}
                            className="text-gray-300 text-sm"
                          />
                        </div>
                        <input
                          type="text"
                          name={`answer_${index + 1}`}
                          id={`answer_${index + 1}`}
                          value={formData[`answer_${index + 1}`]}
                          onChange={handleChange}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5"
                          placeholder={`Jawaban ${index + 1}`}
                          required
                        />
                      </div>
                      <input
                        type="file"
                        name={`answer_${index + 1}_image`}
                        id={`answer_${index + 1}_image`}
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 mt-2"
                      />
                      <div className="flex mt-2 ml-2">
                        <div className="flex items-center me-4">
                          <input
                            id={`answer_${index + 1}_true`}
                            name={`answer_${index + 1}_status`}
                            type="radio"
                            value="true"
                            onChange={handleChange}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                            checked={
                              formData[`answer_${index + 1}_status`] == "true"
                            }
                          />
                          <label
                            htmlFor={`answer_${index + 1}_true`}
                            className="ms-2 text-xs font-medium text-gray-700"
                          >
                            Benar
                          </label>
                        </div>
                        <div className="flex items-center me-4">
                          <input
                            id={`answer_${index + 1}_false`}
                            name={`answer_${index + 1}_status`}
                            type="radio"
                            value="false"
                            onChange={handleChange}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                            checked={
                              formData[`answer_${index + 1}_status`] == "false"
                            }
                          />
                          <label
                            htmlFor={`answer_${index + 1}_false`}
                            className="ms-2 text-xs font-medium text-gray-700"
                          >
                            Salah
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="submit"
                  className="text-white inline-flex items-center bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-xl space-x-2 text-sm px-5 py-2.5 text-center"
                >
                  <FontAwesomeIcon icon={faSave} />
                  <span>Simpan Perubahan</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {importModal && (
        <div
          tabIndex={-1}
          className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50"
        >
          <div className="relative p-4 w-full max-w-lg max-h-full">
            <div className="relative bg-white rounded-2xl shadow">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                <h3 className="text-lg font-semibold text-gray-900">
                  Import Soal
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setImportModal(!importModal);
                    setCountAnswer(0);
                  }}
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-xl text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </div>
              <form
                onSubmit={handleImport}
                accept=".xlsx, .xls"
                encType="multipart/form-data"
                className="p-4 md:p-5"
              >
                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-span-2">
                    <label
                      htmlFor="package_question_id"
                      className="block mb-2 text-xs font-medium text-gray-900"
                    >
                      Paket Soal
                    </label>
                    <select
                      name="package_question_id"
                      onChange={handleChange}
                      id="package_question_id"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    >
                      <option value="">Pilih</option>
                      {packageQuestions.length > 0 &&
                        packageQuestions.map((packageQuestion, index) => (
                          <option value={packageQuestion.id} key={index}>
                            {packageQuestion.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor="excel"
                      className="block mb-2 text-xs font-medium text-gray-900"
                    >
                      Excel
                    </label>
                    <input
                      type="file"
                      name="excel"
                      id="excel"
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    />
                  </div>
                  <div className="col-span-2">
                    <a
                      href={ExampleImportQuestion}
                      className="text-xs underline"
                      download="example-import-questions.xlsx"
                    >
                      Download Example Template
                    </a>
                  </div>
               
                <button
                  type="submit"
                  className="text-white inline-flex items-center bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-xl space-x-2 text-sm px-5 py-2.5 text-center"
                >
                  <FontAwesomeIcon icon={faSave} />
                  <span>Simpan</span>
                </button>

               </div>
              </form>
           
          </div>
        </div>
        </div>
      )}

      {openModalGrouping && (
        <ModalGrouping
          isOpen={openModalGrouping}
          setIsOpen={setOpenModalGrouping}
        />
      )}

      {viewModal && (
        <ModalViewQuestion
          id={getId}
          isOpen={viewModal}
          setIsOpen={setViewModal}
        />
      )}
    </main>
  );
};

export default Questions;