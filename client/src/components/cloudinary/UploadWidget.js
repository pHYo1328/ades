import React, { useEffect, useState } from 'react';

const UploadWidget = ({ onImageChange }) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const handleClick = (event) => {
      event.preventDefault();
      window.cloudinary.openUploadWidget(
        {
          cloudName: 'ddoajstil',
          uploadPreset: 'q7grvgxu',
        },
        function (error, result) {
          if (result && result.info && result.info.path) {
            const imagePath = result.info.path;
            console.log(imagePath);
            const folder = imagePath.split('/')[1];
            const fileName = imagePath.split('/')[2].split('.')[0];
            const path = `${folder}/${fileName}`;
            console.log(path);
            setImages((prevImages) => [...prevImages, path]);
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
    console.log(images);
    // console.log(images.join(', '));
    // onImageChange(images.join(', '));
    onImageChange(images);
  }, [images]);

  return (
    <button id="upload_widget" className="cloudinary-button w-100">
      Upload Image
    </button>
  );
};

export default UploadWidget;
