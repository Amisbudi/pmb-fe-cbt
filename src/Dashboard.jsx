import { useEffect, useState } from "react";
import TrisaktiLogo from "./assets/img/Logo-Usakti-White.png";
import AOS from "aos";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode'

const Dashboard = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);

  const getInfo = () => {
    try {
      const token = localStorage.getItem('CBTtrisakti:token');
      if (!token) {
        throw new Error('Token tidak ditemukan');
      }
      const decoded = jwtDecode(token);
      console.log(decoded);
      const data = {
        userId: 1,
      }
      getPackageQuestions(data);
    } catch (error) {
      console.log(error.message);
    }
  }

  const getPackageQuestions = async () => {
    try {
      const responsePackageQuestions = await axios.get(`http://localhost:3000/packagequestions`);
      const responseRecords = await axios.get(`http://localhost:3000/records`);

      const packageQuestions = responsePackageQuestions.data.data;
      const records = responseRecords.data;

      const filteredPackageQuestions = packageQuestions.filter((pq) => {
        return !records.some((record) => record.package_question_id === pq.id && record.user_id === 1);
      });

      setPackages(filteredPackageQuestions);
    } catch (error) {
      console.log(error.message);
    }
  }

  const checkAssesment = () => {
    const activePackage = localStorage.getItem('CBT:package');
    if (activePackage) {
      navigate('/assesment');
    }
  }

  const checkoutPackage = async (pkg) => {
    try {
      if (window.confirm(`Apakah anda yakin akan memulai tes ${pkg.name}?`)) {
        const activePackage = localStorage.getItem('CBT:package');
        if (activePackage) {
          navigate('/assesment');
        } else {
          const data = {
            package_question_id: pkg.id,
            user_id: 1,
          }
          const response = await axios.get(`http://localhost:3000/questionusers/questions/${data.package_question_id}/${data.user_id}`);
          if (!response.data.length > 0) {
            await axios.post(`http://localhost:3000/questionusers`, data);
          }
          localStorage.setItem('CBT:package', JSON.stringify(data));
          navigate('/assesment');
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleLogout = () => {
    if (window.confirm('Apakah anda yakin akan keluar?')) {
      const token = localStorage.getItem('CBTtrisakti:token');
      if (!token) {
        alert('Mohon maaf, token tidak valid!');
      } else {
        localStorage.removeItem('CBTtrisakti:token');
        navigate('/')
      }
    }
  }

  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: "ease-in-out",
    });
    getInfo();
    checkAssesment();
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
          <h2>Halo Nabila Azzahra</h2>
        </div>
        <div data-aos="fade-right" data-aos-offset="300" data-aos-delay="100">
          <p className="text-sm">Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis dolor esse accusantium, doloremque rerum non voluptates saepe distinctio reiciendis corrupti explicabo debitis eaque laborum ab rem odio ipsam sed ea. Accusantium ab illum commodi aliquam quos, fugiat cum doloribus, soluta nulla ipsam omnis blanditiis et voluptatem tempora. Dolorem, aut dolores!</p>
        </div>
        <div className="flex items-center gap-5 pt-4">
          <div className="mx-auto">
            <button type="button" data-aos="fade-right" onClick={handleLogout} className="bg-red-500 hover:bg-red-600 transition-all ease-in-out text-white w-28 text-sm font-bold rounded-xl flex gap-2 items-center justify-center px-4 py-2">
              <div className="flex items-center">Keluar</div>
              <div className="pt-1">
                <i className="fi fi-br-sign-in-alt w-1" />
              </div>
            </button>
          </div>
        </div>
      </div>
      <div className="w-full">
        {packages && packages.length > 0 ? (
          <div className="flex items-center justify-center flex-wrap">
            {packages.map((pkg, index) => (
              <button
                type="button"
                key={index}
                onClick={() => checkoutPackage(pkg)}
                className="block w-1/2 md:w-1/6 p-1"
                data-aos="fade-down"
                data-aos-delay={index + 1 * 200}
              >
                <span className="block text-gray-800 text-sm bg-white hover:bg-gray-100 font-medium p-5 rounded-2xl">
                  {pkg.name || `TPA ${index + 1}`}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-center text-sm underline"
            data-aos="fade-down"
            data-aos-delay={200}>Paket soal belum tersedia, silahkan hubungi panitia PMB.</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard
