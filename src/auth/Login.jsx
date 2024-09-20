import { useEffect, useState } from "react";
import TrisaktiLogo from "../../src/assets/img/Logo-Usakti-White.png";
import "aos/dist/aos.css";
import AOS from "aos";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode'
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faEye, faEyeSlash, faKey, faSignIn } from "@fortawesome/free-solid-svg-icons";

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    await axios.post(`https://dev-gateway.trisakti.ac.id/issueauth`, {
      username: formData.username,
      password: formData.password,
    })
      .then((response) => {
        const data = {
          expired: 86400,
          username: formData.username,
          received: Math.floor(Date.now() / 1000),
          token: response.data.token,
        }
        localStorage.setItem('CBTtrisakti:token', JSON.stringify(data));
        const decoded = jwtDecode(response.data.token);
        if (decoded.scopes[0] == 'admission-admin') {
          return navigate('/admin');
        }
        if (decoded.scopes[0] == 'admission-participant') {
          return navigate('/dashboard');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    AOS.init();
  }, []);
  return (
    <main className="bg-gradient-to-b from-[#005D99] to-[#005083]">
      <div className="max-w-lg mx-auto flex flex-col items-center justify-center gap-5 h-screen">
        <Link to={`/`}>
          <img src={TrisaktiLogo} className="w-28 md:w-32" alt="Universitas Trisakti" />
        </Link>
        <div className="w-full bg-white p-6 rounded-3xl">
          <form onSubmit={handleLogin}>
            <div className="mb-5">
              <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900">
                Username
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 rounded-s-xl">
                  <FontAwesomeIcon icon={faEnvelope} className="text-sky-900" />
                </span>
                <input
                  type="username"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="rounded-none rounded-e-xl bg-gray-100 text-gray-900 block flex-1 min-w-0 w-full text-sm p-2.5"
                  placeholder="Username"
                />
              </div>
            </div>
            <div className="mb-2">
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Kata Sandi
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 rounded-s-xl">
                  <FontAwesomeIcon icon={faKey} className="text-sky-900" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-gray-100 text-gray-900 block flex-1 min-w-0 w-full text-sm p-2.5"
                  placeholder="Password"
                />
                <span
                  onClick={togglePasswordVisibility}
                  className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 borderborder-sky-800 border-s-0 rounded-e-xl cursor-pointer"
                >
                  {showPassword ? (
                    <FontAwesomeIcon icon={faEyeSlash} className="text-sky-900" />
                  ) : (
                    <FontAwesomeIcon icon={faEye} className="text-sky-900" />
                  )}
                </span>
              </div>
            </div>
            <div className="w-full mt-5">
              <button type="submit" className="w-full bg-sky-700 hover:bg-sky-800 text-white text-sm rounded-xl px-5 py-2.5 space-x-1">
                <FontAwesomeIcon icon={faSignIn} />
                <span>Masuk</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default Login;
