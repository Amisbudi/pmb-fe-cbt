import { useEffect, useState } from "react";
import axios from "axios";
import LoadingScreen from "./LoadingScreen";

const RequestCamera = () => {
  const [packageQuestions, setPackageQuestions] = useState([]);
  const [paginations, setPaginations] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(true);

  const getData = async (page = 1, perPage = limit) => {
    setLoading(true);
    await axios
      .get(`${import.meta.env.VITE_APP_API_BASE_URL}/packagequestionusers/requestcamera?page=${page}&limit=${perPage}`, {
        headers: {
          "api-key": "b4621b89b8b68387",
        },
      })
      .then((response) => {
        console.log(response.data);
        setPackageQuestions(response.data.data);
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
        console.log(error);
      });
  };

  const handleLimitChange = (e) => {
    const newLimit = parseInt(e.target.value);
    setLimit(newLimit);
    getData(1, newLimit);
  };

  const handleCameraUpdate = async (e) => {
    setLoading(true);
    e.preventDefault();
    const dataId = e.target.getAttribute('data-id');
    await axios
      .get(
        `${import.meta.env.VITE_APP_API_BASE_URL}/packagequestionusers/camera/${dataId}`,
        {
          headers: {
            "api-key": "b4621b89b8b68387",
          },
        },
      )
      .then((response) => {
        alert(response.data.message);
        getData(currentPage, limit);
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

  useEffect(() => {
    getData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return loading ? (
    <LoadingScreen />
  ) : (
    <main className="w-full md:w-10/12 h-screen bg-gray-100 pt-10 px-4 md:px-8 overflow-auto pb-10">
      <div className="space-y-1">
        <h2 className="font-bold text-xl text-gray-900">Request Kamera</h2>
        <p className="text-sm text-gray-700">
          Di bawah ini adalah menu pengelolaan permintaan kamera. Anda dapat memantau status, atau mengelola permintaan kamera yang telah diajukan.
        </p>
      </div>
      <section className="mt-5">
        <div className="flex items-center justify-end mb-5">
          <div className="flex items-center gap-3">
            <label htmlFor="limit" className="text-sm text-gray-700 whitespace-nowrap">
              Tampilkan:
            </label>
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
                  User ID
                </th>
                <th scope="col" className="px-6 py-4">
                  Nama Lengkap
                </th>
                <th scope="col" className="px-6 py-4">
                  Paket Soal
                </th>
                <th scope="col" className="px-6 py-4 rounded-tr-xl">
                  Kamera
                </th>
              </tr>
            </thead>
            <tbody>
              {packageQuestions?.length > 0 ? (
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
                    <td className="px-6 py-4">{packageQuestion.user_id}</td>
                    <td className="px-6 py-4">
                      {packageQuestion.participant
                        ? packageQuestion.participant.fullname
                        : "Name not found"}</td>
                    <td className="px-6 py-4">
                      {packageQuestion.package
                        ? packageQuestion.package.name
                        : "Package not found"}
                    </td>
                    <td className="px-6 py-4 space-x-2">
                      {packageQuestion.camera_status ? (
                        <button type="button" data-id={packageQuestion.id} onClick={handleCameraUpdate} className="bg-emerald-500 hover:bg-emerald-600 px-4 py-2 text-xs text-white rounded-lg">Akses Kamera Diizinkan</button>
                      ) : (
                        <button type="button" data-id={packageQuestion.id} onClick={handleCameraUpdate} className="bg-red-500 hover:bg-red-600 px-4 py-2 text-xs text-white rounded-lg">Akses Kamera Belum Diizinkan</button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="bg-white">
                  <td colSpan={5} className="px-6 py-4 text-center">
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
    </main>
  );
};

export default RequestCamera;