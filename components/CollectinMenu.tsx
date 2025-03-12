"use client";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { getCollections } from "@/lib/action";
import { playfair } from "@/app/fonts/font";

export default function CollectionsMenu({
    selectedCollectionId,
}: {
    selectedCollectionId?: string;
}) {
    const [collections, setCollections] = useState<CollectionType[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    // We'll assign the ref to the selected item
    const selectedRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    // Fetch collections on mount
    useEffect(() => {
        async function fetchData() {
            const data = await getCollections();
            setCollections(data);
        }
        fetchData();
    }, []);

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
            return () => container.removeEventListener("scroll", checkScrollPosition);
        }
    }, [collections]);

    const scroll = (direction: "left" | "right") => {
        if (containerRef.current) {
            const card = containerRef.current.children[0] as HTMLDivElement;
            if (!card) return;
            const cardWidth = card.clientWidth + 16; // space between items
            const scrollAmount = direction === "left" ? -cardWidth : cardWidth;
            containerRef.current.scrollBy({
                left: scrollAmount,
                behavior: "smooth",
            });
            setTimeout(checkScrollPosition, 300);
        }
    };

    // Scroll to the selected item on page refresh.
    useLayoutEffect(() => {
        const timer = setTimeout(() => {
            if (!containerRef.current || !selectedRef.current) return;
            const container = containerRef.current;
            const selected = selectedRef.current;
            // Check if the selected collection is the last one.
            if (
                collections.length > 0 &&
                collections[collections.length - 1]._id === selectedCollectionId
            ) {
                // Scroll so the container's right edge aligns with its content.
                container.scrollTo({ left: container.scrollWidth - container.clientWidth, behavior: "smooth" });
            } else {
                // Compute the offset based on the selected element's position.
                const selectedLeft = selected.offsetLeft;
                const selectedWidth = selected.clientWidth;
                const containerWidth = container.clientWidth;
                const scrollLeft = selectedLeft - (containerWidth / 2 - selectedWidth / 2);
                container.scrollTo({ left: scrollLeft, behavior: "smooth" });
            }
        }, 300); // 300ms delay helps ensure rendering is complete.
        return () => clearTimeout(timer);
    }, [collections, selectedCollectionId]);

    return (
        <div className="w-full px-6 pt-8 bg-white rounded-xl shadow-lg">
            {/* Mobile Layout */}
            <div className="md:hidden">
                <h1 className={`${playfair.className} text-3xl font-bold leading-tight tracking-wide text-center text-2xl font-semibold text-custom-brown`}>
                    Discover Our Collections
                </h1>
                <div className="relative flex items-center justify-center">
                    {canScrollLeft && (
                        <button onClick={() => scroll("left")} className="absolute left-2 bg-gray-800 text-white p-2 rounded-full shadow hover:bg-gray-700 z-10 transition-transform duration-300">
                            <ChevronLeftIcon className="w-6 h-6" />
                        </button>
                    )}
                    <div
                        ref={containerRef}
                        className="grid grid-flow-col gap-4 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory px-2 py-2"
                        style={{ scrollPaddingLeft: "16px" }}
                    >
                        {collections.map((collection: CollectionType) => {
                            const isSelected = collection._id === selectedCollectionId;
                            return (
                                <Link key={collection._id} href={`/collections/${collection._id}`}>
                                    <div
                                        ref={isSelected ? selectedRef : null}
                                        className={`flex flex-col items-center cursor-pointer transition-transform transform hover:scale-105 ${isSelected ? "border-b-4 border-blue-500 pb-2" : ""}`}
                                    >
 <div className={`relative ${isSelected ? "w-32 h-32" : "w-24 h-24"} rounded-lg overflow-hidden shadow-md`}>
                                                <img
                                                    src={collection.icon}
                                                    alt={collection.name}
                                                    className="aspect-[3/4] object-cover"
                                                />

                                        </div>
                                        <p className="mt-2 text-sm font-medium text-gray-700">
                                            {collection.name}
                                        </p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                    {canScrollRight && (
                        <button onClick={() => scroll("right")} className="absolute right-2 bg-gray-800 text-white p-2 rounded-full shadow hover:bg-gray-700 z-10 transition-transform duration-300">
                            <ChevronRightIcon className="w-6 h-6" />
                        </button>
                    )}
                </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:flex w-full mx-auto">
                <div className="w-1/4 flex flex-col items-start justify-center pr-6 border-r border-gray-300">
                    <h1 className={`${playfair.className} md:text-3xl lg:text-4xl font-bold leading-tight tracking-wide text-center text-2xl font-semibold text-custom-brown`}>
                        Discover Our Collections
                    </h1>
                </div>
                <div className="w-3/4 relative flex items-center">
                    {canScrollLeft && (
                        <button onClick={() => scroll("left")} className="absolute left-2 bg-gray-800 text-white p-2 rounded-full shadow hover:bg-gray-700 z-10 transition-transform duration-300">
                            <ChevronLeftIcon className="w-6 h-6" />
                        </button>
                    )}
                    <div
                        ref={containerRef}
                        className="grid grid-flow-col gap-4 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory px-2 py-2"
                        style={{ scrollPaddingLeft: "16px" }}
                    >
                        {collections.map((collection: CollectionType) => {
                            const isSelected = collection._id === selectedCollectionId;
                            return (
                                <Link key={collection._id} href={`/collections/${collection._id}`}>
                                    <div
                                        ref={isSelected ? selectedRef : null}
                                        className={`flex flex-col items-center cursor-pointer transition-transform transform hover:scale-105 ${isSelected ? "border-b-4 border-blue-500 pb-2" : ""}`}
                                    >
                                        <div className={`relative ${isSelected ? "w-32 h-32" : "w-24 h-24"} rounded-lg overflow-hidden shadow-md`}>
                                            <img src={collection.icon} alt={collection.name} style={{ objectFit: "cover" }} />
                                        </div>
                                        <p className="mt-2 text-sm font-medium text-gray-700">
                                            {collection.name}
                                        </p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                    {canScrollRight && (
                        <button onClick={() => scroll("right")} className="absolute right-2 bg-gray-800 text-white p-2 rounded-full shadow hover:bg-gray-700 z-10 transition-transform duration-300">
                            <ChevronRightIcon className="w-6 h-6" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
