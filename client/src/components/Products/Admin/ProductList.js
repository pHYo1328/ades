import { Link } from 'react-router-dom';
import Product from './Product';
import Loading from '../../Loading/Loading';


export default function ProductList({ products, refunds, setProducts, setRefunds, fetchProducts, fetchStatistics }) {

    return (
        <div className="col-span-12 mx-auto h-300 overflow-y-scroll bg-peach rounded-md mt-4 mb-4">

            <div className="flex items-center justify-between mb-3 mt-3">
                <div className="w-6/12 text-left ml-10 text-xl font-bold">Products</div>



                <div className="w-3/12 mr-10">
                    <Link
                        to="/products/create"
                        className="bg-dark-blue hover:bg-light-blue text-white font-bold py-2 px-4 rounded-md w-full text-sm h-100 flex items-center justify-center text-center"

                        id="createButton"
                    >
                        Create <i className="bi bi-plus-circle ml-1"></i>
                    </Link>
                </div>
            </div>


            <div className="overflow-y-scroll max-h-80">
                <ul role="list" className="divide-y divide-gray-100 px-4 sm:px-4 md:px-3 lg:px-1">
                    {/* shows all products */}
                    {products ? (
                        products.map((product) => (
                            <Product product={product} products={products} refunds={refunds} fetchProducts={() => fetchProducts()} fetchStatistics={() => fetchStatistics()} setRefunds={setRefunds} setProducts={setProducts} />
                        ))
                    ) : (
                        // Loading component (full screen)
                        <div className="flex items-center justify-center h-screen">
                            <Loading />
                        </div>
                    )}
                </ul>
            </div >
        </div>
    )
}