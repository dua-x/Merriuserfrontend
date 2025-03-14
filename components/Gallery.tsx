"use client";
import React, { useState, useRef, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const ChevronButton = ({
    direction,
    onClick,
    visible,
}: {
    direction: "left" | "right";
    onClick: () => void;
    visible: boolean;
}) => {
    if (!visible) return null;
    const isLeft = direction === "left";

    return (
        <button
            onClick={onClick}
            className={`absolute ${isLeft ? "left-2" : "right-2"} top-1/2 transform -translate-y-1/2 
            bg-gradient-to-r from-[#857B74] to-[#6f645b] p-2 rounded-full shadow-md 
            opacity-60 hover:opacity-100 transition-all duration-300 
            border border-white z-10 hidden md:flex`}
        >
            {isLeft ? (
                <ChevronLeftIcon className="w-6 h-6 text-white drop-shadow-md" />
            ) : (
                <ChevronRightIcon className="w-6 h-6 text-white drop-shadow-md" />
            )}
        </button>
    );
};

const Gallery = ({ productImage }: { productImage: string[] }) => {
    if (!productImage.length) return null; // Prevent rendering if no images

    const [mainImage, setMainImage] = useState(productImage[0]);
    const [isHovered, setIsHovered] = useState(false);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    
    const containerRef = useRef<HTMLDivElement>(null);
    const autoSwitchRef = useRef<NodeJS.Timeout | null>(null);

    // Automatically change main image every 3 seconds
    useEffect(() => {
        if (isHovered) return; // Stop auto-switch when hovered

        autoSwitchRef.current = setInterval(() => {
            setMainImage((prevImage) => {
                const currentIndex = productImage.indexOf(prevImage);
                const nextIndex = (currentIndex + 1) % productImage.length;
                return productImage[nextIndex];
            });
        }, 3000); // Change every 3 seconds

        return () => {
            if (autoSwitchRef.current) clearInterval(autoSwitchRef.current);
        };
    }, [isHovered, productImage]);

    const handleImageClick = (image: string) => {
        setMainImage(image);
        if (autoSwitchRef.current) clearInterval(autoSwitchRef.current); // Stop auto-switching when user interacts
    };

    const scroll = (direction: "left" | "right") => {
        if (containerRef.current) {
            const scrollAmount = 100;
            containerRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    return (
        <div 
            className="flex flex-col-reverse lg:flex-row items-center w-full max-w-6xl gap-6"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Thumbnails */}
            <div className="w-full lg:w-32 flex lg:flex-col overflow-x-auto lg:overflow-y-auto scrollbar-hide">
                <ChevronButton direction="left" onClick={() => scroll("left")} visible={canScrollLeft} />
                
                <div
                    ref={containerRef}
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
                                onClick={() => handleImageClick(image)}
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

            {/* Scroll Right Button */}
            <ChevronButton direction="right" onClick={() => scroll("right")} visible={canScrollRight} />
        </div>
    );
};

export default Gallery;
