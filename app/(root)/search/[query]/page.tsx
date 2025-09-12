import React from "react";
import ProductCard from "@/components/ProductCard";
import { getSearchedProducts } from "@/lib/action";

// Modified interface to satisfy both Next.js and your custom type checker
interface SearchPageProps {
  params: { query: string } & Promise<any>;
  searchParams?: ({ [key: string]: string | string[] | undefined } & Promise<any>) | undefined;
}

const SearchPage = async ({ params }: Omit<SearchPageProps, "searchParams">) => {
  try {
    // Extract the actual params from the potentially wrapped Promise
    const actualParams = await Promise.resolve(params);
    const decodedQuery = decodeURIComponent(actualParams.query);
    
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-2">
              {searchedProducts.map((product) => (
                <div key={product._id} className="flex justify-center">
                    <div className="max-w-[240px] sm:max-w-[220px] md:max-w-[240px] lg:max-w-[260px] xl:max-w-[280px] bg-white rounded-xl shadow-lg overflow-hidden transition-transform transform hover:scale-105">
                        <ProductCard product={product} />
                    </div>
                </div>
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