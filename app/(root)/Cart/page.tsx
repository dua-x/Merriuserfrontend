"use client";
import { MinusCircle, PlusCircle, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { userCart, DeleteProductFromCart } from "@/lib/action";
import {ShoppingBag } from "lucide-react";
import { playfair } from "@/app/fonts/font";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";

const Cart = () => {
    const router = useRouter();
    const [cart, setCart] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const token = localStorage.getItem("authtoken");
                if (!token) return;

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

    const updateCartItem = (productId: string, quantityChange: number) => {
        setCart((prevCart: any) => ({
            ...prevCart,
            ProductList: prevCart.ProductList.map((item: any) =>
                item.Productid._id === productId
                    ? { ...item, quantityselect: Math.max(item.quantityselect + quantityChange, 1) }
                    : item
            ),
            total: prevCart.total + quantityChange * prevCart.ProductList.find((item: any) => item.Productid._id === productId)?.Productid.Price
        }));
    };

    const increaseQuantity = async (productId: string, size: string, color: string) => {
        try {
            const token = localStorage.getItem("authtoken");

            await axios.post(`${process.env.NEXT_PUBLIC_IPHOST}/StoreAPI/carts/cartPOST`, {
                query: `
                    mutation {
                        incrementquantity(input: { Productid: "${productId}", size: "${size}", color: "${color}" }) {
                            cart {
                                total
                            }
                            message
                        }
                    }
                `,
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            updateCartItem(productId, 1);
        } catch (error) {
            console.error("Error increasing quantity:", error);
        }
    };

    const decreaseQuantity = async (productId: string, size: string, color: string) => {
        try {
            const token = localStorage.getItem("authtoken");

            await axios.post(`${process.env.NEXT_PUBLIC_IPHOST}/StoreAPI/carts/cartPOST`, {
                query: `
                    mutation {
                        discrementquantity(input: { Productid: "${productId}", size: "${size}", color: "${color}" }) {
                            cart {
                                total
                            }
                            message
                        }
                    }
                `,
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            updateCartItem(productId, -1);
        } catch (error) {
            console.error("Error decreasing quantity:", error);
        }
    };

    const removeItem = async (productId: string) => {
        try {
            await DeleteProductFromCart(productId);

            setCart((prevCart: any) => {
                const itemToRemove = prevCart.ProductList.find((item: any) => item.Productid._id === productId);
                const newTotal = itemToRemove ? prevCart.total - (itemToRemove.Productid.Price * itemToRemove.quantityselect) : prevCart.total;

                return {
                    ...prevCart,
                    ProductList: prevCart.ProductList.filter((item: any) => item.Productid._id !== productId),
                    total: newTotal,
                };
            });
        } catch (error) {
            console.error("Error removing item:", error);
        }
    };

    const handleCheckout = () => {
        if (!cart || cart.ProductList.length === 0) return;
      
        // Just use the first product's id or whatever productId you want to send
        const productId = cart.ProductList[0].Productid._id;
      
        const url = `/checkouts?mode=buyNow&productId=${encodeURIComponent(productId)}`;
        router.push(url);
      };
      

    if (loading) {
        return (
            <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
                <div className="relative w-24 h-24 flex items-center justify-center">
                    <div className="absolute w-24 h-24 border-4 border-[#C4A484] border-t-transparent rounded-full animate-spin"></div>
                    <div className="absolute w-16 h-16 border-4 border-[#857B74] border-t-transparent rounded-full animate-spin-slow"></div>
                    <span className="text-[#C4A484] font-bold text-2xl tracking-wide">M</span>
                </div>
                <p className="mt-6 text-[#857B74] text-lg font-semibold tracking-wide">
                    Elevating Your Style at
                    <span className="text-[#C4A484] font-bold"> Merri Store</span>...
                </p>
                <p className="mt-2 text-sm text-gray-500 opacity-80 animate-fade-in">
                    Just a moment, fashion takes time.
                </p>
            </div>
        );
    }

    if (!cart || cart?.ProductList?.length === 0) return  <div className="flex flex-col h-screen justify-center items-center ">
    <p className="text-lg text-gray-500">No items in your cart yet.</p>
    <button
        className="mt-6 flex items-center gap-2 border rounded-lg text-lg font-medium bg-[#C4A484] text-white py-3 px-6 hover:bg-[#a98c68] transition"
        onClick={() => router.push("/#collections")}
    >
        <ShoppingBag /> Start Shopping
    </button>
</div>;

    return (
        <div className="flex gap-20 py-16 px-10 max-lg:flex-col max-sm:px-3">
            <div className="w-2/3 max-lg:w-full">
                <h1 className={`${playfair.className} text-3xl font-bold drop-shadow-lg mt-10 leading-tight tracking-wide 
                 text-2xl font-semibold text-custom-brown drop-shadow-lg`}>
                    Shopping Cart
                  </h1>
                <hr className="my-6" />

                {cart.ProductList.map((cartItem: any) => (
                    <div key={cartItem.Productid._id} className="w-full flex max-sm:gap-3 hover:bg-grey-1 px-4 py-3 items-center max-sm:items-start justify-between">
                        <Link href={`/products/${cartItem.Productid._id}`}>
                            <div className="flex items-center">
                                <div className="w-24 aspect-[3/4] overflow-hidden rounded-lg">
                                    <Image
                                        src={cartItem.Productid.images[0] || "/placeholder.png"}
                                        alt="product"
                                        width={100}
                                        height={133} // keep ratio in metadata
                                        className="h-full w-full object-cover"
                                    />
                                    </div>
                                <div className="flex flex-col gap-3 ml-4">
                                    <p className="text-body-bold">{cartItem.Productid.name}</p>
                                    <p className="text-small-medium">${cartItem.Productid.Price}</p>
                                </div>
                            </div>
                        </Link>

                        <div className="flex gap-4 items-center">
                            <MinusCircle
                                className={`cursor-pointer transition-all ${cartItem.quantityselect <= 1 ? "opacity-50 cursor-not-allowed" : "hover:text-red-500"}`}
                                onClick={() => decreaseQuantity(cartItem.Productid._id, cartItem.size, cartItem.color)}
                            />
                            <p className="text-body-bold">{cartItem.quantityselect}</p>
                            <PlusCircle
                                className={`cursor-pointer transition-all ${cartItem.quantityselect >= cartItem.Productid.stock ? "opacity-50 cursor-not-allowed" : "hover:text-green-500"}`}
                                onClick={() => increaseQuantity(cartItem.Productid._id, cartItem.size, cartItem.color)}
                            />
                        </div>

                        <Trash className="hover:text-red-500 cursor-pointer" onClick={() => removeItem(cartItem.Productid._id)} />
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
                <button className="border rounded-lg text-body-bold bg-white py-3 w-full hover:bg-black hover:text-white" 
                onClick={handleCheckout}>
                    Proceed to Checkout
                </button>
                <Link 
          href="/#collections" 
          className="text-center text-sm text-gray-500 hover:text-gray-700"
        >
          Continue Shopping
        </Link>
            </div>
        </div>
    );
};

export default Cart;


