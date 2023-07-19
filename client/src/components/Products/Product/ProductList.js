import Product from './Product';
import Loading from '../../../components/Loading/Loading';

export default function ProductList({ products, hasResults }) {
  return (
    <div>
      {hasResults ? (
        products ? (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {products.map((product) => (
              <Product key={product.id} product={product} />
            ))}
          </div>
        ) : (
          // If no results match the search
          <p className="mt-40 text-center text-gray-500">No results found</p>
        )
      ) : (
        // Loading component (full screen)
        <div className="flex items-center justify-center h-screen">
          <Loading />
        </div>
      )}
    </div>
  );
}
