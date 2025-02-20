"use client";
import React, { useState } from "react";

const Gallery = ({ productImage }: { productImage: string[] }) => {
    const [mainImage, setMainImage] = useState(productImage[0]);

    return (
        <div className="w-full  lg:max-w-6xl mx-auto p-6  rounded-2xl flex flex-col justify-center items-center lg:flex-row  h-full">
            {/* Thumbnails - Below on small screens, Left on large screens */}
            <div className="flex lg:flex-col gap-2 lg:gap-3 order-2 lg:order-1 lg:w-[20%]">
                {productImage.map((image, index) => (
                    <img
                        key={index}
                        src={image}

                        alt="product thumbnail"
                        className={`w-16 lg:w-70 h-full lg:h-50 rounded-lg object-cover cursor-pointer transition-all ${mainImage === image ? "border-2 border-black scale-105" : ""
                            }`}
                        onClick={() => setMainImage(image)}
                    />
                ))}
            </div>

            <div className="lg:w-[80%] order-1 lg:order-2 mb-4">
                <img
                    src={mainImage}
                    alt="product"

                    className=" rounded-lg shadow-xl object-cover "
                />

            </div>
        </div>
    );
};

export default Gallery;
