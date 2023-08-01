import React, { ChangeEvent } from 'react';
import axios from 'axios';

const CloudinaryUpload = ({ onSuccess, caption }) => {
  const handleUpload = async (file) => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'q7grvgxu');

      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/ddoajstil/image/upload`,
          formData
        );
        onSuccess(response.data);
      } catch (error) {
        console.error('Upload failed', error);
      }
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files ? event.target.files[0] : null;
    handleUpload(file);
  };

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <input
        id="file-upload"
        type="file"
        accept="image/png, image/jpeg"
        onChange={handleFileChange}
        className="hidden"
      />
      <label
        htmlFor="file-upload"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
      >
        {caption}
      </label>
    </div>
  );
};

export default CloudinaryUpload;
