import React from 'react';
import Link from "next/link";
import HeartFavorite from './HeartFavorite';

const ProductCard = ({ product }: { product: ProductType }) => {



    return (
        <Link href={`/products/${product._id}`} key={product._id} className='w-[220px] flex flex-col gap-2'>
            <img
                src={product.images[0] || '/bespoke.jpg'}
                alt={'Product'}
                className=" rounded-lg object-cover"
            />


            <div>
                <p className="text-base-bold">{product.name}</p>
                <p className="text-small-medium text-grey-2">{product.category.name}</p>
            </div>
            <div className='flex justify-between items-center'>
                <p className='text-body-bold'>${product.Price}</p>

                <HeartFavorite product={product} key={product._id} />

            </div>
        </Link>
    );
}

export default ProductCard;
