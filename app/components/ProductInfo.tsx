"use client"
import { useState } from "react";
import HeartFavorite from "./HeartFavorite";
import { MinusCircle, PlusCircle } from "lucide-react";
// import useCart from "@/lib/hooks/useCart";

const ProductInfo = ({ productInfo }: { productInfo: ProductType }) => {
    const [selectedColor, setSelectedColor] = useState<string>(
        productInfo?.productDetail?.[0]?.color || ""
    );
    const [selectedSize, setSelectedSize] = useState<number>(
        productInfo?.productDetail?.[0]?.sizes?.[0]?.size || 0
    ); if (!productInfo) {
        return <p>Loading product details...</p>;
    }

    const [quantity, setQuantity] = useState<number>(1);

    // const cart = useCart();

    const formattedPrice = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "DZD",
    }).format(Number(productInfo.Price));

    return (
        <div className="max-w-[400px] flex flex-col gap-4 p-4 bg-white shadow-md rounded-lg">
            {/* Header */}
            <div className="flex justify-between items-center">
                <p className="text-heading3-bold">{productInfo.name}</p>
                <HeartFavorite product={productInfo} />
            </div>

            {/* Category */}
            <div className="flex gap-2">
                <p className="text-base-medium text-grey-2">Category:</p>
                <p className="text-base-bold">{productInfo.category}</p>
            </div>

            {/* Price */}
            <p className="text-heading3-bold">{formattedPrice}</p>

            {/* Description */}
            <div className="flex flex-col gap-2">
                <p className="text-base-medium text-grey-2">Description:</p>
                <p className="text-small-medium">{productInfo.description}</p>
            </div>

            {/* Colors */}
            {productInfo.productDetail?.length > 0 && (
                <div className="flex flex-col gap-2">
                    <p className="text-base-medium text-grey-2">Colors:</p>
                    <div className="flex gap-2">
                        {productInfo.productDetail.map((detail, index) => (
                            <p
                                key={index}
                                role="button"
                                aria-label={`Select color ${detail.color}`}
                                className={`border border-black px-2 py-1 rounded-lg cursor-pointer ${selectedColor === detail.color && "bg-black text-white"
                                    }`}
                                onClick={() => setSelectedColor(detail.color)}
                            >
                                {detail.color}
                            </p>
                        ))}
                    </div>
                </div>
            )}

            {/* Sizes */}
            {productInfo.productDetail?.[0]?.sizes?.length > 0 && (
                <div className="flex flex-col gap-2">
                    <p className="text-base-medium text-grey-2">Sizes:</p>
                    <div className="flex gap-2">
                        {productInfo.productDetail[0].sizes.map(({ size, stock }, index) => (
                            <p
                                key={index}
                                aria-disabled={stock === 0} // Ensure stock is compared as a number
                                className={`border border-black px-2 py-1 rounded-lg cursor-pointer ${selectedSize === size && "bg-black text-white"
                                    } ${stock === 0 && "cursor-not-allowed opacity-50"}`}
                                onClick={() => stock > 0 && setSelectedSize(size)} // Ensure valid condition
                            >
                                {size} {stock === 0 && "(Out of Stock)"}
                            </p>
                        ))}
                    </div>
                </div>
            )}


            {/* Quantity Selector */}
            <div className="flex flex-col gap-2">
                <p className="text-base-medium text-grey-2">Quantity:</p>
                <div className="flex gap-4 items-center">
                    <MinusCircle
                        className="hover:text-red-1 cursor-pointer"
                        onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    />
                    <p className="text-body-bold">{quantity}</p>
                    <PlusCircle
                        className="hover:text-red-1 cursor-pointer"
                        onClick={() => setQuantity(quantity + 1)}
                    />
                </div>
            </div>

            {/* Add to Cart Button */}
            <button
                className="outline text-base-bold py-3 rounded-lg hover:bg-black hover:text-white"
            // onClick={() => {
            //     cart.addItem({
            //         item: productInfo,
            //         quantity,
            //         color: selectedColor,
            //         size: selectedSize,
            //     });
            // }}
            >
                Add To Cart
            </button>
        </div>
    );
};

export default ProductInfo;