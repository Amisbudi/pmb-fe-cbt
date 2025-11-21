/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import LoadingScreen from "./LoadingScreen";
import { ModalActionValue } from "./Modal/ModalActionValue";

const Results = () => {
  const [results, setResults] = useState([]);
  const [paginations, setPaginations] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [openModalEssay, setOpenModalEssay] = useState(false);
  const [reloadData, setReloadData] = useState(0);
  const [toggleClearFilter, setToggleClearFilter] = useState(false);
  const [loading, setLoading] = useState(true);

  // state untuk tanggal
  const [filtersToSend, setFiltersToSend] = useState({
    start_date: "",
    end_date: "",
  });

  const [displayFilters, setDisplayFilters] = useState({
    start_date: "",
    end_date: "",
  });

  // ambil data
  const getData = async (page = 1, customFilters = null, perPage = limit) => {
    setLoading(true);

    const activeFilters = customFilters !== null ? customFilters : filtersToSend;
    const { start_date, end_date } = activeFilters;
    const params = {
      limit: perPage,
      ...(start_date ? { start_date } : {}),
      ...(end_date ? { end_date } : {}),
    };

    await axios
      .get(
        `${import.meta.env.VITE_APP_API_BASE_URL}/questionusers/results?page=${page}`,
        {
          headers: { "api-key": "b4621b89b8b68387" },
          params,
        }
      )
      .then((response) => {
        setResults(response.data.data);
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
                  onClick={() => getData(pageNumber, activeFilters, perPage)}
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
                    onClick={() => getData(response.data.totalPages, activeFilters, perPage)}
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
                  onClick={() => getData(pageNumber, activeFilters, perPage)}
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
        console.error(error);
        setLoading(false);
      });
  };

  const handleLimitChange = (e) => {
    const newLimit = parseInt(e.target.value);
    setLimit(newLimit);
    getData(1, filtersToSend, newLimit);
  };

  // Apply / Reset filter
  const applyFilters = () => {
    if (!filtersToSend.start_date && !filtersToSend.end_date) {
      alert("Please select at least one date filter");
      return;
    }
    
    if (filtersToSend.start_date && filtersToSend.end_date) {
      if (new Date(filtersToSend.start_date) > new Date(filtersToSend.end_date)) {
        alert("Start date cannot be greater than end date");
        return;
      }
    }

    setToggleClearFilter(true);
    getData(1, filtersToSend, limit);
  };

  const resetFilters = () => {
    setFiltersToSend({ start_date: "", end_date: "" });
    setDisplayFilters({ start_date: "", end_date: "" });
    setToggleClearFilter(false);
    getData(1, { start_date: "", end_date: "" }, limit);
  };

  // Load pertama kali
  useEffect(() => {
    getData(1, { start_date: "", end_date: "" }, limit);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadData]);

  // ---------- Render ----------
  if (loading) return <LoadingScreen />;

  return (
    <main className="w-full md:w-10/12 h-screen bg-gray-100 pt-10 px-4 md:px-8 overflow-auto pb-10">
      <div className="space-y-1">
        <h2 className="font-bold text-xl text-gray-900">Hasil Ujian</h2>
        <p className="text-sm text-gray-700">
          Di bawah ini adalah hasil ujian Anda. Anda dapat melihat, atau
          meninjau kembali hasil dari setiap ujian yang telah diikuti.
        </p>
      </div>

      <section className="mt-5">
        <div className="mb-4">
          <div className="flex flex-col lg:flex-row lg:items-end gap-4">
            <span className="font-medium text-gray-700">Filter :</span>

            {/* Start Date */}
            <div className="flex flex-col w-full lg:w-48 relative">
              <label className="text-xs mb-1 font-medium text-gray-700">Start Date</label>
              <div className="relative">
                <input
                  type="text"
                  name="start_date"
                  placeholder="dd/mm/yyyy"
                  value={displayFilters.start_date}
                  readOnly
                  onClick={() => {
                    const picker = document.getElementById("start_date_picker");
                    if (picker) picker.showPicker();
                  }}
                  className="w-full border border-gray-300 rounded-lg p-2 pr-10 cursor-pointer bg-white hover:border-blue-400 transition-all"
                />
                <FontAwesomeIcon 
                  icon={faCalendarAlt} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                /> 
                <input
                  id="start_date_picker"
                  type="date"
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  value={filtersToSend.start_date}
                  onChange={(e) => {
                    const iso = e.target.value; // yyyy-mm-dd
                    if (iso) {
                      const [y, m, d] = iso.split("-");
                      const display = `${d}/${m}/${y}`;
                      setFiltersToSend((prev) => ({ ...prev, start_date: iso }));
                      setDisplayFilters((prev) => ({ ...prev, start_date: display }));
                    }
                  }}
                />
              </div>
            </div>

            {/* End Date */}
            <div className="flex flex-col w-full lg:w-48 relative">
              <label className="text-xs mb-1 font-medium text-gray-700">End Date</label>
              <div className="relative">
                <input
                  type="text"
                  name="end_date"
                  placeholder="dd/mm/yyyy"
                  value={displayFilters.end_date}
                  readOnly
                  onClick={() => {
                    const picker = document.getElementById("end_date_picker");
                    if (picker) picker.showPicker();
                  }}
                  className="w-full border border-gray-300 rounded-lg p-2 pr-10 cursor-pointer bg-white hover:border-blue-400 transition-all"
                />
                <FontAwesomeIcon 
                  icon={faCalendarAlt} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                /> 
                <input
                  id="end_date_picker"
                  type="date"
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  value={filtersToSend.end_date}
                  onChange={(e) => {
                    const iso = e.target.value; // yyyy-mm-dd
                    if (iso) {
                      const [y, m, d] = iso.split("-");
                      const display = `${d}/${m}/${y}`;
                      setFiltersToSend((prev) => ({ ...prev, end_date: iso }));
                      setDisplayFilters((prev) => ({ ...prev, end_date: display }));
                    }
                  }}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={applyFilters}
                className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg transition-all font-medium"
              >
                Apply Filter
              </button>

              {toggleClearFilter && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg transition-all font-medium"
                >
                  Reset Filter
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 lg:ml-auto">
              <label htmlFor="limit" className="text-sm text-gray-700 whitespace-nowrap font-medium">
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
        </div>

        <div className="overflow-x-auto border rounded-2xl">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr className="border-b">
                <th className="px-6 py-4 rounded-tl-xl">No.</th>
                <th className="px-6 py-4">User ID</th>
                <th className="px-6 py-4">Nama Lengkap</th>
                <th className="px-6 py-4">Nama Paket Soal</th>
                <th className="px-6 py-4">Betul</th>
                <th className="px-6 py-4">Salah</th>
                <th className="px-6 py-4">Nilai</th>
                <th className="px-6 py-4 rounded-tr-xl">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {results?.length > 0 ? (
                results.map((result, index) => (
                  <tr key={index} className="odd:bg-white even:bg-gray-50 border-b">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {limit * (currentPage - 1) + index + 1}
                    </td>
                    <td className="px-6 py-4">{result.user_id}</td>
                    <td className="px-6 py-4">{result.fullname}</td>
                    <td className="px-6 py-4">{result.package_name}</td>
                    <td className="px-6 py-4">
                      {result.type_of_question === "Multiple choice" &&
                        result.correct_answers}
                    </td>
                    <td className="px-6 py-4">
                      {result.type_of_question === "Multiple choice" &&
                        result.incorrect_answers}
                    </td>
                    <td className="px-6 py-4">
                      {result.type_of_question === "Multiple choice"
                        ? (
                            (result.correct_answers / result.total_questions) *
                            100
                          ).toFixed()
                        : result.essay_image_result}
                    </td>
                    <td className="px-6 py-4 flex flex-col md:flex-row gap-1">
                      {result?.type_of_question === "Essay" && (
                        <button
                          type="button"
                          className="text-white bg-blue-700 hover:bg-blue-900 font-medium rounded-xl text-xs px-3 py-1.5 text-center"
                          onClick={() => setOpenModalEssay(true)}
                        >
                          <FontAwesomeIcon icon={faPencilAlt} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="bg-white">
                  <td colSpan={8} className="px-6 py-4 text-center">
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
                    onClick={() => getData(currentPage - 1, filtersToSend, limit)}
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
                        filtersToSend,
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

      {openModalEssay && (
        <ModalActionValue
          isOpen={openModalEssay}
          setIsOpen={setOpenModalEssay}
          data={results}
          reloadData={reloadData}
          setReloadData={setReloadData}
        />
      )}
    </main>
  );
};

export default Results;