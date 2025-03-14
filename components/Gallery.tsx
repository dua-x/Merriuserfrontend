"use client";
import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Gallery = ({ productImage }: { productImage: string[] }) => {
    if (!productImage.length) return null; // Prevent rendering if no images

    const [mainImage, setMainImage] = useState(productImage[0]);
    const thumbnailRef = useRef<HTMLDivElement | null>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(productImage.length > 4);

    useEffect(() => {
        const updateScrollState = () => {
            if (thumbnailRef.current) {
                const { scrollLeft, scrollWidth, clientWidth, scrollHeight, clientHeight } =
                    thumbnailRef.current;
                setCanScrollLeft(scrollLeft > 0 || scrollHeight > clientHeight);
                setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
            }
        };

        const ref = thumbnailRef.current;
        if (ref) {
            ref.addEventListener("scroll", updateScrollState);
            updateScrollState(); // Initial check
        }

        return () => {
            if (ref) {
                ref.removeEventListener("scroll", updateScrollState);
            }
        };
    }, []);

    const scroll = (direction: "left" | "right") => {
        if (thumbnailRef.current) {
            const scrollAmount = 100;
            thumbnailRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    return (
        <div className="flex flex-col-reverse lg:flex-row items-center w-full max-w-6xl gap-6">
            {/* Thumbnails */}
            <div className="w-full lg:w-32 flex lg:flex-col overflow-x-auto lg:overflow-y-auto max-h-[500px] scrollbar-hide">
                 {/* Scroll Left Button */}
                 {canScrollLeft && (
                    <button
                        onClick={() => scroll("left")}
                        className="absolute left-0 z-10 bg-white p-2 rounded-full shadow-md"
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-600" />
                    </button>
                )}
                <div
                    ref={thumbnailRef}
                    className="flex lg:flex-col p-2 gap-2 overflow-x-auto lg:overflow-y-auto scrollbar-hide w-full"
                >
                    {productImage.map((image, index) => (
                        <div
                            key={index}
                            className="w-20 h-auto md:w-24 aspect-[3/4] flex-shrink-0 cursor-pointer"
                        >
                            <img
                                src={image}
                                alt="product thumbnail"
                                className={`aspect-[3/4] object-cover rounded-lg transition-all ${
                                    mainImage === image ? "border-2 border-black scale-105" : ""
                                }`}
                                onClick={() => setMainImage(image)}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Image */}
            <div className="w-full max-w-[400px] sm:max-w-[500px] lg:flex-1 flex justify-center">
                <div className="w-full aspect-[3/4]">
                    <img
                        src={mainImage}
                        alt="product"
                        className="w-full h-full object-cover rounded-lg shadow-xl"
                    />
                </div>
            </div>

            {/* Scroll Controls (Only for small screens) */}
        
               

                {/* Scroll Right Button */}
                {canScrollRight && (
                    <button
                        onClick={() => scroll("right")}
                        className="absolute right-0 z-10 bg-white p-2 rounded-full shadow-md"
                    >
                        <ChevronRight className="w-6 h-6 text-gray-600" />
                    </button>
                )}
          
        </div>
    );
};

export default Gallery;
