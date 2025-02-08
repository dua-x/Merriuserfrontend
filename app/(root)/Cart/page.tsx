"use client";
import { MinusCircle, PlusCircle, Trash } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { userCart } from "@/lib/action";
import axios from "axios";

const Cart = () => {
    const router = useRouter();
    const [cart, setCart] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const data = await userCart();
                if (data) {
                    setCart(data);
                }
            } catch (error) {
                console.error("Error fetching cart:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, []);

    const increaseQuantity = async (productId: string) => {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_IPHOST}/StoreAPI/carts/increaseQuantity`, {
                productId,
            });
            setCart((prevCart: any) => ({
                ...prevCart,
                ProductList: prevCart.ProductList.map((item: any) =>
                    item.Productid._id === productId
                        ? { ...item, quantityselect: item.quantityselect + 1 }
                        : item
                ),
                total: prevCart.total + prevCart.ProductList.find((item: any) => item.Productid._id === productId)?.Productid.Price,
            }));
        } catch (error) {
            console.error("Error increasing quantity:", error);
        }
    };

    const decreaseQuantity = async (productId: string) => {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_IPHOST}/StoreAPI/carts/decreaseQuantity`, {
                productId,
            });
            setCart((prevCart: any) => ({
                ...prevCart,
                ProductList: prevCart.ProductList.map((item: any) =>
                    item.Productid._id === productId
                        ? { ...item, quantityselect: Math.max(item.quantityselect - 1, 1) }
                        : item
                ),
                total: prevCart.total - prevCart.ProductList.find((item: any) => item.Productid._id === productId)?.Productid.Price,
            }));
        } catch (error) {
            console.error("Error decreasing quantity:", error);
        }
    };

    const removeItem = async (productId: string) => {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_IPHOST}/StoreAPI/carts/removeItem`, {
                productId,
            });
            setCart((prevCart: any) => ({
                ...prevCart,
                ProductList: prevCart.ProductList.filter((item: any) => item.Productid._id !== productId),
                total: prevCart.total - prevCart.ProductList.find((item: any) => item.Productid._id === productId)?.sum,
            }));
        } catch (error) {
            console.error("Error removing item:", error);
        }
    };

    const handleCheckout = async () => {
        try {
            const token = localStorage.getItem("authtoken");
            if (!token) {
                router.push("/sign-in");
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
                method: "POST",
                body: JSON.stringify({ cartItems: cart.ProductList }),
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                // If no URL is returned, navigate to the checkouts page
                router.push("/checkouts");
            }
        } catch (err) {
            console.error("[checkout_POST]", err);
        }
    };


    if (loading) return <p>Loading cart...</p>;
    if (!cart || cart.ProductList.length === 0) return <p>No items in cart</p>;

    return (
        <div className="flex gap-20 py-16 px-10 max-lg:flex-col max-sm:px-3">
            <div className="w-2/3 max-lg:w-full">
                <p className="text-heading3-bold">Shopping Cart</p>
                <hr className="my-6" />

                {cart.ProductList.map((cartItem: any) => (
                    <div
                        key={cartItem.Productid._id}
                        className="w-full flex max-sm:flex-col max-sm:gap-3 hover:bg-grey-1 px-4 py-3 items-center max-sm:items-start justify-between"
                    >
                        <div className="flex items-center">
                            <Image
                                src={cartItem.Productid.image || "/placeholder.png"}
                                width={100}
                                height={100}
                                className="rounded-lg w-32 h-32 object-cover"
                                alt="product"
                            />
                            <div className="flex flex-col gap-3 ml-4">
                                <p className="text-body-bold">{cartItem.Productid.name}</p>
                                <p className="text-small-medium">${cartItem.Productid.Price}</p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-center">
                            <MinusCircle
                                className="hover:text-red-1 cursor-pointer"
                                onClick={() => decreaseQuantity(cartItem.Productid._id)}
                            />
                            <p className="text-body-bold">{cartItem.quantityselect}</p>
                            <PlusCircle
                                className="hover:text-red-1 cursor-pointer"
                                onClick={() => increaseQuantity(cartItem.Productid._id)}
                            />
                        </div>

                        <Trash
                            className="hover:text-red-1 cursor-pointer"
                            onClick={() => removeItem(cartItem.Productid._id)}
                        />
                    </div>
                ))}
            </div>

            <div className="w-1/3 max-lg:w-full flex flex-col gap-8 bg-grey-1 rounded-lg px-4 py-5">
                <p className="text-heading4-bold pb-4">
                    Summary ({cart.ProductList.length} {cart.ProductList.length > 1 ? "items" : "item"})
                </p>
                <div className="flex justify-between text-body-semibold">
                    <span>Total Amount</span>
                    <span>$ {cart.total.toFixed(2)}</span>
                </div>
                <button
                    className="border rounded-lg text-body-bold bg-white py-3 w-full hover:bg-black hover:text-white"
                    onClick={handleCheckout}
                >
                    Proceed to Checkout
                </button>
            </div>
        </div>
    );
};

export default Cart;
