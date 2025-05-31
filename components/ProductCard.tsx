import React from 'react';
import Link from 'next/link';
import HeartFavorite from './HeartFavorite';

const ProductCard = ({ product }: { product: ProductType }) => {
    return (
        <Link
            href={`/products/${product._id}`}
            key={product._id}
            className='relative w-[220px] h-[375px] rounded-lg overflow-hidden backdrop-blur-lg shadow-xl transition-shadow hover:shadow-2xl'
        >
            <img
                src={product.images?.[0] || '/bespoke.jpg'}
                alt={product.name || 'Product'}
                className='w-[220px] h-[375px] object-cover transition-transform duration-500 group-hover:scale-110'
            />

            {/* Overlay avec gradient uniquement sous le texte */}
            <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4'>
                <div className='bg-custom-beige/40 backdrop-blur-sm p-2 rounded-md'>
                    <p className='text-white text-lg font-bold line-clamp-1'>
                        {product.name || 'Unnamed Product'}
                    </p>
                    <p className='text-gray-300 text-sm'>
                        {product.category?.name || 'Uncategorized'}
                    </p>
                </div>
            </div>

            {/* Prix et favori en bas à droite */}
            <div className='absolute top-4 right-4 flex flex-col items-end space-y-1'>
                <p className='bg-custom-beige/40 text-white text-lg font-semibold px-2 py-1 rounded-md'>
                    DZD {product.Price ?? 'N/A'}
                </p>
                <HeartFavorite product={product} key={product._id} />
            </div>
        </Link>
    );
};

export default ProductCard;
