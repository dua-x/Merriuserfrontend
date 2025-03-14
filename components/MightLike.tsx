"use client";
import { useRef, useState, useEffect } from "react";
import ProductCard from "./ProductCard";
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
const MightLike = ({ similarProducts }: { similarProducts: any }) => {
    const containerRef = useRef<HTMLDivElement>(null);
       const [canScrollLeft, setCanScrollLeft] = useState(false);
       const [canScrollRight, setCanScrollRight] = useState(false);
       const [isHovered, setIsHovered] = useState(false);
   
       const checkScrollPosition = () => {
           if (!containerRef.current) return;
           const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
           setCanScrollLeft(scrollLeft > 0);
           setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
       };
   
       useEffect(() => {
           checkScrollPosition();
           const container = containerRef.current;
           if (container) {
               container.addEventListener("scroll", checkScrollPosition);
               return () =>
                   container.removeEventListener("scroll", checkScrollPosition);
           }
       }, [similarProducts]);
   
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
   
       // Défilement automatique
       useEffect(() => {
           if (isHovered || !containerRef.current) return;
   
           const interval = setInterval(() => {
               containerRef.current?.scrollBy({
                   left: 250, // Taille d'un élément environ
                   behavior: "smooth",
               });
   
               checkScrollPosition();
           }, 2500); // Défilement toutes les 2.5 secondes
   
           return () => clearInterval(interval);
       }, [isHovered]);
   

    if (!similarProducts?.product?.length) {
        return <p className="text-gray-500 text-center">No similar products found.</p>;
    }

    return (
        <div 
        className="relative w-full flex flex-col items-center py-8 overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
    >
            <h2 className="text-2xl md:text-3xl font-bold p-10 text-gray-900 mb-6">Products You Might Like</h2>
            <div className="relative max-w-[90%] ">
               
  {/* Left Scroll Button */}
  <ChevronButton
                    direction="left"
                    onClick={() => scroll("left")}
                    visible={canScrollLeft}
                />

                    <div
                        ref={containerRef}
                        className="grid grid-flow-col auto-cols-[220px] items-center gap-6 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory w-full py-4"
                    style={{ scrollPaddingLeft: "16px" }}
                    >
                        {similarProducts.product.map((product: any) => (
                            <div
                                key={product._id}
                            className="snap-center p-2 shadow-md rounded-lg bg-white flex justify-center items-center transition-transform hover:scale-105"
                            >
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>

                    

  {/* Right Scroll Button */}
  <ChevronButton
                    direction="right"
                    onClick={() => scroll("right")}
                    visible={canScrollRight}
                />
                
                <div className="mt-3 text-center text-gray-500 text-sm md:hidden animate-bounce">
                    Swipe left or right to explore →
                </div>
            </div>
        </div>
    );
};

export default MightLike;
