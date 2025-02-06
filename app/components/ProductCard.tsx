"use client";
import React, { useEffect, useReducer, useState } from 'react';
import Link from "next/link";
import { Heart } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const ProductCard = ({ product }: { product: ProductType }) => {
    const router = useRouter();
    const mockUser = { id: "123", name: "Test User", email: "testuser@example.com" };
    //the reaal oneeee //
    const useUser = () => ({ user: mockUser });
    const { user } = useUser();
    const [loading, setloading] = useState(false);
    const [signedInUser, setsignedInUser] = useState<UserType | null>(null);
    const [isLiked, setIsLiked] = useState(false);

    type UserType = {
        Id: string;
        wishlist: [string];
        createdAt: string;
        updatedAt: string;
    };

    // const getUser = async () => {
    //     try {
    //         setloading(true);
    //         // Mocking a fake user
    //         const fakeUser = {
    //             Id: "1",
    //             wishlist: ["product1", "product2"], // Mock wishlist
    //             createdAt: ' 13/02/2024',
    //             updatedAt: '13/11/2024',
    //         };

    //         // Simulating an API delay
    //         await new Promise((resolve) => setTimeout(resolve, 500));

    //         setsignedInUser(fakeUser);
    //         setIsLiked(fakeUser.wishlist.includes(product._id));
    //         setloading(false);
    //     } catch (error) {
    //         console.log("[users_GET]", error);
    //         setloading(false);
    //     }
    // };




    // the REAL ONE

    // const getUser = async () => {
    //     try {
    //         setloading(true);
    //         const res = await fetch("/users")
    //         const data = await res.json()
    //         setsignedInUser(data)
    //         setIsLiked(data.wishlist.includes(product._id))
    //         setloading(false);
    //     } catch (error) {
    //         console.log("[users_GET]", error);
    //     }
    // }
    useEffect(() => {
        if (user) {
            // getUser();
        }
    }, [user]);


    const handleLike = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        try {
            if (!user) {
                router.push('/signin');
                return;
            } else {
                setloading(true);
                const res = await fetch("/users/like", {
                    method: "POST",
                    body: JSON.stringify({ productId: product._id }),
                })

                const updateUser = await res.json()
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
                <button onClick={handleLike} aria-label="Add to wishlist">
                    <Heart fill={isLiked ? "red" : "white"} />

                </button>
            </div>
        </Link>
    );
}

export default ProductCard;
