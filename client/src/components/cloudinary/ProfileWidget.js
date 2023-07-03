import React, { useEffect, useState } from 'react';

const ProfileWidget = ({ onImageChange }) => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    const handleClick = (event) => {
      event.preventDefault();
      window.cloudinary.openUploadWidget(
        {
          cloudName: 'ddoajstil',
          uploadPreset: 'q7grvgxu',
          maxFiles: 1, // Allow only one file to be uploaded
        },
        function (error, result) {
          if (result && result.info && result.info.path) {
            const imagePath = result.info.path;
            console.log(imagePath);
            const folder = imagePath.split('/')[1];
            const fileName = imagePath.split('/')[2].split('.')[0];
            const path = `${folder}/${fileName}`;
            console.log(path);
            setImage(path);
          } else {
            console.error(error);
          }
        }
      );
    };

    const uploadWidgetBtn = document.getElementById('upload_widget');
    if (uploadWidgetBtn) {
      uploadWidgetBtn.addEventListener('click', handleClick, false);
    }

    return () => {
      if (uploadWidgetBtn) {
        uploadWidgetBtn.removeEventListener('click', handleClick, false);
      }
    };
  }, []);

  useEffect(() => {
    console.log(image);
    onImageChange(image);
  }, [image]);

  return (
    <button
      id="upload_widget"
      className="cloudinary-button bg-light-blue w-100"
    >
      Upload Image
    </button>
  );
};

export default ProfileWidget;
