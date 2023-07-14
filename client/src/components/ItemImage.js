import { useEffect, useState } from 'react';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage, preload } from '@cloudinary/react';
import { fill } from '@cloudinary/base/actions/resize';
import { format } from '@cloudinary/base/actions/delivery';
import { auto } from '@cloudinary/base/qualifiers/format';
const cld = new Cloudinary({
  cloud: {
    cloudName: 'ddoajstil',
  },
});

const ItemImage = ({ imageUrl }) => {
  const [cldImage, setCldImage] = useState(null);

  useEffect(() => {
    const myImage = cld.image(imageUrl);
    myImage.resize(fill().width(300).height(200));
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
    <div className="aspect-square rounded">
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

export default ItemImage;
