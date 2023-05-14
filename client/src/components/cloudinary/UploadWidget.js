import React, { useEffect, useState } from 'react';

const UploadWidget = ({ onImageChange }) => {
  const [paths, setPaths] = useState([]);

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
            setPaths((prevPaths) => [...prevPaths, path]);
            onImageChange(paths.join(', '));
          } else {
            console.error(error);
          }
        }
      );
    };

    document
      .getElementById('upload_widget')
      .addEventListener('click', handleClick, false);

    return () => {
      document
        .getElementById('upload_widget')
        .removeEventListener('click', handleClick, false);
    };
  }, []);

  useEffect(() => {
    console.log(paths);
    console.log(paths.join(', '));
  }, [paths]);

  return (
    <button id="upload_widget" className="cloudinary-button">
      Upload
    </button>
  );
};

export default UploadWidget;
