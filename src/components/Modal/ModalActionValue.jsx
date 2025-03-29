/* eslint-disable react/prop-types */

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState } from "react";
import axios from "axios";

function ModalActionValue({ isOpen, setIsOpen, data, reloadData, setReloadData }) {
  const [scores, setScores] = useState({})

  const onClose = () => {
    setIsOpen(false);
  };

  const uniqueEssayData = Array.isArray(data)
    ? data
        .filter((d) => d.type_of_question === "Essay")
        .filter((item, index, self) =>
          index === self.findIndex((t) => t.user_id === item.user_id)
        )
    : [];

  
  const handleChangeInput = (userId, value) => {
      const numericValue = Math.max(0, Math.min(100, Number(value))); 
      setScores((prevScores) => ({
        ...prevScores,
        [userId]: numericValue,
      }));
  };

  const handleSubmit = async () => {
    const headers = {
      "api-key": "b4621b89b8b68387",
    };

    const requests = uniqueEssayData.map((d) => {
      const userId = d.user_id;
      const score = scores[userId] || 0;
      return axios.patch(`${import.meta.env.VITE_APP_API_BASE_URL}/records/essay-image/${d.record_id}/result`, {
        user_id: userId,
        essay_image_result: score,
      },
      { headers }
      );
    });

    try {
      await Promise.all(requests);
      alert('Score created successfully!');
      setReloadData(reloadData + 1)
      setIsOpen(false);
    } catch (error) {
      alert('Error submitting scores', error);
    }
  };


  return (
    <Dialog
      open={isOpen}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClose={onClose}
    >
      <DialogPanel className="w-1/2 max-w-1/2 bg-white rounded-lg p-6 shadow-lg h-[70vh] relative">
        <DialogTitle>Penilaian untuk soal essay</DialogTitle>

        {/* Jika tidak ada data yang sesuai */}
        {uniqueEssayData.length === 0 ? (
          <p className="text-center text-gray-500 mt-4">
            Tidak ada soal essay untuk dinilai.
          </p>
          
        ) : (
          uniqueEssayData.map((d, index) => (
            <div key={index} className="mb-4 my-3">
              {d.essay_image && (
                <div className="flex justify-between gap-2">
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="flex flex-col gap-2">
                      <p className="mt-2 flex text-sm opacity-60">
                      User ID : <b>{d.user_id}</b>
                      </p>
                      <p className="text-sm  opacity-60">
                      Name : <b>{d?.fullname}</b>
                      </p>
                      <p className="text-sm opacity-60">
                      Package Name : <b>{d?.package_name}</b>
                      </p>
                    </div>

                    <div className="mb-10 mt-3">
                      <input
                        type="text"
                        name="penilaian"
                        placeholder="Enter Nilai"
                        className="w-full bg-white rounded border border-gray-300 text-base outline-none text-gray-700 py-3 px-3 leading-8 transition-colors duration-200 ease-in-out"
                        onChange={(e) => handleChangeInput(d.user_id, e.target.value)}
                        min="0"
                        max="100"
                      />
                    </div>

                    
                  </div>

                  <div className="flex-1 flex justify-center items-center">
                    <img
                      src={`${import.meta.env.VITE_APP_API_BASE_URL}/records/img/${d.record_id}`}
                      alt={`Essay ${index + 1}`}
                      className="w-[300px] rounded-xl"
                      />
                  </div>
                </div>
              )}
            </div>
          ))
        )}

        {/* Tombol aksi */}
        <div className="flex justify-end gap-2 absolute bottom-4 right-5">
          <button
            type="button"
            className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-blue-700"
            onClick={handleSubmit}
          >
            Submit
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </DialogPanel>
    </Dialog>
  );
}

export { ModalActionValue };
