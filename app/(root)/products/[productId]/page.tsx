"use client";
import React, { useRef, useEffect, useState } from "react";
import Gallery from "@/app/components/Gallery";
import Feedback from "@/app/components/FeedBack";
import { getProductDetails, getCollectionDetails } from "@/lib/action";
import ProductInfo from "@/app/components/ProductInfo";
import MightLike from "@/app/components/MightLike";
import Comment from "@/app/components/Comment";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const ProductDetails = ({ params }: { params: { productId: string } }) => {
  const [productDetails, setProductDetails] = useState<any>(null);
  const [similarProducts, setSimilarProducts] = useState<any>(null);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Start loading

      try {
        const product = await getProductDetails(params.productId);
        setProductDetails(product);

        if (product?.category?._id) {
          const collection = await getCollectionDetails(product.category._id);
          setSimilarProducts(collection);
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
        {/* Animated Logo or Icon */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          <div className="absolute w-24 h-24 border-4 border-[#C4A484] border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute w-16 h-16 border-4 border-[#857B74] border-t-transparent rounded-full animate-spin-slow"></div>
          <span className="text-[#C4A484] font-bold text-2xl tracking-wide">M</span>
        </div>

        {/* Stylish Text */}
        <p className="mt-6 text-[#857B74] text-lg font-semibold tracking-wide">
          Elevating Your Style at
          <span className="text-[#C4A484] font-bold"> Merri Store</span>...
        </p>

        {/* Smooth Fade-in Effect */}
        <p className="mt-2 text-sm text-gray-500 opacity-80 animate-fade-in">
          Just a moment, fashion takes time.
        </p>
      </div>
    );
  }

  return (
    <>

      {/* Product dtails Section */}

      <div className=" max-w-7xl mx-auto flex justify-center items-start gap-16 py-12 px-6 lg:py-16 lg:px-16 lg:flex-row max-md:flex-col max-md:items-center ">
        <Gallery productImage={productDetails?.images || []} />
        <ProductInfo productInfo={productDetails} />
      </div>

      <MightLike similarProducts={similarProducts} />
      <div className="max-w-7xl mx-auto py-12 px-6 lg:py-16 lg:px-16">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-8 w-full">
          {/* Comment Section */}
          <div className="w-full lg:w-1/3">
            <Comment productid={params.productId} />
          </div>

          {/* Feedback Section */}
          <div className="w-full lg:w-2/3">
            <Feedback productID={params.productId} />

          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
