import { useEffect, useState } from "react";
import TrisaktiLogo from "../../src/assets/img/Logo-Usakti-White.png";
import "aos/dist/aos.css";
import AOS from "aos";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode'
import axios from "axios";

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
      if(decoded.scopes[0] == 'admission-admin'){
        return navigate('/admin');
      }
      if(decoded.scopes[0] == 'admission-participant'){
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
    <div className="bg-gradient-to-b from-[#005D99] to-[#005083] h-screen flex-col lg:flex-row lg:flex items-center justify-center p-4">
      <div>
        <div className="flex items-center justify-center mt-[180px] lg:mt-0">
          <a href="/">
            <img
              src={TrisaktiLogo}
              className="lg:w-36 w-32 -ml-1 flex items-start"
              alt="Logo-Usakti"
              data-aos="zoom-in"
              data-aos-delay="50"
            />
          </a>
        </div>
        <div
          className="p-5 border-2 rounded-3xl mt-4 bg-white text-black lg:w-[600px] w-full"
          data-aos="fade-down"
          data-aos-easing="linear"
          data-aos-duration="800"
        >
          <form onSubmit={handleLogin}>
            <div className="mb-5">
              <label
                htmlFor="username"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Username
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-xl">
                  <i className="fi fi-sr-envelopes text-sky-800 mt-1" />
                </span>
                <input
                  type="username"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="rounded-none rounded-e-xl bg-gray-50 border border-sky-800 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5"
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
                <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-xl">
                  <i className="fi fi-sr-key text-sky-800 mt-1" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="rounded-none  bg-gray-50 border border-sky-800 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5"
                  placeholder="Password"
                />
                <span
                  onClick={togglePasswordVisibility}
                  className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 borderborder-sky-800 border-s-0 rounded-e-xl cursor-pointer"
                >
                  {showPassword ? (
                    <i className="fi fi-sr-eye-crossed text-sky-800 mt-1" />
                  ) : (
                    <i className="fi fi-sr-eye text-sky-800 mt-1" />
                  )}
                </span>
              </div>
            </div>
            <div className="text-sm mb-4">
              Apakah anda{" "}
              <a href="#" className="underline font-bold text-sky-800">
                lupa kata sandi?
              </a>
            </div>
            <div className="flex items-center gap-5">
              <div>
                <button type="submit" className="bg-sky-700 text-white w-28 text-sm font-bold rounded-xl flex gap-2 items-center justify-center px-4 py-2">
                  <div className="flex items-center">Masuk</div>
                  <div className="pt-1">
                    <i className="fi fi-br-sign-in-alt w-1" />
                  </div>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
