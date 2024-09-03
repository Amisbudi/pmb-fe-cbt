import { useRef, useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import TrisaktiLogo from "../assets/img/logo-lp3i-putih.svg";

const Assesment = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d'); // Mendapatkan context dari canvas
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height); // Menggambar frame dari video ke canvas
      const imageDataURL = canvasRef.current.toDataURL('image/png');
      setCapturedImage(imageDataURL);
    }
  };

  useEffect(() => {
    // Fungsi untuk meminta izin akses kamera
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true }); // Mengaktifkan kamera
        if (videoRef.current) {
          videoRef.current.srcObject = stream; // Menetapkan stream ke elemen video
        }
      } catch (error) {
        console.error('Error accessing the camera:', error); // Menangani kesalahan jika terjadi
      }
    };

    startCamera(); // Memulai kamera saat komponen dimount

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        // Menghentikan stream saat komponen di-unmount
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);
  return (
    <main className='h-screen bg-gray-100 flex md:py-10'>
      <div className='max-w-7xl mx-auto flex flex-col md:flex-row items-center md:gap-5'>
        <section className='order-2 md:order-1 w-full md:w-9/12 bg-white shadow-md p-10 h-full md:rounded-3xl'>
          <div className='space-y-8'>
            <p className='text-gray-900'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi recusandae officiis fugiat provident molestiae assumenda nobis, rerum deleniti quam eos id dicta vel eius ducimus tempore ut veritatis dolores. Illum et ab sit reprehenderit ad porro dolor, praesentium quod est culpa laudantium minus quasi sapiente similique tempore aliquam non tenetur? Repellat?</p>
            <div className='space-y-2'>
              <div className="flex items-center ps-4 border border-gray-200 hover:bg-gray-50 transition ease-in-out rounded-2xl">
                <input id="bordered-radio-1" type="radio" defaultValue name="bordered-radio" className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded-2xl focus:ring-emerald-500" />
                <label htmlFor="bordered-radio-1" className="w-full py-4 ms-2 text-sm font-medium text-gray-900">Default radio 1</label>
              </div>
              <div className="flex items-center ps-4 border border-gray-200 hover:bg-gray-50 transition ease-in-out rounded-2xl">
                <input id="bordered-radio-2" type="radio" defaultValue name="bordered-radio" className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded-2xl focus:ring-emerald-500" />
                <label htmlFor="bordered-radio-2" className="w-full py-4 ms-2 text-sm font-medium text-gray-900">Default radio 2</label>
              </div>
              <div className="flex items-center ps-4 border border-gray-200 hover:bg-gray-50 transition ease-in-out rounded-2xl">
                <input id="bordered-radio-3" type="radio" defaultValue name="bordered-radio" className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded-3xl focus:ring-emerald-500" />
                <label htmlFor="bordered-radio-3" className="w-full py-4 ms-2 text-sm font-medium text-gray-900">Default radio 3</label>
              </div>
              <div className="flex items-center ps-4 border border-gray-200 hover:bg-gray-50 transition ease-in-out rounded-2xl">
                <input id="bordered-radio-4" type="radio" defaultValue name="bordered-radio" className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded-3xl focus:ring-emerald-500" />
                <label htmlFor="bordered-radio-4" className="w-full py-4 ms-2 text-sm font-medium text-gray-900">Default radio 4</label>
              </div>
            </div>
            <div className='flex justify-center md:justify-start items-center gap-3'>
              <button type='button' className='bg-gray-100 hover:bg-gray-300 text-gray-400 transition-all ease-in-out w-10 h-10 rounded-full'>
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              <button type='button' className='bg-sky-500 hover:bg-sky-600 text-white transition-all ease-in-out w-10 h-10 rounded-full'>
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          </div>
        </section>
        <section className='order-1 md:order-2 w-full md:w-3/12 bg-sky-700 shadow-md p-8 h-full md:rounded-3xl'>
          <div className='flex flex-col gap-5'>
            <div className='h-full  flex flex-col items-center gap-4'>
              <img
                src={TrisaktiLogo}
                // className="h-20"
                className="h-12"
                alt="Logo-Usakti"
              />
              <h5 className='w-full text-center font-bold text-md rounded-2xl py-2.5 text-white border-2 border-sky-600'>00:30:32</h5>
            </div>
            <div className='h-full grid grid-cols-5 md:grid-cols-4 gap-2 overflow-y-auto'>
              <button type='button' className='bg-gray-100 text-sky-800 hover:text-white flex items-center justify-center py-2 rounded-xl hover:bg-sky-700 transition-all ease-in-out border-2 font-bold border-sky-600'>1</button>
              <button type='button' className='bg-emerald-500 text-white flex items-center justify-center py-2 rounded-xl hover:bg-emerald-400 transition-all ease-in-out border-2 font-bold border-emerald-600'>2</button>
              <button type='button' className='bg-emerald-500 text-white flex items-center justify-center py-2 rounded-xl hover:bg-emerald-400 transition-all ease-in-out border-2 font-bold border-emerald-600'>3</button>
              <button type='button' className='bg-gray-100 text-sky-800 hover:text-white flex items-center justify-center py-2 rounded-xl hover:bg-sky-700 transition-all ease-in-out border-2 font-bold border-sky-600'>4</button>
              <button type='button' className='bg-gray-100 text-sky-800 hover:text-white flex items-center justify-center py-2 rounded-xl hover:bg-sky-700 transition-all ease-in-out border-2 font-bold border-sky-600'>5</button>
              <button type='button' className='bg-emerald-500 text-white flex items-center justify-center py-2 rounded-xl hover:bg-emerald-400 transition-all ease-in-out border-2 font-bold border-emerald-600'>6</button>
              <button type='button' className='bg-emerald-500 text-white flex items-center justify-center py-2 rounded-xl hover:bg-emerald-400 transition-all ease-in-out border-2 font-bold border-emerald-600'>7</button>
              <button type='button' className='bg-gray-100 text-sky-800 hover:text-white flex items-center justify-center py-2 rounded-xl hover:bg-sky-700 transition-all ease-in-out border-2 font-bold border-sky-600'>8</button>
              <button type='button' className='bg-emerald-500 text-white flex items-center justify-center py-2 rounded-xl hover:bg-emerald-400 transition-all ease-in-out border-2 font-bold border-emerald-600'>9</button>
              <button type='button' className='bg-gray-100 text-sky-800 hover:text-white flex items-center justify-center py-2 rounded-xl hover:bg-sky-700 transition-all ease-in-out border-2 font-bold border-sky-600'>10</button>
            </div>
            <div className='h-full'>
              <button type='button' className='w-full block bg-red-500 hover:bg-red-600 py-2.5 rounded-xl text-white transition-all ease-in-out font-bold text-sm'>Selesai</button>
            </div>
            <div className='h-full'>
              <video ref={videoRef} autoPlay playsInline className='rounded-2xl' />
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default Assesment