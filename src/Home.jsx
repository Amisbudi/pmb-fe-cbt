import { useEffect } from "react";
import TrisaktiLogo from "../src/assets/img/Logo-Usakti-White.png";
import AOS from "aos";

function Home() {
  useEffect(() => {
    AOS.init({
      duration: 500,
      easing: "ease-in-out",
    });
  }, []);
  return (
    <div className="bg-gradient-to-b from-[#005D99] to-[#005083] h-screen flex-col lg:flex-row lg:flex items-center justify-center p-12 text-white gap-10">
      <div className="w-full">
        <div>
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
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque
          similique ipsam eum amet veritatis accusamus possimus itaque
          repellendus illo sunt exercitationem autem enim quod repellat, eius
          distinctio ratione ex hic expedita ut nobis dolorem. Nemo rem at
          molestiae. Facilis repellendus autem odio. Consectetur odit blanditiis
          laudantium quis soluta quisquam, officiis expedita inventore, iusto
          magnam explicabo nostrum earum deserunt perspiciatis! Quisquam magnam
          a ab, enim non modi laborum, est ad illum ut cum magni animi incidunt
          molestiae? Ratione, ipsa. Optio veniam ut, velit doloremque ab
          blanditiis, aut dolor iste repellat quis repellendus? Alias corrupti
          iure vel ut vitae beatae quo veniam?
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
        <div className="grid grid-cols-3 w-full gap-2">
          <a
            href="#"
            className="bg-white h-44 rounded-3xl hover:bg-[#357097]  hover:text-white"
            data-aos="zoom-in"
          >
            <div className="border border-4 border-[#357097] hover:border-white m-6 h-32 rounded-3xl">
              <div className="flex items-center justify-center mt-8 text-3xl">
                <i className="fi fi-sr-member-list"></i>
              </div>
              <div className="flex items-center justify-center font-bold">
                DATA PRIBADI
              </div>
            </div>
          </a>
          <a
            href="#"
            className="bg-white h-44 rounded-3xl hover:bg-[#357097]  hover:text-white"
            data-aos="zoom-in"
          >
            <div className="border border-4 border-[#357097] hover:border-white m-6 h-32 rounded-3xl">
              <div className="flex items-center justify-center mt-8 text-3xl">
                <i className="fi fi-sr-users-alt"></i>
              </div>
              <div className="flex items-center justify-center font-bold">
                DATA ORANG TUA
              </div>
            </div>
          </a>
          <a
            href="#"
            className="bg-white h-44 rounded-3xl hover:bg-[#357097]  hover:text-white"
            data-aos="zoom-in"
          >
            <div className="border border-4 border-[#357097] hover:border-white m-6 h-32 rounded-3xl">
              <div className="flex items-center justify-center mt-8 text-3xl">
                <i className="fi fi-ss-book-open-reader"></i>
              </div>
              <div className="flex items-center justify-center font-bold">
                PROGRAM STUDI
              </div>
            </div>
          </a>
          <a
            href="#"
            className="bg-white h-44 rounded-3xl hover:bg-[#357097]  hover:text-white"
            data-aos="zoom-in"
          >
            <div className="border border-4 border-[#357097] hover:border-white m-6 h-32 rounded-3xl">
              <div className="flex items-center justify-center mt-8 text-3xl">
                <i className="fi fi-sr-folder-upload"></i>
              </div>
              <div className="flex items-center justify-center font-bold">
                UNGGAH BERKAS
              </div>
            </div>
          </a>
          <a
            href="#"
            className="bg-white h-44 rounded-3xl hover:bg-[#357097]  hover:text-white"
            data-aos="zoom-in"
          >
            <div className="border border-4 border-[#357097] hover:border-white m-6 h-32 rounded-3xl">
              <div className="flex items-center justify-center mt-8 text-3xl">
                <i className="fi fi-sr-trophy-star"></i>
              </div>
              <div className="flex items-center justify-center font-bold">
                PRESTASI
              </div>
            </div>
          </a>
          <a
            href="#"
            className="bg-white h-44 rounded-3xl hover:bg-[#357097]  hover:text-white"
            data-aos="zoom-in"
          >
            <div className="border border-4 border-[#357097] hover:border-white m-6 h-32 rounded-3xl">
              <div className="flex items-center justify-center mt-8 text-3xl">
                <i className="fi fi-ss-department-structure"></i>
              </div>
              <div className="flex items-center justify-center font-bold">
                ORGANISASI
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Home;
