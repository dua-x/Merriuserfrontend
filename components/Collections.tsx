'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getCollections } from "@/lib/action";
import { playfair } from "@/app/fonts/font";

const Collections = () => {
  const [collections, setCollections] = useState<CollectionType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      const data = await getCollections();
      setCollections(data);
      setLoading(false);
    };
    fetchCollections();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
        {/* Animated Loader */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          <div className="absolute w-24 h-24 border-4 border-[#C4A484] border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute w-16 h-16 border-4 border-[#857B74] border-t-transparent rounded-full animate-spin-slow"></div>
          <span className="text-[#C4A484] font-bold text-2xl tracking-wide">M</span>
        </div>
        <p className="mt-6 text-[#857B74] text-lg font-semibold tracking-wide">
          Elevating Your Style at
          <span className="text-[#C4A484] font-bold"> Merri Store</span>...
        </p>
        <p className="mt-2 text-sm text-gray-500 opacity-80 animate-fade-in">
          Just a moment, fashion takes time.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h1 className={`${playfair.className} text-3xl font-bold drop-shadow-lg mt-10 leading-tight tracking-wide 
      text-center text-2xl font-semibold text-custom-brown drop-shadow-lg`}>
        Discover Our Collections
      </h1>

      {!collections || collections.length === 0 ? (
        <p className="text-red-500 text-center mt-5">No collections found</p>
      ) : (
        <div className="flex justify-center w-full">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-8 gap-4 m-2 md:gap-6 md:m-6 max-w-[90%]">
            {collections.map((collection: CollectionType) => (
              <Link href={`/collections/${collection._id}`} key={collection._id}>
                <div className="relative group shadow-lg rounded-xl overflow-hidden">
                  <img
                    src={collection.icon}
                    alt={collection.name}
                    className="rounded-lg aspect-[3/4] object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <span className="text-white font-semibold text-lg tracking-wide">Shop Now</span>
                  </div>
                  <p className="mt-2 text-body font-semibold text-center">{collection.name}</p>
                </div>

              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Collections;
