import Product from './Product';
import Loading from '../../Loading/Loading';

export default function ProductList({
  products,
  refunds,
  setProducts,
  setRefunds,
  fetchProducts,
  fetchStatistics,
}) {
  return (
    <div className="relative  overflow-x-auto overflow-y-auto max-h-[60vh] sm:max-h-[60vh] md:max-h-[70vh] lg:max-h-[70vh] shadow-md sm:rounded-lg">
      {products ? (
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="sticky top-0 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 text-center">
            <tr>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Image</span>
                {/* Image */}
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Category
              </th>
              <th scope="col" className="px-6 py-3">
                Brand
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
              <th scope="col" className="px-6 py-3">
                Inventory
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-700 dark:text-gray-400 h-98 overflow-y-auto">
            {products.map((product) => (
              <Product
                product={product}
                products={products}
                refunds={refunds}
                fetchProducts={() => fetchProducts()}
                fetchStatistics={() => fetchStatistics()}
                setRefunds={setRefunds}
                setProducts={setProducts}
              />
            ))}
          </tbody>
        </table>
      ) : (
        // Loading component (full screen)
        <div className="flex items-center justify-center h-screen">
          <Loading />
        </div>
      )}
    </div>
  );
}
