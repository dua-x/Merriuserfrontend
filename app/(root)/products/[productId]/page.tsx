"use client";
import React, { useEffect, useState, use } from "react";
import Gallery from "@/components/Gallery";
import ClientReviews from "@/components/ClientReviews";
import { getProductDetails, getCollectionDetails } from "@/lib/action";
import ProductInfo from "@/components/ProductInfo";
import MightLike from "@/components/MightLike";
import Comment from "@/components/Comment";

const ProductDetails = ({ params }: { params: Promise<{ productId: string }> }) => {
  const { productId } = use(params);

  const [productDetails, setProductDetails] = useState<any>(null);
  const [similarProducts, setSimilarProducts] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const product = await getProductDetails(productId);
        setProductDetails(product);

        if (product?.category?._id) {
          const collection = await getCollectionDetails(product.category._id);
          setSimilarProducts(collection);
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId]); // Use productId instead of params

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
        <div className="relative w-24 h-24 flex items-center justify-center">
          <div className="absolute w-24 h-24 border-4 border-[#C4A484] border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute w-16 h-16 border-4 border-[#857B74] border-t-transparent rounded-full animate-spin-slow"></div>
          <span className="text-[#C4A484] font-bold text-2xl tracking-wide">M</span>
        </div>
        <p className="mt-6 text-[#857B74] text-lg font-semibold tracking-wide">
          Elevating Your Style at
          <span className="text-[#C4A484] font-bold"> Merri Store</span>...
        </p>
        <p className="mt-2 text-sm text-gray-500 opacity-80 animate-fade-in">
          Just a moment, fashion takes time.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto flex justify-center items-start gap-16 py-4 px-6 lg:py-4 lg:px-16 lg:flex-row max-md:flex-col max-md:items-center">
        <ProductInfo productInfo={productDetails} />
      </div>

      <MightLike similarProducts={similarProducts} />
      <div className="max-w-7xl mx-auto py-12 px-6 lg:py-16 lg:px-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 w-full">
          <div className="w-full lg:w-1/3">
            <Comment productid={productId} />
          </div>
          <div className="w-full lg:w-2/3">
            <ClientReviews productID={productId} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
