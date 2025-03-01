"use client";
import React, { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Gallery = ({ productImage }: { productImage: string[] }) => {
    const [mainImage, setMainImage] = useState(productImage[0]);
    const thumbnailRef = useRef<HTMLDivElement>(null);

    // Fonction de défilement pour la liste des miniatures
    const scroll = (direction: "left" | "right") => {
        if (thumbnailRef.current) {
            const scrollAmount = direction === "left" ? -200 : 200;
            thumbnailRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    return (
        <div className="w-full lg:max-w-6xl mx-auto p-6 rounded-2xl flex flex-col lg:flex-row justify-center items-center h-full gap-6">
            
            {/* Miniatures - Conteneur défilable */}
            <div className="flex flex-col items-center lg:w-[20%] order-2 lg:order-1">
                
                <div className="relative w-full">
                    {/* Boutons de défilement (Visible sur Desktop) */}
                    {productImage.length > 4 && (
                        <button
                            onClick={() => scroll("left")}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-1 rounded-full shadow-md hidden lg:block"
                        >
                            <ChevronLeft className="w-6 h-6 text-gray-600" />
                        </button>
                    )}

                    <div
                        ref={thumbnailRef}
                        className={`flex gap-2 lg:gap-3 overflow-x-auto lg:overflow-y-auto w-full h-24 lg:h-auto lg:flex-col scrollbar-hide ${
                            productImage.length > 4 ? "flex-nowrap" : "flex-wrap"
                        }`}
                        style={{
                            maxWidth: "100%",
                            whiteSpace: productImage.length > 4 ? "nowrap" : "normal",
                        }}
                    >
                        {productImage.map((image, index) => (
                            <button
                                key={index}
                                onClick={() => setMainImage(image)}
                                className={`flex-shrink-0 w-20 h-20 lg:w-full lg:h-24 rounded-lg overflow-hidden transition-transform ${
                                    mainImage === image ? "border-2 border-black scale-105" : ""
                                }`}
                            >
                                <img
                                    src={image}
                                    alt="product thumbnail"
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>

                    {productImage.length > 4 && (
                        <button
                            onClick={() => scroll("right")}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-1 rounded-full shadow-md hidden lg:block"
                        >
                            <ChevronRight className="w-6 h-6 text-gray-600" />
                        </button>
                    )}
                </div>
                
                <div className="mt-4 text-center text-gray-500 text-sm md:hidden animate-pulse">
                    {productImage.length > 4 ? "Glissez pour explorer →" : ""}
                </div>
            </div>

            {/* Affichage de l'image principale */}
            <div className="lg:w-[80%] order-1 lg:order-2 mb-4">
                <div className="w-full aspect-w-1 aspect-h-1 max-h-[500px]">
                    <img
                        src={mainImage}
                        alt="product"
                        className="w-full h-full object-contain rounded-lg shadow-xl"
                    />
                </div>
            </div>
        </div>
    );
};

export default Gallery;
