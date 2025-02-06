"use client"

import ProductCard from "@/app/components/ProductCard"
import { useRouter } from "next/navigation"
import { getWishListByUser } from "@/lib/action"

const Wishlist = async () => {
    const router = useRouter()
    const wishlist = await getWishListByUser();


    return (
        <div className="px-10 py-5">
            <p className="text-heading3-bold my-10">Your Wishlist</p>
            {wishlist.product.length === 0 ? (
                <>
                    <p>No items in your wishlist</p>
                    <button
                        className="border rounded-lg text-body-bold bg-white py-3 w-full hover:bg-black hover:text-white"
                        onClick={() => router.push("/shop")}
                    >
                        SHOPPING
                    </button>
                </>
            ) : (
                <div className="flex flex-wrap justify-center gap-16">
                    {wishlist.product.map((product: ProductType) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Wishlist
