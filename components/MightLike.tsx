"use client";
import React, { useRef } from "react";
import ProductCard from "@/components/ProductCard";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const MightLike = ({ similarProducts }: { similarProducts: any }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (containerRef.current) {
            const scrollAmount = 300;
            containerRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    if (!similarProducts?.product?.length) {
        return <p className="text-gray-500 text-center">No similar products found.</p>;
    }

    return (
        <div className="max-w-7xl mx-auto py-12 px-6 lg:px-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Products You Might Like</h2>
            <div className="relative w-full px-5 py-8 text-center">
                <div className="relative flex items-center justify-center">
                    <button
                        onClick={() => scroll("left")}
                        className="absolute left-0 bg-gray-800 text-white p-2 rounded-full shadow-md hover:bg-gray-700 z-10 hidden md:flex"
                    >
                        <ChevronLeftIcon className="w-6 h-6" />
                    </button>

                    <div
                        ref={containerRef}
                        className="flex overflow-x-auto gap-4 px-4 scrollbar-hide snap-x snap-mandatory scroll-smooth
                        w-full items-center justify-center justify-start"
                    >
                        {similarProducts.product.map((product: any) => (
                            <div
                                key={product._id}
                                className="snap-center shrink-0 w-[80%] sm:w-[60%] md:w-[40%] lg:w-[25%] xl:w-[20%] flex justify-center"
                            >
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => scroll("right")}
                        className="absolute right-0 bg-gray-800 text-white p-2 rounded-full shadow-md hover:bg-gray-700 z-10 hidden md:flex"
                    >
                        <ChevronRightIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="mt-3 text-center text-gray-500 text-sm md:hidden animate-bounce">
                    Swipe left or right to explore →
                </div>
            </div>
        </div>
    );
};

export default MightLike;
