'use client';
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
        const checkWishlist = async () => {
            try {
                const token = localStorage.getItem('authtoken');
                if (!token) return;

                const storedWishlist = sessionStorage.getItem("wishlist");
                if (storedWishlist) {
                    const wishlist = JSON.parse(storedWishlist);
                    setIsLiked(wishlist.includes(product._id));
                    return;
                }

                // Fetch wishlist from server
                const response = await axios.post(
                    `${process.env.NEXT_PUBLIC_IPHOST}/StoreAPI/wishlists/wishlistGET`,
                    {
                        query: `
                            query {
                                wishlistGETByuser {
                                    wishlist {
                                        product {
                                            _id
                                        }
                                    }
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

                const wishlistItems: { product: { _id: string } }[] =
                    response.data.data?.wishlistGETByuser?.wishlist || [];

                const wishlistProductIds = wishlistItems.map(item => item.product._id);
                sessionStorage.setItem("wishlist", JSON.stringify(wishlistProductIds));

                setIsLiked(wishlistProductIds.includes(product._id));
            } catch (err) {
                console.error("[wishlist_CHECK]", err);
            }
        };

        // Call the function inside useEffect without marking useEffect as async
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
                ? `mutation { wishlistdeleteproduct(input: { product: "${product._id}" }) { message } }`
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

            const storedWishlist = sessionStorage.getItem("wishlist");
            let wishlist = storedWishlist ? JSON.parse(storedWishlist) : [];

            if (isLiked) {
                wishlist = wishlist.filter((id: string) => id !== product._id);
            } else {
                wishlist.push(product._id);
            }

            sessionStorage.setItem("wishlist", JSON.stringify(wishlist));
            setIsLiked(!isLiked);
        } catch (err) {
            console.error("[wishlist_POST]", err);
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
