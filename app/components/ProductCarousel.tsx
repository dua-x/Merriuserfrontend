"use client";
import { useRef } from "react";
import ProductCard from "../components/ProductCard";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const ProductCarousel = ({ products }: { products: ProductType[] }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (containerRef.current) {
            const cardWidth = containerRef.current.children[0]?.clientWidth || 250;
            const gap = 16;
            containerRef.current.scrollBy({
                left: direction === "left" ? -(cardWidth + gap) : cardWidth + gap,
                behavior: "smooth",
            });
        }
    };

    return (
        <div className="relative w-full px-5 py-8 text-center">
            <h1 className="text-3xl font-bold text-[#857B74] drop-shadow-lg">Products</h1>

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
                    w-full items-center justify-start"
                >
                    {products.length === 0 ? (
                        <p className="text-red-500 text-center w-full">No products found</p>
                    ) : (
                        products.map((product) => (
                            <div
                                key={product._id}
                                className="snap-center shrink-0 w-[80%] sm:w-[60%] md:w-[40%] lg:w-[25%] xl:w-[20%] flex justify-center"
                            >
                                <ProductCard product={product} />
                            </div>
                        ))
                    )}
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
    );
};

export default ProductCarousel;
