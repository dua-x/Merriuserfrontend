"use client";
import { MinusCircle, PlusCircle, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { userCart, DeleteProductFromCart } from "@/lib/action";
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
                if (!token) {
                    return;
                }
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

    const increaseQuantity = async (productId: string, size: string, color: string) => {
        try {
            const token = localStorage.getItem('authtoken');

            const product = cart.ProductList.find((item: any) => item.Productid._id === productId);
            const productsize = cart.ProductList.find((item: any) => item.size === size);
            const productcolor = cart.ProductList.find((item: any) => item.color === color);



            if (!product) return;

            await axios.post(`${process.env.NEXT_PUBLIC_IPHOST}/StoreAPI/carts/cartPOST`, {
                query: `
                    mutation {
                            incrementquantity(input: {
                                    
                                        Productid: "${productId}",
                                        size : "${size}",
                                        color :"${color}"
                                
                                
                            }) {
                                cart {
                                ProductList {
                            Productid {
                                _id
                                name
                                description
                                Price
                            }
                            quantityselect
                            sum
                            }
                            userid {
                            username
                            email
                            firstname
                            lastname
                            }
                            total
                                }
                                message
                            }
                    }



                `,
            },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

            setCart((prevCart: any) => ({
                ...prevCart,
                ProductList: prevCart.ProductList.map((item: any) =>
                    item.Productid._id === productId
                        ? { ...item, quantityselect: item.quantityselect + 1 }
                        : item
                ),
                total: prevCart.total + product.Productid.Price,
            }));
        } catch (error) {
            console.error("Error increasing quantity:", error);
        }
    };

    const decreaseQuantity = async (productId: string, size: string, color: string) => {
        try {
            const token = localStorage.getItem('authtoken');

            const product = cart.ProductList.find((item: any) => item.Productid._id === productId);
            const productsize = cart.ProductList.find((item: any) => item.size === size);
            const productcolor = cart.ProductList.find((item: any) => item.color === color);


            await axios.post(`${process.env.NEXT_PUBLIC_IPHOST}/StoreAPI/carts/cartPOST`, {
                query: `
                    mutation {
                            discrementquantity(input: {
                                    
                                        Productid: "${productId}",
                                        size : "${size}",
                                        color :"${color}"
                                
                                
                            }) {
                                cart {
                                ProductList {
                            Productid {
                                _id
                                name
                                description
                                Price
                            }
                            quantityselect
                            sum
                            }
                            userid {
                            username
                            email
                            firstname
                            lastname
                            }
                            total
                                }
                                message
                            }
                    }



                `,
            },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

            setCart((prevCart: any) => {
                const updatedCart = prevCart.ProductList.map((item: any) =>
                    item.Productid._id === productId
                        ? { ...item, quantityselect: Math.max(item.quantityselect - 1, 1) }
                        : item
                );

                const product = prevCart.ProductList.find((item: any) => item.Productid._id === productId);
                const newTotal = product?.quantityselect > 1 ? prevCart.total - product?.Productid.Price : prevCart.total;

                return { ...prevCart, ProductList: updatedCart, total: newTotal };
            });
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


    const handleCheckout = async () => {
        try {
            const token = localStorage.getItem("authtoken");
            router.push("/checkouts");

        } catch (err) {
            console.error("checkout", err);
        }
    };



    if (loading) {
        return (
            <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
                {/* Animated Logo or Icon */}
                <div className="relative w-24 h-24 flex items-center justify-center">
                    <div className="absolute w-24 h-24 border-4 border-[#C4A484] border-t-transparent rounded-full animate-spin"></div>
                    <div className="absolute w-16 h-16 border-4 border-[#857B74] border-t-transparent rounded-full animate-spin-slow"></div>
                    <span className="text-[#C4A484] font-bold text-2xl tracking-wide">M</span>
                </div>

                {/* Stylish Text */}
                <p className="mt-6 text-[#857B74] text-lg font-semibold tracking-wide">
                    Elevating Your Style at
                    <span className="text-[#C4A484] font-bold"> Merri Store</span>...
                </p>

                {/* Smooth Fade-in Effect */}
                <p className="mt-2 text-sm text-gray-500 opacity-80 animate-fade-in">
                    Just a moment, fashion takes time.
                </p>
            </div>
        );
    }
    if (!cart || cart?.ProductList?.length === 0) return <p>No items in cart</p>;




    return (
        <div className="flex gap-20 py-16 px-10 max-lg:flex-col max-sm:px-3">
            <div className="w-2/3 max-lg:w-full">
                <p className="text-heading3-bold">Shopping Cart</p>
                <hr className="my-6" />

                {cart.ProductList.map((cartItem: any) => (
                    <div className="w-full flex max-sm:gap-3 hover:bg-grey-1 px-4 py-3 items-center max-sm:items-start justify-between">
                        <Link href={`/products/${cartItem.Productid._id}`} key={cartItem.Productid._id}
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

                        </Link>

                        <div className="flex gap-4 items-center">
                            <MinusCircle
                                className={`cursor-pointer transition-all ${cartItem.quantityselect <= 1 ? "opacity-50 cursor-not-allowed" : "hover:text-red-500"
                                    }`}
                                onClick={() => decreaseQuantity(cartItem.Productid._id, cartItem.size, cartItem.color)}
                            />
                            <p className="text-body-bold">{cartItem.quantityselect}</p>
                            <PlusCircle
                                className={`cursor-pointer transition-all ${cartItem.quantityselect >= cartItem.Productid.stock ? "opacity-50 cursor-not-allowed" : "hover:text-green-500"
                                    }`}
                                onClick={() => increaseQuantity(cartItem.Productid._id, cartItem.size, cartItem.color)}
                            />
                        </div>

                        <Trash
                            className="hover:text-red-500 cursor-pointer"
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
        </div >
    );
};

export default Cart;
