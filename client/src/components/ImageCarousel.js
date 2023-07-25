import React, { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import 'react-toastify/dist/ReactToastify.css';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';
import { useEffect } from 'react';
import Loading from './Loading/Loading';


const cld = new Cloudinary({
    cloud: {
        cloudName: 'ddoajstil',
    },
});

export default function ImageCarousel({ images, deleteImage, index, setIndex }) {
    // const [index, setIndex] = useState(0);

    const handleDeleteImage = (event, imageID) => {
        event.preventDefault();
        deleteImage(imageID);
    };

    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };

    // console.log(image);

    useEffect(() => {
        console.log(images);
    }, [])

    return (
        <div>
            <Carousel
                activeIndex={index}
                onSelect={handleSelect}
                className="max-w-full max-h-64 mx-auto"
            >
                {/* shows all the images if exists */}
                {images ? (
                    images.map((image) => (
                        <Carousel.Item className='h-100 w-100'>
                            <Carousel.Caption style={{ top: 0, marginBottom: 0 }}>
                                <div className="flex justify-center">
                                    <button
                                        onClick={(event) => handleDeleteImage(event, image.image_id)}
                                        className="rounded-full bg-black w-8 h-8 flex items-center justify-center border-none cursor-pointer"
                                    >
                                        <i className="bi bi-trash-fill text-white"></i>
                                    </button>
                                </div>
                            </Carousel.Caption>
                            <AdvancedImage
                                cldImg={cld.image(image.image_url)}
                                className="w-64 h-64 mx-auto"
                            />
                        </Carousel.Item>
                    ))
                ) : (
                    // Loading component (full screen)
                    <div className="flex items-center justify-center h-screen">
                        <Loading />
                    </div>
                )}
            </Carousel>
            <div class="grid grid-cols-5 gap-4 mt-5">
                {images ? (
                    images.map((image, index) => (
                        <div key={index} onClick={() => setIndex(index)} className="cursor-pointer hover:opacity-50">
                            <AdvancedImage
                                cldImg={cld.image(image.image_url)}
                                className="h-auto max-w-full rounded-lg"
                            />
                        </div>

                    ))
                ) : (
                    // Loading component (full screen)
                    <div className="flex items-center justify-center h-screen">
                        <Loading />
                    </div>
                )}
            </div>
        </div>
    );
}
