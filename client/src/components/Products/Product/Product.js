import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';
import { Link } from 'react-router-dom';

const cld = new Cloudinary({
  cloud: {
    cloudName: 'ddoajstil',
  },
});

export default function Product(props) {
  const { product } = props;

  return (
    <div key={product.product_id} className="group relative">
      <div className="h-70 w-100 aspect-square w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75">
        {/* shows the image from Cloudinary */}
        <AdvancedImage
          cldImg={cld.image(product.image_url)}
          className="h-full w-full"
        />
      </div>

      <div className="mt-4 flex justify-between">
        <div className="text-left">
          <h3 className="text-sm text-gray-700">
            <Link
              to={`/product/${product.product_id}`}
              onClick={() => window.scrollTo(0, 0)}
            >
              <span aria-hidden="true" className="absolute inset-0" />
              {product.product_name}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-gray-500">{product.brand_name}</p>
        </div>
        <p className="text-sm font-medium text-gray-900 justify-start">
          ${product.price}
        </p>
      </div>
    </div>
  );
}
