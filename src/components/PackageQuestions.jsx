import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faPlusCircle,
  faSave,
  faTrashAlt,
  faXmark,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import axios from "axios";
import LoadingScreen from "./LoadingScreen";

const PackageQuestions = () => {
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [packageQuestions, setPackageQuestions] = useState([]);
  const [types, setTypes] = useState([]);
  const [paginations, setPaginations] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [limit, setLimit] = useState(0);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    id: "",
    type_id: "",
    name: "",
    status: false,
  });

  const getData = async (page = 1) => {
    setLoading(true);
    await axios
      .get(`https://be-cbt.trisakti.ac.id/packagequestions?page=${page}`, {
        headers: {
          "api-key": "b4621b89b8b68387",
        },
      })
      .then((response) => {
        setPackageQuestions(response.data.data);
        setCurrentPage(response.data.currentPage);
        setTotal(response.data.totalItems);
        setTotalPages(response.data.totalPages);
        setLimit(response.data.limit);
        const paginate = [];
        const maxButtons = 4;

        for (let i = 0; i < response.data.totalItems; i++) {
          if (i < 2) {
            paginate.push(
              <li key={i} className="hidden md:inline-block">
                <button
                  type="button"
                  onClick={() => getData(i + 1)}
                  className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 transition-all ease-in-out"
                >
                  {i + 1}
                </button>
              </li>,
            );
          }

          if (
            i === 2 &&
            response.data.totalItems > maxButtons &&
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

          if (response.data.totalItems > 10) {
            if (
              i === response.data.totalItems - 1 &&
              response.data.totalItems > maxButtons
            ) {
              paginate.push(
                <li key={i} className="hidden md:inline-block">
                  <button
                    type="button"
                    onClick={() => getData(response.data.totalPages)}
                    className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 transition-all ease-in-out"
                  >
                    {response.data.totalPages}
                  </button>
                </li>,
              );
            }
          }

          if (
            response.data.totalItems <= maxButtons &&
            i >= 2 &&
            i < response.data.totalItems - 1
          ) {
            paginate.push(
              <li key={i} className="hidden md:inline-block">
                <button
                  type="button"
                  onClick={() => getData(i + 1)}
                  className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 transition-all ease-in-out"
                >
                  {i + 1}
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

  const getTypes = async () => {
    await axios
      .get(`https://be-cbt.trisakti.ac.id/types`, {
        headers: {
          "api-key": "b4621b89b8b68387",
        },
      })
      .then((response) => {
        setTypes(response.data);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = (content) => {
    setFormData({
      id: content.id,
      type_id: content.type_id,
      name: content.name,
      status: content.status,
    });
    setEditModal(true);
  };

  const handleSave = async (e) => {
    setLoading(true);
    e.preventDefault();
    await axios
      .post(
        `https://be-cbt.trisakti.ac.id/packagequestions`,
        {
          type_id: formData.type_id,
          name: formData.name,
          status: true,
        },
        {
          headers: {
            "api-key": "b4621b89b8b68387",
          },
        },
      )
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
  };

  const handleUpdate = async (e) => {
    setLoading(true);
    e.preventDefault();
    await axios
      .patch(
        `https://be-cbt.trisakti.ac.id/packagequestions/${formData.id}`,
        {
          type_id: formData.type_id,
          name: formData.name,
          status: formData.status,
        },
        {
          headers: {
            "api-key": "b4621b89b8b68387",
          },
        },
      )
      .then((response) => {
        alert(response.data.message);
        setEditModal(false);
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
  };

  const handleDelete = async (id) => {
    if (confirm("Apakah yakin akan menghapus paket soal?")) {
      await axios
        .delete(`https://be-cbt.trisakti.ac.id/packagequestions/${id}`, {
          headers: {
            "api-key": "b4621b89b8b68387",
          },
        })
        .then((response) => {
          alert(response.data.message);
          getData();
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  };

  useEffect(() => {
    getTypes();
    getData();
  }, []);
  return loading ? (
    <LoadingScreen />
  ) : (
    <main className="w-full md:w-10/12 h-screen bg-gray-100 pt-10 px-4 md:px-8 overflow-auto pb-10">
      <div className="space-y-1">
        <h2 className="font-bold text-xl text-gray-900">Paket Soal</h2>
        <p className="text-sm text-gray-700">
          Di bawah ini adalah daftar paket soal. Anda dapat mengelola, menambahkan, atau mengubah paket soal yang tersedia.
        </p>
      </div>
      <section className="mt-5">
        <button
          type="button"
          onClick={() => setCreateModal(!createModal)}
          className="text-white bg-sky-700 hover:bg-sky-800 font-medium rounded-xl text-sm px-5 py-2.5 space-x-2 mb-5 text-center"
        >
          <FontAwesomeIcon icon={faPlusCircle} />
          <span>Tambah</span>
        </button>
        <div className="overflow-x-auto border rounded-2xl">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr className="border-b">
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
              {packageQuestions.length > 0 ? (
                packageQuestions.map((packageQuestion, index) => (
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
                    <td className="px-6 py-4">{packageQuestion.name}</td>
                    <td className="px-6 py-4">
                      {packageQuestion.type
                        ? packageQuestion.type.name
                        : "Type not found"}
                    </td>
                    <td className="px-6 py-4">
                      {packageQuestion.status ? (
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
                        onClick={() => handleEdit(packageQuestion)}
                        className="text-white bg-amber-500 hover:bg-amber-600 font-medium rounded-xl text-xs px-3 py-1.5 text-center"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(packageQuestion.id)}
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
                    onClick={() => getData(currentPage - 1)}
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
                      getData(
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
      {createModal && (
        <div
          tabIndex={-1}
          className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50"
        >
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-2xl shadow">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                <h3 className="text-lg font-semibold text-gray-900">
                  Tambah Paket Soal
                </h3>
                <button
                  type="button"
                  onClick={() => setCreateModal(!createModal)}
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-xl text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </div>
              <form onSubmit={handleSave} className="p-4 md:p-5">
                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-span-2">
                    <label
                      htmlFor="type_id"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Tipe Soal
                    </label>
                    <select
                      name="type_id"
                      onChange={handleChange}
                      id="type_id"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    >
                      <option value="">Pilih</option>
                      {types.length > 0 &&
                        types.map((type, index) => (
                          <option value={type.id} key={index}>
                            {type.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Nama Paket Soal
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                      placeholder="Type of package name"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="text-white inline-flex items-center bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-xl space-x-2 text-sm px-5 py-2.5 text-center"
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
          className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50"
        >
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-2xl shadow">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                <h3 className="text-lg font-semibold text-gray-900">
                  Edit Paket Soal
                </h3>
                <button
                  type="button"
                  onClick={() => setEditModal(!editModal)}
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-xl text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </div>
              <form onSubmit={handleUpdate} className="p-4 md:p-5">
                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-span-2">
                    <label
                      htmlFor="type_id"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Tipe Soal
                    </label>
                    <select
                      name="type_id"
                      value={formData.type_id}
                      onChange={handleChange}
                      id="type_id"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    >
                      {types.length > 0 &&
                        types.map((type, index) => (
                          <option value={type.id} key={index}>
                            {type.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Nama Paket Soal
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                      placeholder="Type of package name"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor="status"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      id="status"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    >
                      <option value="true">Aktif</option>
                      <option value="false">Tidak aktif</option>
                    </select>
                  </div>
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
    </main>
  );
};

export default PackageQuestions;
