import { useEffect, useState } from "react";
import TrisaktiLogo from "../../src/assets/img/Logo-Usakti-White.png";
import "aos/dist/aos.css";
import AOS from "aos";
import { useNavigate } from "react-router-dom";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };
  const HomeFunc = async () => {
    navigate('/dashboard');
  };
  useEffect(() => {
    AOS.init();
  }, []);
  return (
    <div className="bg-gradient-to-b from-[#005D99] to-[#005083] h-screen flex-col lg:flex-row lg:flex items-center justify-center p-4">
      <div>
        {/* <div className="flex items-center justify-center mt-[180px] lg:mt-0">
          <a href="/">
            <img
              src={TrisaktiLogo}
              className="lg:w-36 w-32 -ml-1 flex items-start"
              alt="Logo-Usakti"
              data-aos="zoom-in"
              data-aos-delay="50"
            />
          </a>
        </div> */}
        <div
          className="p-5 border border-2 rounded-3xl mt-4 bg-white text-black lg:w-[600px] w-full"
          data-aos="fade-down"
          data-aos-easing="linear"
          data-aos-duration="800"
        >
          <div>
            <div className="mb-5">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                Email
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-2 border-sky-800 border-e-0 border-gray-300 rounded-s-xl dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                  <i className="fi fi-sr-envelopes text-sky-800 mt-1" />
                </span>
                <input
                  type="email"
                  id="email"
                  className="rounded-none rounded-e-xl bg-gray-50 border border-2 border-sky-800 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Email"
                />
              </div>
            </div>
            <div className="mb-2">
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                Kata Sandi
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-2 border-sky-800 border-e-0 border-gray-300 rounded-s-xl dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                  <i className="fi fi-sr-key text-sky-800 mt-1" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="rounded-none  bg-gray-50 border border-2 border-sky-800 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Password"
                />
                <span
                  onClick={togglePasswordVisibility}
                  className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-2 border-sky-800 border-s-0 border-gray-300 rounded-e-xl cursor-pointer dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600"
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
                <button  onClick={HomeFunc} className="bg-sky-700 text-white w-28 text-sm font-bold rounded-xl flex gap-2 items-center justify-center px-4 py-2">
                  <div className="flex items-center">Masuk</div>
                  <div className="pt-1">
                    <i className="fi fi-br-sign-in-alt w-1" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
