/* eslint-disable react/prop-types */
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import TextEditor from './../Editor';
import { useState, useEffect } from 'react'
import axios from 'axios';

const validationSchema = Yup.object({
  name: Yup.string()
    .required('Name is required')
    .min(3, 'Name must be at least 3 characters'),
  duration: Yup.number()
    .required('Duration is required')
    .positive('Duration must be positive')
    .integer('Duration must be a whole number'),
});


function ModalGrouping({ isOpen, setIsOpen, reloadData, setReloadData, detail, setDetail }) {
  const [packageQuestnData, setPackageQuestionData] = useState([])
  const [getIdPackageQuestion, setGetIdPackageQuestion] = useState()
  const [formData, setFormData] = useState({
        id: "",
        naration: "",
        name: "",
        image: "",
        duration: "",
    })

  // Initial form values
  const initialValues = {
    name: detail?.name,
    duration: detail?.duration,
  };

  // Form submission handler
  const handleSubmit = async (values, { resetForm }) => {

    let data = {
      package_question_id: getIdPackageQuestion,
      naration: formData.naration,
      name: values.name,
      duration: values.duration,
      image: formData.image,
    };

    if (detail?.id) {
      await axios.patch(`${import.meta.env.VITE_APP_API_BASE_URL}/groupquestions/${detail?.id}`, data, {
        headers: {
          "api-key": "b4621b89b8b68387",
        },
      }).then(() => {
        setIsOpen(false);
        setReloadData(reloadData + 1)
        resetForm();
        setFormData({
          naration: "",
          name: "",
          image: "",
          duration: "",
        })
      }).catch((error) => {
        if (error.response && error.response.status === 400) {
          alert(error.response.data.message);
        } else {
          console.log(error);
        }
      });

    } else {
      await axios.post('${import.meta.env.VITE_APP_API_BASE_URL}/groupquestions', data, {
        headers: {
          "api-key": "b4621b89b8b68387",
        },
      }).then(() => {
        setIsOpen(false);
        setReloadData(reloadData + 1)
        resetForm();
        setFormData({
          naration: "",
          name: "",
          image: "",
          duration: "",
        })
      }).catch((error) => {
        if (error.response && error.response.status === 400) {
          alert(error.response.data.message);
        } else {
          console.log(error);
        }
      });
    }
    };
    
    const handleChange = (e) => {
        if (e.target.name === "excel" && e.target.files.length > 0) {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onloadend = () => {
            setFormData({
              ...formData,
              excel: reader.result,
            });
          };
          reader.readAsDataURL(file);
        } else if (e.target.name === 'package_question_id') {
          setFormData({
            ...formData,
            [e.target.name]: e.target.value,
          });
        } else if (e.target.name === "image" && e.target.files.length > 0) {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onloadend = () => {
            setFormData({
              ...formData,
              image: reader.result,
            });
          };
          reader.readAsDataURL(file);
        } else if (
          e.target.name === "answer_1_image" &&
          e.target.files.length > 0
        ) {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onloadend = () => {
            setFormData({
              ...formData,
              answer_1_image: reader.result,
            });
          };
          reader.readAsDataURL(file);
        } else if (
          e.target.name === "answer_2_image" &&
          e.target.files.length > 0
        ) {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onloadend = () => {
            setFormData({
              ...formData,
              answer_2_image: reader.result,
            });
          };
          reader.readAsDataURL(file);
        } else if (
          e.target.name === "answer_3_image" &&
          e.target.files.length > 0
        ) {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onloadend = () => {
            setFormData({
              ...formData,
              answer_3_image: reader.result,
            });
          };
          reader.readAsDataURL(file);
        } else if (
          e.target.name === "answer_4_image" &&
          e.target.files.length > 0
        ) {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onloadend = () => {
            setFormData({
              ...formData,
              answer_4_image: reader.result,
            });
          };
          reader.readAsDataURL(file);
        } else if (
          e.target.name === "answer_5_image" &&
          e.target.files.length > 0
        ) {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onloadend = () => {
            setFormData({
              ...formData,
              answer_5_image: reader.result,
            });
          };
          reader.readAsDataURL(file);
        } else if (
          e.target.name === "answer_6_image" &&
          e.target.files.length > 0
        ) {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onloadend = () => {
            setFormData({
              ...formData,
              answer_5_image: reader.result,
            });
          };
          reader.readAsDataURL(file);
        } else if (
          e.target.name === "answer_7_image" &&
          e.target.files.length > 0
        ) {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onloadend = () => {
            setFormData({
              ...formData,
              answer_5_image: reader.result,
            });
          };
          reader.readAsDataURL(file);
        } else if (
          e.target.name === "answer_8_image" &&
          e.target.files.length > 0
        ) {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onloadend = () => {
            setFormData({
              ...formData,
              answer_5_image: reader.result,
            });
          };
          reader.readAsDataURL(file);
        } else if (
          e.target.name === "answer_9_image" &&
          e.target.files.length > 0
        ) {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onloadend = () => {
            setFormData({
              ...formData,
              answer_5_image: reader.result,
            });
          };
          reader.readAsDataURL(file);
        } else if (
          e.target.name === "answer_10_image" &&
          e.target.files.length > 0
        ) {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onloadend = () => {
            setFormData({
              ...formData,
              answer_5_image: reader.result,
            });
          };
          reader.readAsDataURL(file);
        } else {
          setFormData({
            ...formData,
            [e.target.name]: e.target.value,
          });
        }
  };


  const packageQuestionData = async () => {

    await axios.get('${import.meta.env.VITE_APP_API_BASE_URL}/packagequestions', {
      headers: {
        "api-key": "b4621b89b8b68387",
      },
    }).then(({data : {data}}) => {
      setPackageQuestionData(data)
    })
  }
  
  function handleChangeEditor (name, value){
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    packageQuestionData()
  }, [])
    
  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        setIsOpen(false)
        setDetail([])
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <DialogPanel className="w-1/2 max-w-1/2 bg-white rounded-lg p-6 shadow-lg h-[90vh] relative">
        <DialogTitle className="text-xl font-bold mb-4">Grouping Question</DialogTitle>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {() => (
            <Form className="space-y-4">

              <div className="col-span-1">
                <label
                    htmlFor="package_question_id"
                    className="block mb-2 text-xs font-medium text-gray-900"
                  >
                    Paket Soal
                  </label>
                <select
                  name="package_question_id"
                  onChange={(e) => setGetIdPackageQuestion(e.target.value)}
                  id="package_question_id"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                >
                  <option value="">Pilih Pake Soal</option>
                  {packageQuestnData.length > 0 &&
                    packageQuestnData.map((data, index) => (
                      <option value={data.id} key={index}>
                        {data.name}
                      </option>
                    ))}
                </select>
              </div>
              
              {/* Name Field */}
              <div>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <Field
                  type="text"
                  name="name"
                  id="name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-sm text-red-600"
                  />
                  </div>
              </div>

              {/* Image Field */}
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                  Image
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                />
                <ErrorMessage
                  name="image"
                  component="div"
                  className="text-sm text-red-600"
                />
              </div>
                          
            {/* Duration Field */}
              <div className=''>
                <label
                  htmlFor="duration"
                  className="block text-sm font-medium text-gray-700"
                >
                  Duration (in minutes)
                </label>
                <Field
                  type="number"
                  name="duration"
                  id="duration"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                />
                <ErrorMessage
                  name="duration"
                  component="div"
                  className="text-sm text-red-600"
                />
              </div>

              {/* Naration Field */}
              <div className='mb-5'>
                <label
                  htmlFor="naration"
                  className="block text-sm font-medium text-gray-700"
                >
                  Narasi
                </label>
                <TextEditor
                    handleChangeEditor={handleChangeEditor}
                    name="naration"
                    value={detail?.naration ?? ''}
                    createModal={true}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 absolute bottom-4 right-5">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false)
                    setDetail([])
                  }}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Submit
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </DialogPanel>
    </Dialog>
  );
}

export default ModalGrouping;
