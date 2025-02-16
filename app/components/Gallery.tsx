"use client";
import React, { useState } from "react";

const Gallery = ({ productImage }: { productImage: string[] }) => {
    const [mainImage, setMainImage] = useState(productImage[0]);

    return (
        <div className="w-full lg:max-w-6xl mx-auto p-6  rounded-2xl flex flex-col lg:flex-row gap-10">
            {/* Thumbnails - Below on small screens, Left on large screens */}
            <div className="flex lg:flex-col gap-2 lg:gap-3 order-2 lg:order-1">
                {productImage.map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        height={200}
                        width={200}
                        alt="product thumbnail"
                        className={`w-16 lg:w-20 h-16 lg:h-20 rounded-lg object-cover cursor-pointer transition-all ${mainImage === image ? "border-2 border-black scale-105" : ""
                            }`}
                        onClick={() => setMainImage(image)}
                    />
                ))}
            </div>

            {/* Main Image - Stays in center on all screens */}
            <img
                src={mainImage}
                width={500}
                height={500}
                alt="product"
                className="w-96 h-96 lg:w-[450px] lg:h-[450px] rounded-lg shadow-xl object-cover order-1 lg:order-2"
            />
        </div>
    );
};

export default Gallery;
