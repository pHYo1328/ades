import { Link } from 'react-router-dom';
import { FadeLoader } from 'react-spinners';

import Product from './Product';
import Loading from '../../Loading/Loading';


export default function ProductList(props, { fetchProducts, fetchStatistics, setRefunds }) {
    const { products, statistics, refunds } = props;

    return (
        <div
            class="row my-2 mx-auto p-0"
            style={{
                height: '400px',
                overflowY: 'scroll',
                background: '#c2d9ff',
                width: '90%',
                marginLeft: 'auto',
                marginRight: 'auto',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
        >
            <div
                class="py-2"
                style={{
                    position: 'sticky',
                    top: '0',
                    background: '#dff7ec',
                    width: '100%',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                }}
            >
                <div
                    className="row align-items-center col-11"
                    style={{ marginLeft: 'auto', marginRight: 'auto' }}
                >
                    <div className="col-9 h5 font-weight-bold">Products</div>
                    {/* link to ProductCreate page when admin clicks on create button */}
                    <div className="col-3">
                        <Link
                            to="/products/create"
                            className="btn btn-info w-100 col-12 text-dark mr-2"
                            id="createButton"
                        >
                            Create <i class="bi bi-plus-circle"></i>
                        </Link>
                    </div>
                </div>
            </div>
            <ul role="list" class="divide-y divide-gray-100">
                {/* shows all products */}
                {products ? (
                    products.map((product) => (
                        <Product product={product} products={products} refunds={refunds} statistics={statistics} fetchProducts={fetchProducts} fetchStatistics={fetchStatistics} setRefunds={setRefunds} />
                    ))
                ) : (
                    // Loading component (full screen)
                    <div className="flex items-center justify-center h-screen">
                        <Loading />
                    </div>
                )}
            </ul>
        </div>
    )
}