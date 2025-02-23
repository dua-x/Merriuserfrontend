"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { getCollections } from "@/lib/action";
import { playfair } from '@/app/fonts/font'; // le fichier de l'étape 1

export default function CollectionsMenu({
    selectedCollectionId,
}: {
    selectedCollectionId?: string;
}) {
    const [collections, setCollections] = useState<CollectionType[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
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
            const cardWidth = card.clientWidth + 16; // espace entre les items
            const scrollAmount = direction === "left" ? -cardWidth : cardWidth;
            containerRef.current.scrollBy({
                left: scrollAmount,
                behavior: "smooth",
            });
            setTimeout(checkScrollPosition, 300);
        }
    };

    const selectedCollection =
        collections.find((c) => c._id === selectedCollectionId) || null;

    return (
        <div className="w-full px-6 py-8 bg-white rounded-xl shadow-lg">
            {/* Mobile Layout */}
            <div className="md:hidden">
                <h1 className={`
                                          ${playfair.className} 
                                          text-3xl
                                          font-bold 
                                          leading-tight 
                                          tracking-wide
                                          text-center text-2xl font-semibold text-custom-brown"
                                        `}
                >
                    {"Discover Our Collections"}
                </h1>
                <div className="relative flex items-center justify-center">
                    {canScrollLeft && (
                        <button
                            onClick={() => scroll("left")}
                            className="absolute left-2 bg-gray-800 text-white p-2 rounded-full shadow hover:bg-gray-700 z-10 transition-transform duration-300"
                        >
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
                                        className={`flex flex-col items-center cursor-pointer transition-transform transform hover:scale-105 ${isSelected ? "border-b-4 border-blue-500 pb-2" : ""
                                            }`}
                                    >
                                        <div
                                            className={`relative ${isSelected ? "w-32 h-32" : "w-24 h-24"
                                                } rounded-lg overflow-hidden shadow-md`}
                                        >
                                            <Image
                                                src={collection.icon}
                                                alt={collection.name}
                                                fill
                                                style={{ objectFit: "cover" }}
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
                        <button
                            onClick={() => scroll("right")}
                            className="absolute right-2 bg-gray-800 text-white p-2 rounded-full shadow hover:bg-gray-700 z-10 transition-transform duration-300"
                        >
                            <ChevronRightIcon className="w-6 h-6" />
                        </button>
                    )}
                </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:flex w-full mx-auto">
                {/* Left column (25%): Selected Collection Name */}
                <div className="w-1/4 flex flex-col items-start justify-center pr-6 border-r border-gray-300">
                    <h1 className={`
                                          ${playfair.className} 
                                          md:text-3xl 
                                          lg:text-4xl 
                                          font-bold 
                                          leading-tight 
                                          tracking-wide
                                          text-center text-2xl font-semibold text-custom-brown"
                                        `}
                    >
                        {"Discover Our Collections"}
                    </h1>
                </div>
                {/* Right column (75%): Carousel */}
                <div className="w-3/4 relative flex items-center">
                    {canScrollLeft && (
                        <button
                            onClick={() => scroll("left")}
                            className="absolute left-2 bg-gray-800 text-white p-2 rounded-full shadow hover:bg-gray-700 z-10 transition-transform duration-300"
                        >
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
                                        className={`flex flex-col items-center cursor-pointer transition-transform transform hover:scale-105 ${isSelected ? "border-b-4 border-blue-500 pb-2" : ""
                                            }`}
                                    >
                                        <div
                                            className={`relative ${isSelected ? "w-32 h-32" : "w-24 h-24"
                                                } rounded-lg overflow-hidden shadow-md`}
                                        >
                                            <Image
                                                src={collection.icon}
                                                alt={collection.name}
                                                fill
                                                style={{ objectFit: "cover" }}
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
                        <button
                            onClick={() => scroll("right")}
                            className="absolute right-2 bg-gray-800 text-white p-2 rounded-full shadow hover:bg-gray-700 z-10 transition-transform duration-300"
                        >
                            <ChevronRightIcon className="w-6 h-6" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
