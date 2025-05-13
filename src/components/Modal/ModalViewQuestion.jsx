import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import axios from "axios";
import { useState, useEffect } from "react";

function ModalViewQuestion({ isOpen, setIsOpen, id }) {
    const [detail, setDetail] = useState({})
    
    const removeHtmlTags = (htmlString) => {
        return htmlString?.replace(/<[^>]*>/g, '')?.replace(/['"]+/g, '');
    };
    const viewData = async () => {
        const data = await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/questions/${id}`, {
            headers: {
              "api-key": "b4621b89b8b68387",
            },
        })
        const { data: response } = data
        setDetail(response)
    }

    const onClose = () => {
        setIsOpen(false);
    };

    useEffect(() => {
        viewData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    console.log('detatil : ', detail)
    
    return (
        <Dialog
            open={isOpen}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClose={onClose}
        >
            <DialogPanel className="w-1/2 max-w-1/2 bg-white rounded-lg p-6 shadow-lg h-[70vh] relative">
                <DialogTitle>View Question</DialogTitle>

                <div className="mt-10 flex flex-col gap-y-7">
                    <span>{removeHtmlTags(detail.name)}</span>

                    {detail.image ? (
                        <img
                          src={`${import.meta.env.VITE_APP_API_BASE_URL}/questions/image/${detail.id}`}
                          alt="Question Image"
                          className="relative max-w-fit max-h-[50vh] rounded-xl"
                        />
                      ) : (
                        <span>Tidak ada gambar</span>
                      )}
                </div>
            {/* Tombol aksi */}
                <div className="flex justify-end gap-2 absolute bottom-4 right-5">
                    <button
                        type="button"
                        className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </DialogPanel>
        </Dialog>
    )
}

export default ModalViewQuestion