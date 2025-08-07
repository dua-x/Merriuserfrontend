import React from "react";
import ProductCard from "@/components/ProductCard";
import { getSearchedProducts } from "@/lib/action";

interface SearchPageProps {
  params: { query: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

const SearchPage = async ({ params }: SearchPageProps) => {
  try {
    const decodedQuery = decodeURIComponent(params.query);
    
    if (!decodedQuery || decodedQuery.trim().length === 0) {
      return (
        <div className="px-4 py-5 sm:px-6 lg:px-8">
          <h1 className="text-heading3-bold my-10 text-center">
            Please enter a valid search term
          </h1>
        </div>
      );
    }

    const searchedProducts = await getSearchedProducts(decodedQuery);

    return (
      <div className="px-4 py-5 sm:px-6 lg:px-8">
        <h1 className="text-heading3-bold my-10">
          Search results for "{decodedQuery}"
        </h1>
        
        {!searchedProducts?.length ? (
          <div className="text-center py-10">
            <p className="text-body-bold my-5">
              No products found matching "{decodedQuery}"
            </p>
            <p className="text-gray-500">
              Try different keywords or check for spelling mistakes
            </p>
          </div>
        ) : (
          <>
            <p className="text-gray-500 mb-6">
              Found {searchedProducts.length} result{searchedProducts.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {searchedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error in SearchPage:", error);
    return (
      <div className="px-4 py-5 sm:px-6 lg:px-8 text-center">
        <h1 className="text-heading3-bold my-10">
          Something went wrong
        </h1>
        <p className="text-body-bold my-5">
          We couldn't complete your search. Please try again later.
        </p>
      </div>
    );
  }
};

export const dynamic = "force-dynamic";
export default SearchPage;