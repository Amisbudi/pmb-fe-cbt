import TrisaktiLogo from "../src/assets/img/Logo-Usakti-White.png";
import LandingAnimation from "../src/assets/animation/landing.json";
import Lottie from "lottie-react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignIn } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";

const App = () => {
  const navigate = useNavigate();
  const LoginFunc = async () => {
    navigate("/login");
  };

  const getInfo = async () => {
    try {
      const token = localStorage.getItem("CBTtrisakti:token");
      if (token) {
        const authData = JSON.parse(token);
        const decoded = jwtDecode(authData.token);
        const currentTime = Math.floor(Date.now() / 1000);
        const tokenReceivedTime = authData.received;
        const expiredTime = authData.expired;
        if (currentTime - tokenReceivedTime >= expiredTime) {
          alert("Mohon maaf, sesi telah habis!");
          localStorage.removeItem("CBTtrisakti:token");
          navigate("/");
          throw new Error("Token sudah kedaluwarsa");
        }
        if (decoded.scopes[0] == "admission-admin") {
          return navigate("/admin");
        } else if (decoded.scopes[0] == "admission-participant") {
          return navigate("/dashboard");
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getInfo();
  }, []);

  return (
    <main className="bg-gradient-to-b from-[#005D99] to-[#005083]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-5 md:h-screen p-8 md:p-0">
        <section className="w-full md:w-1/2 space-y-5">
          <img
            src={TrisaktiLogo}
            className="w-24 md:w-28"
            alt="Universitas Trisakti"
          />
          <div className="space-y-2">
            <h4 className="text-base md:text-lg text-white font-medium">
              Tes CBT Universitas Trisakti
            </h4>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Solusi Ujian Berbasis Komputer yang Modern dan Efisien
            </h2>
          </div>
          <p className="text-white text-sm md:text-base">
            Selamat datang di platform resmi Computer Based Test (CBT)
            Universitas Trisakti! Aplikasi ini dirancang khusus untuk memudahkan
            pelaksanaan ujian berbasis komputer, baik bagi mahasiswa maupun
            dosen. Dengan fitur-fitur canggih, kemudahan akses, serta sistem
            yang aman dan terpercaya, kami berkomitmen untuk memberikan
            pengalaman ujian yang transparan dan efisien. Mulailah perjalanan
            akademis Anda dengan tes yang lebih mudah dan modern di sini.
          </p>
          <button
            onClick={LoginFunc}
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-2.5 rounded-xl text-sm space-x-2"
          >
            <FontAwesomeIcon icon={faSignIn} />
            <span>Masuk</span>
          </button>
        </section>
        <section className="w-full md:w-1/2 flex justify-end">
          <Lottie animationData={LandingAnimation} loop={true} />
        </section>
      </div>
    </main>
  );
};

export default App;
