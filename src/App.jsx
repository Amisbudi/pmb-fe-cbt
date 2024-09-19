// import React from "react";
import TrisaktiLogo from "../src/assets/img/Logo-Usakti-White.png";
import LandingAnimation from "../src/assets/animation/landing.json";
import Lottie from "lottie-react";
import { useNavigate } from 'react-router-dom';

function App(){
  const navigate = useNavigate();
  const LoginFunc = async () => {
    navigate('/login');
  };

  return (
    <div className="bg-gradient-to-b from-[#005D99] to-[#005083] lg:h-screen flex-col lg:flex-row lg:flex items-center justify-center lg:gap-48 p-4">
      <div>
        <div>
          <img
            src={TrisaktiLogo}
            className="lg:w-36 w-28 lg:-ml-3 flex items-start ml-36 mt-[135px] lg:mt-0"
            alt="Logo-Usakti"
          />
        </div>
        <div className="text-white mt-6 flex items-start lg:text-[35px] text-[25px] text-wrap font-bold lg:w-[550px] w-full">
          Computer Based Test Kampus
        </div>
        <div className="text-white mt-1 flex items-start lg:text-[17px] text-md text-wrap lg:w-[550px] w-full">
          Wujudkan Aspirasi dan Cita-Citamu dengan Pendidikan Berkualitas!
          Bergabunglah dengan kampus, tempat di mana ilmu
          pengetahuan, inovasi, dan kepemimpinan berpadu untuk menciptakan
          generasi unggul.
        </div>
        <div className="flex gap-5">
          <button
            onClick={LoginFunc}
            className="mt-4 bg-black p-2 w-52 flex items-center justify-center rounded-xl text-white hover:bg-white hover:text-black hover:border hover:border-2 hover:border-black"
          >
            <i className="fi fi-br-sign-in-alt mr-2"></i>
            Masuk
          </button>
        </div>
      </div>
      <div className="">
        <Lottie animationData={LandingAnimation} loop={true} className='' />
      </div>
    </div>
  );
};

export default App;
