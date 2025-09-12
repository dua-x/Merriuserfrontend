import React from 'react';
import Link from 'next/link';
import HeartFavorite from './HeartFavorite';
import Image from 'next/image'; // Consider using Next.js Image for optimization

const ProductCard = ({ product }: { product: ProductType }) => {
  const isOutOfStock = product.CountINStock !== undefined && product.CountINStock <= 0;

  return (
    <Link
      href={`/products/${product._id}`}
      key={product._id}
      className="group rounded-lg overflow-hidden shadow-xl transition-all hover:shadow-2xl hover:-translate-y-1 relative block"
    >
      {/* Badge Rupture de stock */}
      {isOutOfStock && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
          <div className="absolute top-4 left-4 z-30 bg-red-600/90 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md uppercase tracking-wide">
            Rupture de stock
          </div>
          <button className="px-5 py-2 bg-custom-brown text-white rounded-full text-sm font-medium shadow-lg 
                           hover:bg-white hover:text-custom-brown transition-all duration-300">
            View Details
          </button>
        </div>
      )}

      {/* Hover Overlay with CTA */}
      {!isOutOfStock && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
          <button className="px-5 py-2 bg-custom-brown text-white rounded-full text-sm font-medium shadow-lg 
                           hover:bg-white hover:text-custom-brown transition-all duration-300">
            View Details
          </button>
        </div>
      )}

      {/* Image produit */}
      <img
        src={product.images?.[0] || '/bespoke.jpg'}
        alt={product.name || 'Product'}
        className={`w-[220px] h-[375px] object-cover transition-transform duration-500 group-hover:scale-105`}
      />

      {/* Overlay bas avec nom + catégorie */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4">
        <div className="bg-custom-beige/40 backdrop-blur-sm p-2 rounded-md">
          <p className="text-white text-lg font-bold">
            {product.name || 'Unnamed Product'}
          </p>
          <p className="text-gray-300 text-sm">
            {product.category?.name || 'Uncategorized'}
          </p>
        </div>
      </div>

      {/* Prix + Favori */}
      <div className="absolute top-4 right-4 flex flex-col items-end space-y-1">
        <p className="bg-custom-beige/40 text-white text-lg font-semibold px-2 py-1 rounded-md">
          {product.Price ? `DZD ${product.Price}` : 'N/A'}
        </p>
        {!isOutOfStock && <HeartFavorite product={product} key={product._id} />}
      </div>
    </Link>
  );
};

export default ProductCard;