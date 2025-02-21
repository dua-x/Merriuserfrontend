'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getCollections } from "@/lib/action";

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
    <div className="w-full px-5 py-8 text-center">
      <h1 className="text-3xl font-bold text-[#857B74] drop-shadow-lg">Collections</h1>

      {!collections || collections.length === 0 ? (
        <p className="text-red-500 text-center mt-5">No collections found</p>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6 mt-8">
          {collections.map((collection: CollectionType) => (
            <Link href={`/collections/${collection._id}`} key={collection._id}>
              <div className="relative shadow-lg rounded-xl overflow-hidden bg-white p-5 hover:scale-105 transition-transform">
                <img
                  src={collection.icon}
                  alt={collection.name}
                  className="rounded-lg w-full sm:h-64 h-32 object-cover"
                />
                <p className="mt-2 text-body font-semibold">{collection.name}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Collections;

