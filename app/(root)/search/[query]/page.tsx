import React from "react";
import ProductCard from "@/components/ProductCard";
import { getSearchedProducts } from "@/lib/action";

const SearchPage = async ({ params }: { params: Promise<{ query: string }> }) => {
    const { query } = await params; // Awaiting the promise
    const searchedProducts = await getSearchedProducts(query);
    const decodedQuery = decodeURIComponent(query);

    return (
        <div className="px-10 py-5">
            <p className="text-heading3-bold my-10">
                Search results for "{decodedQuery}"
            </p>
            {!searchedProducts?.length ? (
                <p className="text-body-bold my-5">No results found</p>
            ) : (
                <div className="flex flex-wrap justify-between gap-16">
                    {searchedProducts.map((product: ProductType) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export const dynamic = "force-dynamic";

export default SearchPage;
