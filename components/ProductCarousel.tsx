"use client";
import { useRef, useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { getfeaturedproduct } from "@/lib/action";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { playfair } from "@/app/fonts/font";

interface ProductCarouselProps {
    initialProducts: ProductType[];
}

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

const ProductCarousel = ({ initialProducts }: ProductCarouselProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [featuredProducts, setFeaturedProducts] = useState<ProductType[]>(initialProducts);
    const [loading, setLoading] = useState(false);


    const checkScrollPosition = () => {
        if (!containerRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
    };

    useEffect(() => {
        const refreshProducts = async () => {
            setLoading(true);
            try {
                const products = await getfeaturedproduct();
                setFeaturedProducts(products);
            } catch (error) {
                console.error("Error refreshing products:", error);
            } finally {
                setLoading(false);
            }
        };

        // Refresh immediately on mount
        refreshProducts();

        // Set up periodic refresh (every 30 seconds)
        const interval = setInterval(refreshProducts, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        checkScrollPosition();
        const container = containerRef.current;
        if (container) {
            container.addEventListener("scroll", checkScrollPosition);
            return () =>
                container.removeEventListener("scroll", checkScrollPosition);
        }
    }, [featuredProducts]);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTo({ left: 0, behavior: "auto" });
        }
    }, []);

    useEffect(() => {
        window.addEventListener("resize", checkScrollPosition);
        return () => window.removeEventListener("resize", checkScrollPosition);
    }, []);

    const scroll = (direction: "left" | "right") => {
        if (containerRef.current) {
            const card = containerRef.current.children[0] as HTMLElement;
            if (!card) return;
            const scrollAmount =
                direction === "left" ? -card.clientWidth * 2 : card.clientWidth * 2;
            containerRef.current.scrollBy({
                left: scrollAmount,
                behavior: "smooth",
            });
        }
    };

    // Auto-scrolling
    useEffect(() => {
        if (isHovered || !containerRef.current) return;

        const interval = setInterval(() => {
            containerRef.current?.scrollBy({
                left: 250,
                behavior: "smooth",
            });

            checkScrollPosition();
        }, 2500);

        return () => clearInterval(interval);
    }, [isHovered]);

    return (
        <div 
            className="relative w-full flex flex-col items-center py-8 overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <h1 className={`${playfair.className} text-4xl font-bold drop-shadow-lg mt-10 leading-tight 
                 text-center text-custom-brown`}>
                Discover Our Product Collection
            </h1>

            <div className="relative w-full max-w-[90%] mt-8">
                {/* Left Scroll Button */}
                <ChevronButton
                    direction="left"
                    onClick={() => scroll("left")}
                    visible={canScrollLeft}
                />

                {/* Product Container */}
                <div
                    ref={containerRef}
                    className="grid grid-flow-col auto-cols-[220px] items-center gap-6 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory w-full py-4"
                    style={{ scrollPaddingLeft: "16px" }}
                >
                    {featuredProducts.length === 0 ? (
                        <p className="text-red-500 text-center w-full">
                            No featured products found
                        </p>
                    ) : (
                        featuredProducts.map((product) => (
                            <div
                                key={product._id}
                                className="snap-center shadow-md rounded-lg bg-white flex justify-center items-center transition-transform hover:scale-105"
                            >
                                <ProductCard product={product} />
                            </div>
                        ))
                    )}
                </div>

                {/* Right Scroll Button */}
                <ChevronButton
                    direction="right"
                    onClick={() => scroll("right")}
                    visible={canScrollRight}
                />
            </div>

            {/* Mobile Swipe Instruction */}
            <div className="mt-4 text-center text-gray-500 text-sm md:hidden animate-pulse">
                Swipe left or right to explore →
            </div>
        </div>
    );
};

export default ProductCarousel;