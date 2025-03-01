"use client";
import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Gallery = ({ productImage }: { productImage: string[] }) => {
    if (!productImage.length) return null; // Prevent rendering if no images

    const [mainImage, setMainImage] = useState(productImage[0] || "");
    const thumbnailRef = useRef<HTMLDivElement | null>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(productImage.length > 4);

    useEffect(() => {
        if (thumbnailRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = thumbnailRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
        }
    }, [mainImage]);

    const scroll = (direction: "left" | "right") => {
        if (thumbnailRef.current) {
            const scrollAmount = 80;
            thumbnailRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    return (
        <div className="w-full lg:max-w-6xl mx-auto p-6 rounded-2xl flex flex-col justify-center items-center lg:flex-row h-full">
            {/* Thumbnails - Below on small screens, Left on large screens */}
            <div className="relative flex items-center lg:w-[20%] order-2 lg:order-1">
                {/* Scroll Left Button */}
                {productImage.length > 4 && canScrollLeft && (
                    <button
                        onClick={() => scroll("left")}
                        className="absolute left-0 z-10 bg-white p-2 rounded-full shadow-md disabled:opacity-50"
                        disabled={!canScrollLeft}
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-600" />
                    </button>
                )}

                {/* Thumbnails - Scrollable */}
                <div
                    ref={thumbnailRef}
                    className="flex lg:flex-col gap-2 lg:gap-3 overflow-x-auto lg:overflow-y-auto w-full h-24 lg:h-auto scrollbar-hide snap-x snap-mandatory scroll-smooth"
                    style={{
                        scrollBehavior: "smooth",
                        overflow: "hidden",
                        display: "flex",
                        whiteSpace: "nowrap",
                    }}
                >
                    {productImage.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt="product thumbnail"
                            className={`w-16 lg:w-20 h-full lg:h-24 rounded-lg object-cover cursor-pointer transition-all ${
                                mainImage === image ? "border-2 border-black scale-105" : ""
                            }`}
                            onClick={() => setMainImage(image)}
                        />
                    ))}
                </div>

                {/* Scroll Right Button */}
                {productImage.length > 4 && canScrollRight && (
                    <button
                        onClick={() => scroll("right")}
                        className="absolute right-0 z-10 bg-white p-2 rounded-full shadow-md disabled:opacity-50"
                        disabled={!canScrollRight}
                    >
                        <ChevronRight className="w-6 h-6 text-gray-600" />
                    </button>
                )}
            </div>

            {/* Main Image Display */}
            <div className="lg:w-[80%] order-1 lg:order-2 mb-4">
                <img
                    src={mainImage}
                    alt="product"
                    className="rounded-lg shadow-xl object-cover"
                />
            </div>
        </div>
    );
};

export default Gallery;