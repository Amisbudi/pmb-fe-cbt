import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
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
  const [openModalEssay, setOpenModalEssay] = useState(false)
  const [reloadData, setReloadData] = useState(0)
  const [toggleClearFilter, setToggleClearFilter] = useState(false)

  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    // user_id: "",
    // package_name: "",
    // type_of_question: "",
    start_date: "",
    end_date: "",
  });

  const getData = async (page = 1, filters = {}) => {
    setLoading(true);

    await axios
      .get(`${import.meta.env.VITE_APP_API_BASE_URL}/questionusers/results?page=${page}`, {
        headers: {
          "api-key": "b4621b89b8b68387",
        },
        params: { ...filters },
      })
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
            (i >= response.data.currentPage - 1 && i <= response.data.currentPage + 1) ||
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
        console.log(error);
      });
  };

  // const handleDelete = async (data) => {
  //   if (confirm("Apakah yakin akan menghapus riwayat pengerjaan soal?")) {
  //     await axios
  //       .delete(
  //         `${import.meta.env.VITE_APP_API_BASE_URL}/questionusers/results/${data.package_question_id}/${data.user_id}`,
  //         {
  //           headers: {
  //             "api-key": "b4621b89b8b68387",
  //           },
  //         },
  //       )
  //       .then((response) => {
  //         alert(response.data.message);
  //         getData();
  //       })
  //       .catch((error) => {
  //         console.log(error.message);
  //       });
  //   }
  // };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const applyFilters = () => {
    const formattedFilters = {
      ...filters,
      start_date: filters.start_date ? new Date(filters.start_date).toISOString() : null,
      end_date: filters.end_date ? new Date(filters.end_date).toISOString() : null,
    };
    getData(1, formattedFilters);
    setToggleClearFilter(true)
  };

  const resetFilters = () => {
    setFilters({ start_date: "", end_date: "" })
    getData(1)
    setToggleClearFilter(false)
  };

  useEffect(() => {
    getData();
  }, [reloadData]);

  return loading ? (
    <LoadingScreen />
  ) : (
    <main className="w-full md:w-10/12 h-screen bg-gray-100 pt-10 px-4 md:px-8 overflow-auto pb-10">
      <div className="space-y-1">
        <h2 className="font-bold text-xl text-gray-900">Hasil Ujian</h2>
        <p className="text-sm text-gray-700">
          Di bawah ini adalah hasil ujian Anda. Anda dapat melihat, atau meninjau kembali hasil dari setiap ujian yang telah diikuti.
        </p>
      </div>
        <section className="mt-5">
        
          <div className="mb-2">
            <div className="flex items-center gap-4">
              <span>Filter : </span>
              
              <div className="flex flex-col w-1/6">
              <label className="text-xs">Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  value={filters.start_date}
                  onChange={handleFilterChange}
                  className="border rounded-lg p-1"
                />
              </div>
                
              <div className="flex flex-col w-1/6">
                <label className="text-xs">End Date</label>
                <input
                  type="date"
                  name="end_date"
                  placeholder="End date"
                  value={filters.end_date}
                  onChange={handleFilterChange}
                  className="border rounded-lg p-1"
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
                  Nama Paket Soal
                </th>
                   
                <th scope="col" className="px-6 py-4">
                  Betul
                </th>
                <th scope="col" className="px-6 py-4">
                  Salah
                </th>
                <th scope="col" className="px-6 py-4">
                  Nilai
                </th>
                 
                  <th scope="col" className="px-6 py-4 rounded-tr-xl">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {results?.length > 0 ? (
                results.map((result, index) => (
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
                    <td className="px-6 py-4">{result.user_id}</td>
                    <td className="px-6 py-4">{result.fullname}</td>
                    <td className="px-6 py-4">{result.package_name}</td>
                    
                    <td className="px-6 py-4">{ result.type_of_question === 'Multiple choice' && result.correct_answers}</td>
                    <td className="px-6 py-4">{ result.type_of_question === 'Multiple choice' &&  result.incorrect_answers}</td>
                    <td className="px-6 py-4">
                      {result.type_of_question === 'Multiple choice' ?
                        ((result.correct_answers / result.total_questions) * 100).toFixed() : 
                        result.essay_image_result
                      }
                    </td>
                    
                    
                    <td className="px-6 py-4 flex flex-col md:flex-row gap-1">
                      {/* <button
                        type="button"
                        onClick={() => handleDelete(result)}
                        className="text-white bg-red-600 hover:bg-red-700 font-medium rounded-xl text-xs px-3 py-1.5 text-center"
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </button> */}

                      {result?.type_of_question === 'Essay' && (
                        <button
                          type="button"
                          className="text-white bg-blue-700 hover:bg-blue-900 font-medium rounded-xl text-xs px-3 py-1.5 text-center"
                          onClick={() => {
                            setOpenModalEssay(true)
                          }}
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
