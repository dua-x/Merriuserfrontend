"use client"
import React, { useState } from 'react';
import Link from "next/link";
import HeartFavorite from './HeartFavorite';
import { useRouter } from 'next/navigation';
import { getWishListByUser } from "@/lib/action";


const ProductCard = ({ product }: { product: ProductType }) => {
    const router = useRouter();
    const [loading, setloading] = useState(false);
    const [signedInUser, setsignedInUser] = useState<UserType | null>(null);
    const [isLiked, setIsLiked] = useState(false);

    type UserType = {
        Id: string;
        wishlist: [string];
        createdAt: string;
        updatedAt: string;
    };



    const handleLike = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('authtoken');
            if (!token) {
                router.push('/signin');
                return;
            } else {
                setloading(true);


                const updateUser = await getWishListByUser()
                setsignedInUser(updateUser)
                setIsLiked(updateUser.wishlist.includes(product._id))
            }
        } catch (error) {
            console.log("[users_GET]", error);
        }
    }

    return (
        <Link href={`/products/${product._id}`} key={product._id} className='w-[220px] flex flex-col gap-2'>
            {/* <img
                src={product.images[0] || '/logo.jpg'}
                alt={'Product'}
                className="h-[250px] rounded-lg object-cover"
            /> */}


            {/* 
            <Image
                src={product.images[0] || '/logo.jpg'}
                alt='product'
                width={250}
                height={300}
                className='h-[250px] rounded-lg object-cover'
            /> */}
            <div>
                <p className="text-base-bold">{product.name}</p>
                <p className="text-small-medium text-grey-2">{product.category}</p>
            </div>
            <div className='flex justify-between items-center'>
                <p className='text-body-bold'>${product.Price}</p>

                <HeartFavorite product={product} />

            </div>
        </Link>
    );
}

export default ProductCard;
