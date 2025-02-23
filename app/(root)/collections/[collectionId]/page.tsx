import ProductCard from "@/app/components/ProductCard";
import { getCollectionDetails } from "@/lib/action";
import Image from "next/image";
import React from "react";
import CollectionsMenu from "@/app/components/CollectinMenu";

const CollectionDetails = async ({ params }: { params: { collectionId: string } }) => {
    const collectionDetails = await getCollectionDetails(params.collectionId);

    if (!collectionDetails) {
        return <p className="text-center text-gray-500">Loading collection details...</p>;
    }

    return (
        <div className="m-1 justify-center">
            {/* Pass the collectionId correctly */}
            <CollectionsMenu selectedCollectionId={params.collectionId} />
            <h1 className="text-center text-2xl font-semibold text-gray-800 m-6">
                {collectionDetails.category?.name}
            </h1>
            <h3 className="text-black text-center max-w-[900px]">
                {collectionDetails.category?.description || "No description available"}
            </h3>
            {/* Products list */}
            <div className="flex flex-wrap gap-16 justify-center m-8">

                {collectionDetails.product?.length > 0 ? (
                    collectionDetails.product.map((product: ProductType) => (
                        <ProductCard key={product._id} product={product} />
                    ))
                ) : (
                    <p className="text-gray-500">No products available.</p>
                )}
            </div>
        </div>
    );
};

export default CollectionDetails;


//  {/* Responsive container for image and text */}
//  <div className="flex flex-col md:flex-row items-center">
//  {/* Image container with explicit dimensions on md screens */}
//  <div className="relative w-full md:w-1/3 h-[90vh]">
//      {collectionDetails.category?.icon && (
//          <Image
//              src={collectionDetails.category.icon}
//              alt="collection"
//              layout="fill"
//              objectFit="cover"
//              priority
//          />
//      )}
//      {/* Overlay for mobile */}
//      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 md:hidden">
//          <p className="text-white text-6xl leading-tight tracking-wide drop-shadow-lg">
//              {collectionDetails.category?.name || "No Name"}
//          </p>
//          <p className="text-body-normal text-grey-2 text-center max-w-[900px]">
//              {collectionDetails.category?.description || "No description available"}
//          </p>
//      </div>
//  </div>

//  {/* Text container for larger screens */}
//  <div className="hidden md:flex flex-col justify-center p-8 w-full md:w-1/2">
//      <p className="text-6xl leading-tight tracking-wide drop-shadow-lg">
//          {collectionDetails.category?.name || "No Name"}
//      </p>
//      <p className="mt-4 text-body-normal text-grey-2 max-w-[900px]">
//          {collectionDetails.category?.description || "No description available"}
//      </p>
//  </div>
// </div>