'use client';
import { useState } from "react";
import HeartFavorite from "./HeartFavorite";
import { MinusCircle, PlusCircle } from "lucide-react";
import { createcarte } from "@/lib/action";

const ProductInfo = ({ productInfo }: { productInfo: ProductType }) => {
    if (!productInfo) {
        return <p>Loading product details...</p>;
    }

    const [loading, setloading] = useState(false);//loading button

    const [selectedColor, setSelectedColor] = useState<string>(
        productInfo?.productdetail?.[0]?.color || ""
    );

    const selectedColorDetails = productInfo.productdetail.find(
        (detail) => detail.color === selectedColor
    );

    const availableSizes = selectedColorDetails?.sizes || [];
    const [selectedSize, setSelectedSize] = useState<number>(
        availableSizes[0]?.size || 0
    );
    const selectedStock =
        availableSizes.find(({ size }) => size === selectedSize)?.stock || 0;
    const [quantity, setQuantity] = useState<number>(1);

    const handleSizeChange = (size: number, stock: number) => {
        setSelectedSize(size);
        setQuantity(stock > 0 ? 1 : 0);
    };

    const formattedPrice = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "DZD",
    }).format(Number(productInfo.Price));




    return (
        <div className="w-full lg:max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-2xl border border-gray-200 flex flex-col lg:flex-row gap-10">
            {/* Left Section - Product Details */}
            <div className="w-full lg:w-2/3 flex flex-col gap-6">
                <div className="flex justify-between items-center">
                    <p className="text-2xl font-bold text-gray-900">{productInfo.name}</p>
                    <HeartFavorite product={productInfo} />
                </div>
                <p className="text-gray-600 text-lg">{productInfo.description}</p>
                <div className="flex gap-2 text-gray-500 text-sm">
                    <p className="font-medium">Category:</p>
                    <p className="font-semibold text-gray-800">{productInfo.category.name}</p>
                </div>
                {/* Colors */}
                {productInfo.productdetail?.length > 0 && (
                    <div className="flex flex-col gap-2">
                        <p className="text-base-medium text-grey-2">Colors:</p>
                        <div className="flex gap-2">
                            {productInfo.productdetail.map((detail, index) => (
                                <p
                                    key={index}
                                    role="button"
                                    aria-label={`Select color ${detail.color}`}
                                    className={`border border-black px-2 py-1 rounded-lg cursor-pointer ${selectedColor === detail.color && "bg-black text-white"
                                        }`}
                                    onClick={() => {
                                        setSelectedColor(detail.color);
                                        handleSizeChange(detail.sizes[0]?.size || 0, detail.sizes[0]?.stock || 0);
                                    }}
                                >
                                    {detail.color}
                                </p>
                            ))}
                        </div>
                    </div>
                )}

                {/* Sizes */}
                {availableSizes.length > 0 && (
                    <div className="flex flex-col gap-2">
                        <p className="text-base-medium text-grey-2">Sizes:</p>
                        <div className="flex gap-2">
                            {availableSizes.map(({ size, stock }, index) => (
                                <p
                                    key={index}
                                    role="button"
                                    aria-disabled={stock === 0}
                                    className={`border border-black px-2 py-1 rounded-lg cursor-pointer ${selectedSize === size && "bg-black text-white"
                                        } ${stock === 0 && "cursor-not-allowed opacity-50"}`}
                                    onClick={() => stock > 0 && handleSizeChange(size, stock)}
                                >
                                    {size} {stock === 0 && "(Out of Stock)"}
                                </p>
                            ))}
                        </div>
                        {selectedStock > 0 && (
                            <p className="text-black text-sm">Stock available: {selectedStock}</p>
                        )}
                        {selectedStock === 0 && (
                            <p className="text-red-500 text-sm">This size is out of stock.</p>
                        )}
                    </div>
                )}


                {/* Quantity Selector */}
                <div className="flex flex-col gap-3">
                    <p className="text-gray-600 font-medium">Quantity:</p>
                    <div className="flex gap-4 items-center">
                        <MinusCircle
                            className={`cursor-pointer transition-all ${quantity <= 1 || selectedStock === 0
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:text-red-500"
                                }`}
                            onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                        />
                        <p className="text-lg font-semibold">{selectedStock > 0 ? quantity : 0}</p>
                        <PlusCircle
                            className={`cursor-pointer transition-all ${quantity >= selectedStock || selectedStock === 0
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:text-green-500"
                                }`}
                            onClick={() => quantity < selectedStock && setQuantity(quantity + 1)}
                        />
                    </div>
                </div>

                {/* Price & Add to Cart */}
                <p className="text-2xl font-bold text-gray-900">{formattedPrice}</p>
                <button
                    className={`w-full py-3 rounded-lg font-semibold text-lg transition-all ${selectedStock === 0
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-custom-beige border text-white hover:border-black hover:bg-[#a27a64]"
                        }`}
                    disabled={selectedStock === 0}
                    onClick={() =>
                        createcarte(
                            productInfo._id,
                            quantity,
                            selectedSize.toString(), // Convert size to string if needed
                            selectedColor
                        )
                    }

                >

                    {selectedStock === 0 ? "Out of Stock" : "Add To Cart"}
                </button>
                <button
                    className={`w-full py-3 rounded-lg font-semibold text-lg transition-all ${selectedStock === 0
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-custom-beige border text-white hover:border-black hover:bg-[#a27a64]"
                        }`}
                    disabled={selectedStock === 0}
                // onClick={
                //     ()
                //         =>
                //         Createorder(
                //             productInfo._id,
                //             quantity,
                //             selectedColor,
                //             selectedSize,
                //         )
                // }

                >

                    {selectedStock === 0 ? "Out of Stock" : "ACHETER MAINTENANT"}
                </button>


            </div>
        </div>
    );
};

export default ProductInfo;
