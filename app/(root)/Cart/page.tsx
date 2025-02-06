"use client";
import { MinusCircle, PlusCircle, Trash } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { userCart } from "@/lib/action";


const Cart = () => {
    const router = useRouter();

    // Fake user for testing
    const user = {
        id: "12345",
        email: "testuser@example.com",
        fullName: "John Doe",
    };

    // Fake cart data for testing
    const [cart, setCart] = useState({
        cartItems: [
            {
                item: {
                    _id: "1",
                    title: "Cool T-Shirt",
                    price: 19.99,
                    media: ["/placeholder.png"], // Replace with a real image URL
                },
                quantity: 2,
                color: "Red",
                size: "M",
            },
            {
                item: {
                    _id: "2",
                    title: "Stylish Jeans",
                    price: 49.99,
                    media: ["/placeholder.png"], // Replace with a real image URL
                },
                quantity: 1,
                size: "L",
            },
        ],
        increaseQuantity: (id: string) => {
            setCart((prevCart) => ({
                ...prevCart,
                cartItems: prevCart.cartItems.map((cartItem) =>
                    cartItem.item._id === id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                ),
            }));
        },
        decreaseQuantity: (id: string) => {
            setCart((prevCart) => ({
                ...prevCart,
                cartItems: prevCart.cartItems
                    .map((cartItem) =>
                        cartItem.item._id === id
                            ? { ...cartItem, quantity: Math.max(cartItem.quantity - 1, 1) }
                            : cartItem
                    )
                    .filter((cartItem) => cartItem.quantity > 0),
            }));
        },
        removeItem: (id: string) => {
            setCart((prevCart) => ({
                ...prevCart,
                cartItems: prevCart.cartItems.filter((cartItem) => cartItem.item._id !== id),
            }));
        },
    });

    const total = cart.cartItems.reduce(
        (acc, cartItem) => acc + cartItem.item.price * cartItem.quantity,
        0
    );
    const totalRounded = parseFloat(total.toFixed(2));

    const customer = {
        _id: user?.id,
        email: user?.email,
        name: user?.fullName,
    };

    const handleCheckout = async () => {
        try {// hadi dert token henaya  psk b token n3rfo  ida m logge hada mkn
            const token = localStorage.getItem('authtoken');
            if (!token) {
                router.push("sign-in");
            } else {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
                    method: "POST",
                    body: JSON.stringify({ cartItems: cart.cartItems, customer }),
                });
                const data = await res.json();
                window.location.href = data.url;
                console.log(data);
            }
        } catch (err) {
            console.log("[checkout_POST]", err);
        }
    };

    return (
        <div className="flex gap-20 py-16 px-10 max-lg:flex-col max-sm:px-3">
            <div className="w-2/3 max-lg:w-full">
                <p className="text-heading3-bold">Shopping Cart</p>
                <hr className="my-6" />

                {cart.cartItems.length === 0 ? (
                    <p className="text-body-bold">No item in cart</p>
                ) : (
                    <div>
                        {cart.cartItems.map((cartItem) => (
                            <div
                                key={cartItem.item._id}
                                className="w-full flex max-sm:flex-col max-sm:gap-3 hover:bg-grey-1 px-4 py-3 items-center max-sm:items-start justify-between"
                            >
                                <div className="flex items-center">
                                    <Image
                                        src={cartItem.item.media[0]}
                                        width={100}
                                        height={100}
                                        className="rounded-lg w-32 h-32 object-cover"
                                        alt="product"
                                    />
                                    <div className="flex flex-col gap-3 ml-4">
                                        <p className="text-body-bold">{cartItem.item.title}</p>
                                        {cartItem.color && (
                                            <p className="text-small-medium">{cartItem.color}</p>
                                        )}
                                        {cartItem.size && (
                                            <p className="text-small-medium">{cartItem.size}</p>
                                        )}
                                        <p className="text-small-medium">${cartItem.item.price}</p>
                                    </div>
                                </div>

                                <div className="flex gap-4 items-center">
                                    <MinusCircle
                                        className="hover:text-red-1 cursor-pointer"
                                        onClick={() => cart.decreaseQuantity(cartItem.item._id)}
                                    />
                                    <p className="text-body-bold">{cartItem.quantity}</p>
                                    <PlusCircle
                                        className="hover:text-red-1 cursor-pointer"
                                        onClick={() => cart.increaseQuantity(cartItem.item._id)}
                                    />
                                </div>

                                <Trash
                                    className="hover:text-red-1 cursor-pointer"
                                    onClick={() => cart.removeItem(cartItem.item._id)}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="w-1/3 max-lg:w-full flex flex-col gap-8 bg-grey-1 rounded-lg px-4 py-5">
                <p className="text-heading4-bold pb-4">
                    Summary{" "}
                    <span>{`(${cart.cartItems.length} ${cart.cartItems.length > 1 ? "items" : "item"
                        })`}</span>
                </p>
                <div className="flex justify-between text-body-semibold">
                    <span>Total Amount</span>
                    <span>$ {totalRounded}</span>
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
