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
                console.log("ratings");
                console.log(ratings);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    return (
        <div className="col-span-12 mx-auto h-300 overflow-y-scroll bg-peach rounded-md mt-4">

            <div className="flex justify-center">
                <div className="text-center text-xl mt-3 mb-3 font-bold">Reviews</div>
            </div>

            <div className="overflow-y-scroll max-h-80">
                <ul role="list" className="divide-y divide-gray-100 px-4 sm:px-4 md:px-3 lg:px-1">
                    {/* shows all the ratings of the product by product ID */}
                    {ratings ? (
                        ratings.map((rating) => (
                            <li className="flex flex-row py-3 justify-around ">
                                <div className="col-2">
                                    <i className="pl-2 sm:pl-2 md:pl-1 lg:pl-1 bi bi-person-circle"></i>
                                </div>
                                <div className="col-7 flex items-center">
                                    <p className="text-sm font-semibold text-gray-900">{rating.comment}</p>
                                </div>

                                <div className="col-3 flex items-center">
                                    <div className="flex items-center">
                                        <svg
                                            aria-hidden="true"
                                            className="w-5 h-5 text-yellow-400"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <title>Rating star</title>
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                        </svg>
                                        <p className="ml-2 text-sm font-bold text-gray-900 dark:text-black">
                                            {Number(rating.rating_score).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        ))
                    ) : (
                        // Loading component (full screen)
                        <div className="flex items-center justify-center h-screen">
                            <Loading />
                        </div>
                    )
                    }
                </ul >
            </div >
        </div >

    );
}