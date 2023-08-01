import React, { useRef } from 'react';
import axios from 'axios';

const UploadMultiple = ({ onImageChange, success = false, length }) => {
  const fileInputRef = useRef(null);

  const handleUpload = async (files) => {
    const uploadedData = [];

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append('file', files[i]);
      formData.append('upload_preset', 'q7grvgxu');

      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/ddoajstil/image/upload`,
          formData
        );
        console.log(response.data);
        uploadedData.push(response.data.public_id);
      } catch (error) {
        console.error('Upload failed', error);
      }
    }
    console.log('uploadeddata', uploadedData);

    onImageChange(uploadedData);

    // Clear the selected files
    if (success) {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // const handleFileChange = (event) => {
  //     const files = event.target.files;
  //     if (files) {
  //         handleUpload(files);
  //     }
  // };

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files && files.length <= 10 - length) {
      // Limit the upload to 5 images
      handleUpload(files);
    } else {
      // Show an alert or toast message indicating the limit has been reached
      alert('Please add only up to 10 images per product.');
    }
  };

  return (
    <input
      class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 mb-3"
      id="multiple_files"
      type="file"
      multiple
      accept="image/png, image/jpeg"
      onChange={handleFileChange}
      ref={fileInputRef}
    ></input>
  );
};

export default UploadMultiple;
