
import React from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import { getProducts } from "@/lib/action"




const ProductList = async () => {
  try {
    const products = await getProducts();
    return (
      <div className="flex flex-col items-center gap-10 py-8 px-5">
        <h1 className="text-body-bold">Products</h1>
        {!products || products.length === 0 ? (
          <p className="text-body-bold">No products found</p>
        ) : (
          <div className="flex flex-wrap mx-auto gap-16">
            {products.map((product: ProductType) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    );
  } catch (error) {
    return (
      <div className="flex flex-col items-center gap-10 py-8 px-5">
        <h1 className="text-body-bold">Products</h1>
        <p className="text-body-bold text-red-500">Error fetching products</p>
      </div>
    );
  }
};

export default ProductList;
