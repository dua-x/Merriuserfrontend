"use client";
import { useRef, useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const ProductCarousel = ({ products }: { products: ProductType[] }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const checkScrollPosition = () => {
        if (!containerRef.current) return;

        const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
    };

    useEffect(() => {
        checkScrollPosition(); // Check on mount
        const container = containerRef.current;
        if (container) {
            container.addEventListener("scroll", checkScrollPosition);
            return () => container.removeEventListener("scroll", checkScrollPosition);
        }
    }, [products]);

    // Ensure first product is always visible on mobile
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTo({ left: 0, behavior: "instant" });
        }
    }, []);

    const scroll = (direction: "left" | "right") => {
        if (containerRef.current) {
            const card = containerRef.current.children[0] as HTMLDivElement;
            if (!card) return;

            const cardWidth = card.clientWidth + 16; // Includes margin/gap
            const scrollAmount = direction === "left" ? -cardWidth : cardWidth;

            containerRef.current.scrollBy({
                left: scrollAmount,
                behavior: "smooth",
            });

            setTimeout(checkScrollPosition, 300); // Ensure button updates after scroll
        }
    };

    return (
        <div className="relative w-full flex flex-col items-center px-5 py-8 overflow-hidden">
            <h1 className="text-3xl font-bold text-[#857B74] drop-shadow-lg">Products</h1>

            <div className="relative flex justify-center  items-center w-full max-w-[90%]">
                {/* Left Scroll Button - Only Show If Can Scroll Left */}
                {canScrollLeft && (
                    <button
                        onClick={() => scroll("left")}
                        className="absolute left-2 bg-[#857B74] text-white p-3 rounded-full shadow-md hover:bg-[#6f645b] z-10 hidden md:flex transition-all duration-300"
                    >
                        <ChevronLeftIcon className="w-8 h-8" />
                    </button>
                )}

                {/* Product Container */}
                <div
                    ref={containerRef}
                    className="flex overflow-x-auto gap-4 px-4 scrollbar-hide scroll-smooth snap-x snap-mandatory 
                    w-full max-w-[1000px] justify-center items-center"
                    style={{
                        scrollPaddingLeft: "16px", // Ensures first item is fully visible

                    }}
                >
                    {products.length === 0 ? (
                        <p className="text-red-500 text-center w-full">No products found</p>
                    ) : (
                        products.map((product, index) => (
                            <div
                                key={product._id}
                                className="snap-center shrink-0 w-[220px] flex justify-center items-center"
                                style={{
                                    marginLeft: index === 0 ? "0px" : "unset", // ✅ Fix for first item
                                }}
                            >
                                <ProductCard product={product} />
                            </div>
                        ))
                    )}
                </div>

                {/* Right Scroll Button - Only Show If Can Scroll Right */}
                {canScrollRight && (
                    <button
                        onClick={() => scroll("right")}
                        className="absolute right-2 bg-[#857B74] text-white p-3 rounded-full shadow-md hover:bg-[#6f645b] z-10 hidden md:flex transition-all duration-300"
                    >
                        <ChevronRightIcon className="w-8 h-8" />
                    </button>
                )}
            </div>

            {/* Mobile Swipe Instruction */}
            <div className="mt-3 text-center text-gray-500 text-sm md:hidden animate-bounce">
                Swipe left or right to explore →
            </div>
        </div>
    );
};

export default ProductCarousel;
