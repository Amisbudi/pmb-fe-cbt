import { useEffect, useState } from "react";
import TrisaktiLogo from "./assets/img/Logo-Usakti-White.png";
import AOS from "aos";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import moment from "moment-timezone";

const Dashboard = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("...");
  const [packages, setPackages] = useState([]);

  const getInfo = async () => {
    try {
      const token = localStorage.getItem("CBTtrisakti:token");
      if (!token) {
        navigate("/");
        throw new Error("Token tidak ditemukan");
      }
      const authData = JSON.parse(token);
      const currentTime = Math.floor(Date.now() / 1000);
      const tokenReceivedTime = authData.received;
      const expiredTime = authData.expired;

      if (currentTime - tokenReceivedTime >= expiredTime) {
        alert("Mohon maaf, sesi telah habis!");
        localStorage.removeItem("CBTtrisakti:token");
        navigate("/");
        throw new Error("Token sudah kedaluwarsa");
      }

      const response = await axios.get(
        `https://api.trisakti.ac.id/d3b1b0f38e11d357db8a6ae20b09ff23?username=${authData.username}`,
        {
          headers: {
            Authorization: `Bearer ${authData.token}`,
          },
        },
      );
      setName(response.data.fullname);
      const decoded = jwtDecode(authData.token);
      if (decoded.scopes[0] == "admission-admin") {
        return navigate("/admin");
      }
      const data = {
        userId: response.data.identify_number,
      };
      getPackageQuestionUsers(data, response.data.identify_number);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getPackageQuestionUsers = async (data, identityNumber) => {
    try {
      const responsePackageQuestionUsers = await axios.get(
        `${import.meta.env.REACT_APP_API_BASE_URL}/packagequestionusers/user/${data.userId}`,
        {
          headers: {
            "api-key": "b4621b89b8b68387",
          },
        }
      );

      const responseRecords = await axios.get(`${import.meta.env.REACT_APP_API_BASE_URL}/records`, {
        headers: {
          "api-key": "b4621b89b8b68387",
        },
      });

      const packageQuestionUsers = responsePackageQuestionUsers.data;
      const records = responseRecords.data;

      const filteredPackageQuestions = packageQuestionUsers.filter((pq) => {
        const isAlreadyInRecords = records.some(
          (record) =>
            String(record.package_question_id) === String(pq.id) &&
            String(record.user_id) === String(identityNumber)
        );
        return !isAlreadyInRecords;
      });

      setPackages(filteredPackageQuestions);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const checkAssesment = () => {
    const activePackage = localStorage.getItem("CBT:package");
    if (activePackage) {
      navigate("/assesment");
    }
  };

  function isSameDate(date1, date2) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  const handleRequestUpdate = async (e) => {
    e.preventDefault();
    const dataId = e.target.getAttribute('data-id');
    await axios
      .get(
        `${import.meta.env.REACT_APP_API_BASE_URL}/packagequestionusers/request/${dataId}`,
        {
          headers: {
            "api-key": "b4621b89b8b68387",
          },
        },
      )
      .then((response) => {
        getInfo();
        alert(response.data.message);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const checkoutPackage = async (pkg) => {
    try {
      const today = new Date();
      if (pkg.classes == "Reguler") {
        const examDate = new Date(pkg.date_exam);
        if (examDate < today && isSameDate(examDate, today)) {
          if (
            window.confirm(
              `Apakah anda yakin akan memulai tes ${pkg.package ? pkg.package.name : "Package not found"}?`,
            )
          ) {
            const activePackage = localStorage.getItem("CBT:package");
            if (activePackage) {
              navigate("/assesment");
            } else {
              const data = {
                package_question_id: pkg.package_question_id,
                user_id: pkg.user_id,
                name: name,
              };
              const response = await axios.get(
                `${import.meta.env.REACT_APP_API_BASE_URL}/questionusers/questions/${data.package_question_id}/${data.user_id}`,
                {
                  headers: {
                    "api-key": "b4621b89b8b68387",
                  },
                },
              );
              if (!response.data?.length > 0) {
                await axios.post(`${import.meta.env.REACT_APP_API_BASE_URL}/questionusers`, data, {
                  headers: {
                    "api-key": "b4621b89b8b68387",
                  },
                });
              }
              localStorage.setItem("CBT:package", JSON.stringify(data));
              navigate("/assesment");
            }
          }
        } else {
          alert("Belum masuk jadwal!");
        }
      } else if (pkg.classes === "Employee") {
        const startDate = new Date(pkg.date_start);
        const endDate = new Date(pkg.date_end);

        if (today >= startDate && today <= endDate) {
          if (
            window.confirm(
              `Apakah anda yakin akan memulai tes ${pkg.package ? pkg.package.name : "Package not found"}?`,
            )
          ) {
            const activePackage = localStorage.getItem("CBT:package");
            if (activePackage) {
              navigate("/assesment");
            } else {
              const data = {
                package_question_id: pkg.package_question_id,
                user_id: pkg.user_id,
              };
              const response = await axios.get(
                `${import.meta.env.REACT_APP_API_BASE_URL}/questionusers/questions/${data.package_question_id}/${data.user_id}`,
                {
                  headers: {
                    "api-key": "b4621b89b8b68387",
                  },
                },
              );
              if (!response.data?.length > 0) {
                await axios.post(`${import.meta.env.REACT_APP_API_BASE_URL}/questionusers`, data, {
                  headers: {
                    "api-key": "b4621b89b8b68387",
                  },
                });
              }
              localStorage.setItem("CBT:package", JSON.stringify(data));
              navigate("/assesment");
            }
          }
        } else {
          alert("Tes tidak dalam rentang jadwal yang diperbolehkan!");
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Apakah anda yakin akan keluar?")) {
      const token = localStorage.getItem("CBTtrisakti:token");
      if (!token) {
        alert("Mohon maaf, token tidak valid!");
      } else {
        localStorage.removeItem("CBTtrisakti:token");
        navigate("/");
      }
    }
  };

  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: "ease-in-out",
    });
    getInfo();
    checkAssesment();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-gradient-to-b from-[#005D99] to-[#005083] h-screen flex flex-col justify-center items-center gap-10 p-12 text-white">
      <div className="w-full max-w-xl text-center space-y-2">
        <div className="px-3">
          <img
            src={TrisaktiLogo}
            className="w-28 mx-auto"
            data-aos="fade-right"
            data-aos-offset="300"
            alt="Logo-Usakti"
          />
        </div>
        <div
          className="font-bold text-3xl"
          data-aos="fade-right"
          data-aos-offset="300"
          data-aos-delay="100"
        >
          <h2>Halo {name}</h2>
        </div>
        <div data-aos="fade-right" data-aos-offset="300" data-aos-delay="100">
          <p className="text-sm">
            Ujian ini mewajibkan penggunaan kamera. Silakan ajukan permohonan di sini jika terjadi masalah dengan kamera Anda. Tetap semangat dan fokus pada tujuan! Setiap tantangan adalah kesempatan untuk menunjukkan kemampuan terbaik Anda.
          </p>
        </div>
        <div className="flex items-center gap-5 pt-4">
          <div className="mx-auto">
            <button
              type="button"
              data-aos="fade-right"
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 transition-all ease-in-out text-white w-28 text-sm font-bold rounded-xl flex gap-2 items-center justify-center px-4 py-2"
            >
              <div className="flex items-center">Keluar</div>
              <div className="pt-1">
                <i className="fi fi-br-sign-in-alt w-1" />
              </div>
            </button>
          </div>
        </div>
      </div>
      <section className="w-full">
        {packages && packages?.length > 0 ? (
          <div>
            <div className="flex flex-wrap justify-center items-start gap-3">
              {packages.map((pkg, index) => {
                const today = new Date();
                const isToday =
                  (pkg.classes === "Reguler" &&
                    pkg.date_exam &&
                    isSameDate(today, new Date(pkg.date_exam))) ||
                  (pkg.classes === "Employee" &&
                    pkg.date_start &&
                    pkg.date_end &&
                    today >= new Date(pkg.date_start) &&
                    today <= new Date(pkg.date_end));

                    // Jangan tampilkan jika bukan hari ini
                if (!isToday) return null;
                
                console.log('pkg', pkg)

                return (
                  <div
                    key={index}
                    className="w-1/8 p-1 space-y-2 flex flex-col justify-center"
                    data-aos="fade-down"
                    data-aos-delay={index + 1 * 200}
                  >
                    <button type="button" onClick={() => checkoutPackage(pkg)}>
                      <div className="w-full block text-gray-800 text-sm bg-white hover:bg-gray-100 font-medium p-5 space-y-2 rounded-2xl">
                        <h2 className="font-medium text-base">
                          {pkg.package ? pkg.package.name : "Package not found"}
                        </h2>
                        {pkg.classes === "Reguler" && pkg.date_exam && (
                          <p className="text-xs">
                            {moment.tz(pkg.date_exam, "Asia/Jakarta").format("DD-MM-YYYY")}{" "}{moment.tz(pkg.date_start, "Asia/Jakarta").format("HH:mm")}-{moment.tz(pkg.date_end, "Asia/Jakarta").format("HH:mm")}
                          </p>
                        )}
                        {pkg.classes === "Employee" &&
                          pkg.date_start &&
                          pkg.date_end && (
                            <p className="flex flex-col gap-2 text-xs">
                              <span>
                                {moment.tz(pkg.date_start, "Asia/Jakarta").format("lll")}
                              </span>
                              <span>
                                {moment.tz(pkg.date_end, "Asia/Jakarta").format("lll")}
                              </span>
                            </p>
                          )}
                      </div>
                    </button>

                    {pkg.request_camera && pkg.camera_status ? (
                      <span className="bg-sky-500 px-5 py-2 rounded-xl text-xs text-white">
                        Kamera sudah diajukan dan status aktif
                      </span>
                    ) : pkg.request_camera && !pkg.camera_status ? (
                      <button
                        type="button"
                        data-id={pkg.id}
                        onClick={handleRequestUpdate}
                        className="bg-orange-500 hover:bg-orange-600 px-5 py-2 rounded-xl text-xs text-white"
                      >
                        Kamera diajukan tapi status belum aktif
                      </button>
                    ) : !pkg.request_camera ? (
                      <button
                        type="button"
                        data-id={pkg.id}
                        onClick={handleRequestUpdate}
                        className="bg-emerald-500 hover:bg-emerald-600 px-5 py-2 rounded-xl text-xs text-white"
                      >
                        Ajukan kamera
                      </button>
                    ) : null}
                  </div>
                );
              })}
            </div>
            <p className="text-center text-sm mt-5">
              Kerjakan soal sesuai dengan jadwal yang ditetapkan.
            </p>
          </div>
        ) : (
          <p
            className="text-center text-sm underline"
            data-aos="fade-down"
            data-aos-delay={200}
          >
            Paket soal belum tersedia, silahkan hubungi panitia PMB.
          </p>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
