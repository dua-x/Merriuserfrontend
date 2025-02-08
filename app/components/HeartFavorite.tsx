'use client'
import axios from "axios";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface HeartFavoriteProps {
    product: ProductType;
}

const HeartFavorite = ({ product }: HeartFavoriteProps) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        // Fetch wishlist status on mount
        const checkWishlist = async () => {
            try {
                const token = localStorage.getItem('authtoken');
                if (!token) return;

                const response = await axios.post(
                    `${process.env.NEXT_PUBLIC_IPHOST}/StoreAPI/wishlists/wishlistGET`,
                    {
                        query: `
                            query{
                            wishlistGETByuser{
                                wishlist{
                                product{
                                    name
                                    description

                                }
                            user{username}}
                            }
                        }
                        `,
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const wishlistItems = response.data.data.wishlistGETByuser.wishlist;
                setIsLiked(wishlistItems.product);
            } catch (err) {
                console.log("[wishlist_CHECK]", err);
            }
        };

        checkWishlist();
    }, [product._id]);

    const handleLike = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('authtoken');
            if (!token) {
                setLoading(false);
                return;
            }

            const mutation = isLiked
                ? `mutation { wishlistRemove(input: { product: "${product._id}" }) { message } }`
                : `mutation { wishlistcreate(input: { product: "${product._id}" }) { message } }`;

            await axios.post(
                `${process.env.NEXT_PUBLIC_IPHOST}/StoreAPI/wishlists/wishlistPOST`,
                { query: mutation },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setIsLiked(!isLiked);
        } catch (err) {
            console.log("[wishlist_POST]", err);
        }

        setLoading(false);
    };

    return (
        <button
            onClick={handleLike}
            className="focus:outline-none"
            aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
            disabled={loading}
        >
            <Heart
                fill={isLiked ? "red" : "none"}
                color={isLiked ? "red" : "black"}
                strokeWidth={2}
            />
        </button>
    );
};

export default HeartFavorite;
