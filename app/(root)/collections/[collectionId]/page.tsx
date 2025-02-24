import ProductCard from "@/components/ProductCard";
import { getCollectionDetails } from "@/lib/action";
import React from "react";
import CollectionsMenu from "@/components/CollectinMenu";

const CollectionDetails = async ({ params }: { params: Promise<{ collectionId: string }> }) => {
    const { collectionId } = await params;
    const collectionDetails = await getCollectionDetails(collectionId); // Use the destructured value

    if (!collectionDetails) {
        return <p className="text-center text-gray-500">Loading collection details...</p>;
    }

    return (
        <div className="m-1 justify-center">
            <CollectionsMenu selectedCollectionId={collectionId} />
            <h1 className="text-center text-2xl font-semibold text-gray-800 m-6">
                {collectionDetails.category?.name}
            </h1>
            <h3 className="text-black text-center max-w-[900px]">
                {collectionDetails.category?.description || "No description available"}
            </h3>
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
