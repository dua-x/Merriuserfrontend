import ProductCard from "@/app/components/ProductCard";
import { getCollectionDetails } from "@/lib/action";
import React from "react";

const CollectionDetails = async ({
    params,
}: {
    params: { collectionId: string };
}) => {
    if (!params?.collectionId) {
        return <p className="text-center text-red-500">Invalid collection ID</p>;
    }

    const collectionDetails = await getCollectionDetails(params.collectionId);

    if (!collectionDetails) {
        return <p className="text-center text-gray-500">Loading collection details...</p>;
    }

    return (
        <div className="px-10 py-5 flex flex-col items-center gap-8">
            {collectionDetails.category?.icon && (
                <img
                    src={collectionDetails.category.icon}
                    alt="collection"
                    className="w-full h-[400px] object-cover rounded-xl"
                />
            )}
            <p className="text-heading3-bold text-grey-2">{collectionDetails.category?.name || "No Name"}</p>
            <p className="text-body-normal text-grey-2 text-center max-w-[900px]">
                {collectionDetails.category?.description || "No description available"}
            </p>
            <div className="flex flex-wrap gap-16 justify-center">
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
export const dynamic = "force-dynamic";
