import React from 'react';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';
import { scale } from '@cloudinary/url-gen/actions/resize';
import { format } from '@cloudinary/base/actions/delivery';
import { auto } from '@cloudinary/base/qualifiers/format';
const cld = new Cloudinary({
  cloud: {
    cloudName: 'ddoajstil',
  },
});

const ItemImage = ({ imageUrl, width = 24, height = 24 }) => {
  const [cldImage, setCldImage] = useState(null);

  useEffect(() => {
    const myImage = cld.image(imageUrl);
    myImage.resize(scale().width(300).height(300));
    myImage.delivery(format(auto()));

    // Create a new Image instance and set its src to preload it
    const img = new Image();
    if (myImage) {
      img.src = myImage.toURL();
    }

    img.onload = () => {
      // Once the image is loaded, set the CloudinaryImage instance to state
      setCldImage(myImage);
    };
  }, [imageUrl]);

  return (
    <div className={`aspect-square rounded w-${width} h-${height}`}>
      {cldImage && (
        <AdvancedImage
          cldImg={cldImage}
          width="100%"
          height="100%"
          className="rounded object-cover"
          alt="product img"
        />
      )}
    </div>
  );
};
ItemImage.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
};

export default ItemImage;
