import { useEffect, useState } from "react";
import TrisaktiLogo from "./assets/img/Logo-Usakti-White.png";
import AOS from "aos";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);

  const getPackageQuestions = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/packagequestions`);
      setPackages(response.data);
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

  const checkoutPackage = async (id) => {
    try {
      const activePackage = localStorage.getItem('CBT:package');
      if (activePackage) {
        navigate('/assesment');
      } else {
        const data = {
          package_question_id: id,
          user_id: 1,
        }
        localStorage.setItem('CBT:package', JSON.stringify(data));
        const response = await axios.post(`http://localhost:3000/questionusers`, data);
        navigate('/assesment');
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    AOS.init({
      duration: 500,
      easing: "ease-in-out",
    });
    getPackageQuestions();
    checkAssesment();
  }, []);
  return (
    <div className="bg-gradient-to-b from-[#005D99] to-[#005083] h-screen flex-col lg:flex-row lg:flex items-center justify-center p-12 text-white gap-10">
      <div className="w-full">
        <div className="px-3">
          <img
            src={TrisaktiLogo}
            className="lg:w-36 w-32 -ml-2 flex items-start"
            data-aos="fade-right"
            data-aos-offset="300"
            alt="Logo-Usakti"
          />
        </div>
        <div
          className="font-bold text-[30px]"
          data-aos="fade-right"
          data-aos-offset="300"
          data-aos-delay="100"
        >
          Hallo Nabila Azzahra <span className="text-[35px]">🙌</span>
        </div>
        <div data-aos="fade-right" data-aos-offset="300" data-aos-delay="100">
          <p className="text-sm">Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque
            similique ipsam eum amet veritatis accusamus possimus itaque
            repellendus illo sunt exercitationem autem enim quod repellat, eius
            distinctio ratione ex hic expedita ut nobis dolorem. Nemo rem at
            molestiae. Facilis repellendus autem odio. Consectetur odit blanditiis
            laudantium quis soluta quisquam, officiis expedita inventore, iusto
            magnam explicabo nostrum earum deserunt perspiciatis! Quisquam magnam
            a ab, enim non modi laborum, est ad illum ut cum magni animi incidunt
            molestiae? Ratione, ipsa. Optio veniam ut, velit doloremque ab
            blanditiis, aut dolor iste repellat quis repellendus? Alias corrupti
            iure vel ut vitae beatae quo veniam?</p>
        </div>
        <div
          className="flex items-center gap-5 pt-4"
          data-aos="fade-down"
          data-aos-duration="1000"
        >
          <div>
            <button className="bg-red-500 text-white w-28 text-sm font-bold rounded-xl flex gap-2 items-center justify-center px-4 py-2">
              <div className="flex items-center">Keluar</div>
              <div className="pt-1">
                <i className="fi fi-br-sign-in-alt w-1" />
              </div>
            </button>
          </div>
        </div>
      </div>
      <div className="w-full text-black">
        {packages && packages.length > 0 ? (
          <div className="grid grid-cols-3 w-full gap-2">
            {packages.map((pkg, index) => (
              <button
                type="button"
                key={index}
                onClick={() => checkoutPackage(pkg.id)}
                className="bg-white hover:bg-gray-100 font-medium p-5 rounded-2xl"
              >
                {pkg.name || `TPA ${index + 1}`}
              </button>
            ))}
          </div>
        ) : (
          <p>Tidak ada package</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard
