"use client";
import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import { useRouter } from "next/navigation";
import { getWishListByUser } from "@/lib/action";
import { Heart, ShoppingBag } from "lucide-react";

const Wishlist = () => {
    const router = useRouter();
    const [wishlist, setWishlist] = useState<{ product: ProductType[] } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWishlist = async () => {
            const data = await getWishListByUser();
            setWishlist(data);
            setLoading(false);
        };
        fetchWishlist();
    }, []); // ✅ Fixed infinite loop

    if (loading) {
        return (
            <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
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
        <div className="px-6 lg:px-20 py-10 bg-gray-40 min-h-screen max-w-[1600px] mx-auto">
            <div className="flex items-center justify-between mb-10">
                <h1 className="text-3xl font-bold text-[#857B74] drop-shadow-lg">
                    Your Wishlist <Heart className="inline-block text-red-500" />
                </h1>
            </div>

            {wishlist && wishlist.product.length === 0 ? (
                <div className="flex flex-col items-center text-center">
                    <p className="text-lg text-gray-500">No items in your wishlist yet.</p>
                    <button
                        className="mt-6 flex items-center gap-2 border rounded-lg text-lg font-medium bg-[#C4A484] text-white py-3 px-6 hover:bg-[#a98c68] transition"
                        onClick={() => router.push("/#collections")}
                    >
                        <ShoppingBag /> Start Shopping
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                    {wishlist?.product.map((product: ProductType) => (
                        <div key={product._id} className="relative shadow-lg rounded-xl overflow-hidden bg-white p-5 transition-transform transform hover:scale-105">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
