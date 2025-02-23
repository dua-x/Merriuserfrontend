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

    // Check scroll position on mount and when products change
    useEffect(() => {
        checkScrollPosition();
        const container = containerRef.current;
        if (container) {
            container.addEventListener("scroll", checkScrollPosition);
            return () =>
                container.removeEventListener("scroll", checkScrollPosition);
        }
    }, [products]);

    // Reset scroll position on mount
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTo({ left: 0, behavior: "auto" });
        }
    }, []);

    // Listen for window resize events to re-check scroll position
    useEffect(() => {
        window.addEventListener("resize", checkScrollPosition);
        return () => window.removeEventListener("resize", checkScrollPosition);
    }, []);

    const scroll = (direction: "left" | "right") => {
        if (containerRef.current) {
            // Use the first child for measuring width
            const card = containerRef.current.children[0] as HTMLElement;
            if (!card) return;
            // Here, card.clientWidth should be 220px (as defined by auto-cols-[220px]).
            // If you need to account for the gap (gap-4 equals 16px), you could add it:
            // const scrollAmount = direction === "left" ? -(card.clientWidth + 16) : card.clientWidth + 16;
            const scrollAmount =
                direction === "left" ? -card.clientWidth : card.clientWidth;
            containerRef.current.scrollBy({
                left: scrollAmount,
                behavior: "smooth",
            });
        }
    };

    return (
        <div className="relative w-full flex flex-col lg:justify-center items-center px-6 py-8 overflow-hidden">
            <h1 className="text-3xl font-bold text-[#857B74] drop-shadow-lg">
                Products
            </h1>

            <div className="relative w-full max-w-[90%]">
                {/* Left Scroll Button */}
                {canScrollLeft && (
                    <button
                        onClick={() => scroll("left")}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-[#857B74] text-white p-3 rounded-full shadow-md hover:bg-[#6f645b] z-10 hidden md:flex transition-all duration-300"
                    >
                        <ChevronLeftIcon className="w-8 h-8" />
                    </button>
                )}

                {/* Product Container using grid layout */}
                <div
                    ref={containerRef}
                    className="grid grid-flow-col auto-cols-[220px] items-center gap-4 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory w-full max-w-[1000px]"
                    style={{ scrollPaddingLeft: "16px" }}
                >
                    {products.length === 0 ? (
                        <p className="text-red-500 text-center w-full">
                            No products found
                        </p>
                    ) : (
                        products.map((product) => (
                            <div
                                key={product._id}
                                className="snap-center flex justify-center items-center"
                            >
                                <ProductCard product={product} />
                            </div>
                        ))
                    )}
                </div>

                {/* Right Scroll Button */}
                {canScrollRight && (
                    <button
                        onClick={() => scroll("right")}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#857B74] text-white p-3 rounded-full shadow-md hover:bg-[#6f645b] z-10 hidden md:flex transition-all duration-300"
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
