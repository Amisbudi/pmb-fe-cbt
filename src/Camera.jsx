import React, { useRef, useEffect, useState } from 'react';

const Camera = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);

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

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d'); // Mendapatkan context dari canvas
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height); // Menggambar frame dari video ke canvas
      const imageDataURL = canvasRef.current.toDataURL('image/png');
      setCapturedImage(imageDataURL);
    }
  };

  return (
    <div>
      <h2>Camera View</h2>
      <video ref={videoRef} autoPlay playsInline width="250" height="250" /> {/* Menampilkan video dari kamera */}
      <button onClick={capturePhoto}>Capture Photo</button> {/* Tombol untuk menangkap foto */}
      <canvas ref={canvasRef} width="640" height="480" style={{ display: 'none' }} /> {/* Elemen canvas yang digunakan untuk menangkap gambar */}
      {capturedImage && ( // Menampilkan gambar yang telah di-capture
        <div>
          <h3>Captured Photo</h3>
          <img src={capturedImage} alt="Captured" />
        </div>
      )}
    </div>
  );
};

export default Camera;
