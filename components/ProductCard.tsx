import React from 'react';
import Link from "next/link";
import HeartFavorite from './HeartFavorite';

const ProductCard = ({ product }: { product: ProductType }) => {
    return (
        <Link href={`/products/${product._id}`} key={product._id} className='w-[220px] flex flex-col gap-2'>
            <img
                src={product.images?.[0] || '/bespoke.jpg'}
                alt={product.name || 'Product'}
                className="w-[220px] h-[375px] object-cover rounded-lg"
            />
            <div>
                <p className="text-base-bold">{product.name || 'Unnamed Product'}</p>
                <p className="text-small-medium text-grey-2">{product.category?.name || 'Uncategorized'}</p>
            </div>
            <div className='flex justify-between items-center'>
                <p className='text-body-bold'>${product.Price ?? 'N/A'}</p>
                <HeartFavorite product={product} key={product._id} />
            </div>
        </Link>
    );
}

export default ProductCard;
