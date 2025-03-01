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
                const { scrollLeft, scrollWidth, clientWidth } = thumbnailRef.current;
                setCanScrollLeft(scrollLeft > 0);
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
        <div className="flex flex-col items-center w-full max-w-6xl">
            {/* Main Image */}
            <div className="w-full max-w-[500px] sm:max-w-[600px] md:max-w-[700px] h-auto flex justify-center">
    <img
        src={mainImage}
        alt="product"
        className="w-full h-auto max-h-[600px] sm:max-h-[650px] object-cover rounded-lg shadow-xl aspect-[2/3]"
    />
</div>


            {/* Thumbnail List - Always Below */}
            <div className="relative w-full max-w-[700px] mt-4">
                {/* Scroll Left Button */}
                {canScrollLeft && (
                    <button
                        onClick={() => scroll("left")}
                        className="absolute left-0 z-10 bg-white p-2 rounded-full shadow-md"
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-600" />
                    </button>
                )}

                {/* Thumbnails Scrollable List */}
                <div
                    ref={thumbnailRef}
                    className="flex gap-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth"
                    style={{
                        scrollBehavior: "smooth",
                        display: "flex",
                        overflowX: "auto",
                        whiteSpace: "nowrap",
                    }}
                >
                    {productImage.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt="product thumbnail"
                            className={`w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover cursor-pointer transition-all ${
                                mainImage === image ? "border-2 border-black scale-105" : ""
                            }`}
                            onClick={() => setMainImage(image)}
                        />
                    ))}
                </div>

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
        </div>
    );
};

export default Gallery;
