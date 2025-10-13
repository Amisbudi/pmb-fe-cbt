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
  const [limit, setLimit] = useState(0);
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
  const getData = async (page = 1, customFilters) => {
    setLoading(true);

    const activeFilters = customFilters || filtersToSend;
    const { start_date, end_date } = activeFilters;
    const params = {
      limit: 15,
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
        const maxButtons = 3;

        for (let i = 0; i < response.data.totalPages; i++) {
          const isActive = i + 1 === response.data.currentPage;

          if (
            i < 2 ||
            (i >= response.data.currentPage - 1 &&
              i <= response.data.currentPage + 1) ||
            i === response.data.totalPages - 1
          ) {
            paginate.push(
              <li key={i} className="hidden md:inline-block">
                <button
                  type="button"
                  onClick={() => getData(i + 1)}
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
        console.error(error);
        setLoading(false);
      });
  };

  // Apply / Reset filter
  const applyFilters = () => {
    setToggleClearFilter(true);
    getData(1, filtersToSend);
  };

  const resetFilters = () => {
    setFiltersToSend({ start_date: "", end_date: "" });
    setDisplayFilters({ start_date: "", end_date: "" });
    setToggleClearFilter(false);
    getData(1, {});
  };

  // Load pertama kali
  useEffect(() => {
    getData(1);
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
        <div className="mb-2">
          <div className="flex items-center gap-4">
            <span>Filter :</span>

            {/* Start Date */}
            <div className="flex flex-col w-1/6 relative">
              <label className="text-xs">Start Date</label>
              <input
                type="text"
                name="start_date"
                placeholder="dd/mm/yyyy"
                value={displayFilters.start_date}
                readOnly
                onClick={() =>
                  document.getElementById("start_date_picker").showPicker()
                }
                className="border rounded-lg p-1 cursor-pointer bg-white"
              />
              <FontAwesomeIcon icon={faCalendarAlt} className="absolute right-2 top-6 opacity-50"/> 
              <input
                id="start_date_picker"
                type="date"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => {
                  const iso = e.target.value; // yyyy-mm-dd
                  const [y, m, d] = iso.split("-");
                  const display = `${d}/${m}/${y}`;
                  setFiltersToSend((prev) => ({ ...prev, start_date: iso }));
                  setDisplayFilters((prev) => ({ ...prev, start_date: display }));
                }}
              />
            </div>

            {/* End Date */}
            <div className="flex flex-col w-1/6 relative">
              <label className="text-xs">End Date</label>
              <input
                type="text"
                name="end_date"
                placeholder="dd/mm/yyyy"
                value={displayFilters.end_date}
                readOnly
                onClick={() =>
                  document.getElementById("end_date_picker").showPicker()
                }
                className="border rounded-lg p-1 cursor-pointer bg-white"
              />
              <FontAwesomeIcon icon={faCalendarAlt} className="absolute right-2 top-6 opacity-50"/> 
              <input
                id="end_date_picker"
                type="date"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => {
                  const iso = e.target.value; // yyyy-mm-dd
                  const [y, m, d] = iso.split("-");
                  const display = `${d}/${m}/${y}`;
                  setFiltersToSend((prev) => ({ ...prev, end_date: iso }));
                  setDisplayFilters((prev) => ({ ...prev, end_date: display }));
                }}
              />
              
            </div>

            <button
              type="button"
              onClick={applyFilters}
              className="bg-blue-500 text-white px-4 py-1 rounded-lg"
            >
              Apply
            </button>

            {toggleClearFilter && (
              <button
                type="button"
                onClick={resetFilters}
                className="bg-gray-500 text-white px-4 py-1 rounded-lg"
              >
                Reset
              </button>
            )}
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
            <nav className="flex items-center justify-between p-5 bg-white">
              <span className="text-sm font-normal text-gray-500">
                Saat ini terdapat{" "}
                <span className="font-bold text-gray-700">{total}</span> data.
              </span>
              <ul className="inline-flex -space-x-px text-sm h-8">
                <li>
                  <button
                    type="button"
                    onClick={() => getData(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center justify-center px-3 h-8 text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
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
                          : currentPage + 1
                      )
                    }
                    className="flex items-center justify-center px-3 h-8 text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700"
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
