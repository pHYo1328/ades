import { useState, useEffect } from 'react';
import axios from 'axios';
import Loading from '../../Loading/Loading';

export default function Rating(props) {
    const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;
    const { productID } = props;

    const [ratings, setRatings] = useState(null);

    // get the ratings by product ID
    useEffect(() => {
        axios
            .get(`${baseUrl}/api/products/rating/${productID}`)
            .then((response) => {
                console.log(response);
                setRatings(response.data.data);
                console.log(ratings);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    return (
        <div class="row mt-4">
            <div
                class="col-12"
                style={{
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    height: '300px',
                    overflowY: 'scroll',
                    background: '#c2d9ff',
                }}
            >
                <div class="row">
                    <div class="col-12 text-center h6 mt-3 mb-3">Reviews</div>
                </div>

                <ul role="list" class="divide-y divide-gray-100">
                    {/* shows all the ratings of the product by product ID */}
                    {ratings ? (
                        ratings.map((rating) => (
                            <div class="d-flex flex-row row py-3 justify-content-around">
                                <div class="col-2">
                                    <i class="bi bi-person-circle"></i>
                                </div>
                                <div class="col-10">
                                    <p class="text-sm font-semibold text-gray-900">
                                        {rating.comment}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        // Loading component (full screen)
                        <div className="flex items-center justify-center h-screen">
                            <Loading />
                        </div>
                    )}
                </ul>
            </div>
        </div>
    );
}