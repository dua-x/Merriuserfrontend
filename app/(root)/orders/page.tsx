"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getOrdersByUser, searchorderbyid } from "@/lib/action";
import { ShoppingBag, Search } from "lucide-react";
import { playfair } from "@/app/fonts/font";

type ProductType = {
    _id: string;
    name: string;
    images: string[];
    Price: number;
};

type OrderItem = {
    product: ProductType;
    quantity: number;
    size: string;
    color: string;
    priceproduct: number;
};

type UserType = {
    _id: string;
    username: string;
};

type OrderType = {
    _id: string;
    orderitems: OrderItem[];
    adress: string;
    wilaya: string;
    commune: string;
    idorder: string;
    phonenumber: string;
    status: string;
    totalprice: number;
    quantityOrder: number;
    user: UserType;
    dateordered: string;
    createdAt: string;
    updatedAt: string;
};

const Orders = () => {
    const [orders, setOrders] = useState<OrderType[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<OrderType[]>([]);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [guestOrder, setGuestOrder] = useState<OrderType | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Check authentication status
    useEffect(() => {
        const token = localStorage.getItem('authtoken');
        setIsLoggedIn(!!token);
    }, []);

    // Fetch orders for authenticated users
    useEffect(() => {
        if (!isLoggedIn) return;

        const fetchOrders = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await getOrdersByUser();
                if (Array.isArray(data)) {
                    const sortedOrders = data.sort(
                        (a, b) => new Date(b.dateordered).getTime() - new Date(a.dateordered).getTime()
                    );
                    setOrders(sortedOrders);
                    setFilteredOrders(sortedOrders);
                }
            } catch (err) {
                setError("Failed to load orders. Please try again.");
                console.error("Error fetching orders:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [isLoggedIn]);

    // Filter orders based on search term
    useEffect(() => {
        if (!isLoggedIn) return;
        
        if (searchTerm.trim() === "") {
            setFilteredOrders(orders);
        } else {
            const filtered = orders.filter(order => 
                order.idorder.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredOrders(filtered);
        }
    }, [searchTerm, orders, isLoggedIn]);

    // Handle guest order search
    const handleGuestSearch = async () => {
        if (!searchTerm.trim()) return;
        
        setIsLoading(true); 
        setError(null);
        try {
            const order = await searchorderbyid(searchTerm);
            if (!order) {
              throw new Error('ORDER_NOT_FOUND');
            } 
            setGuestOrder(order);
         } catch (err) {
        if (err instanceof Error) {
            if (err.message === 'ORDER_NOT_FOUND') {
                setError("No order found with this ID. Please check your order number and try again.");
            } else if (err.message.includes('Network Error')) {
                setError("Network error. Please check your internet connection and try again.");
            } else {
                setError("Failed to search order. Please try again.");
            }
        } else {
            setError("An unexpected error occurred. Please try again.");
        }
        console.error("Error searching order:", err);
    } finally {
        setIsLoading(false);
    }
    };

    const toggleOrderDetails = (orderId: string) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    return (
        <div className="flex flex-col items-center mt-6 py-16 px-6 md:px-12">
            <h1 className={`${playfair.className} text-4xl font-bold text-custom-brown `}>
                Order Tracking
            </h1>
s
            {/* Search Section */}
            <div className="w-full max-w-2xl mb-8">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search by order ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4A484]"
                    />
                    <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                </div>
                
                {!isLoggedIn && (
                    <button
                        onClick={handleGuestSearch}
                        disabled={isLoading}
                        className="mt-4 w-full bg-[#C4A484] hover:bg-[#a98c68] text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50"
                    >
                        {isLoading ? "Searching..." : "Track My Order"}
                    </button>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="w-full max-w-4xl mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            {/* Loading State */}
            {isLoading && (
                <div className="text-center py-12">
                    <p className="text-lg text-gray-500">Loading...</p>
                </div>
            )}

            {/* Content */}
            {!isLoading && (
                <>
                    {/* Authenticated User View */}
                    {isLoggedIn && (
                        <>
                            {filteredOrders.length === 0 ? (
                                <div className="text-center mt-12">
                                    {searchTerm ? (
                                        <p className="text-lg text-gray-500 mb-6">
                                            No orders found with ID "{searchTerm}"
                                        </p>
                                    ) : (
                                        <p className="text-lg text-gray-500 mb-6">
                                            You don't have any orders yet.
                                        </p>
                                    )}
                                    <button
                                        onClick={() => router.push("/#collections")}
                                        className="inline-flex items-center gap-2 bg-[#C4A484] hover:bg-[#a98c68] text-white font-semibold py-3 px-6 rounded-lg transition"
                                    >
                                        <ShoppingBag />
                                        Start Shopping
                                    </button>
                                </div>
                            ) : (
                                <div className="w-full max-w-4xl flex flex-col gap-8">
                                    {filteredOrders.map((order) => (
                                        <OrderItem 
                                            key={order._id}
                                            order={order}
                                            expandedOrder={expandedOrder}
                                            toggleOrderDetails={toggleOrderDetails}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {/* Guest User View */}
                    {!isLoggedIn && guestOrder && (
                        <div className="w-full max-w-4xl">
                            <OrderItem
                                order={guestOrder}
                                expandedOrder={expandedOrder}
                                toggleOrderDetails={toggleOrderDetails}
                            />
                        </div>
                    )}

                    {!isLoggedIn && !guestOrder && searchTerm && !error && (
                        <p className="text-lg text-gray-500 mb-6">
                            Enter your order ID to track your order status
                        </p>
                    )}
                </>
            )}
        </div>
    );
};

// Order Item Component
const OrderItem = ({ 
    order, 
    expandedOrder, 
    toggleOrderDetails 
}: { 
    order: OrderType; 
    expandedOrder: string | null; 
    toggleOrderDetails: (id: string) => void 
}) => {
    return (
        <div className="border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition bg-white">
            <div className="flex flex-col gap-4">
                {/* Order Header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                        <p className="text-gray-700 text-sm font-medium mb-1">
                            Order ID: <span className="font-semibold">{order.idorder}</span>
                        </p>
                        <p className="text-gray-500 text-sm">
                            Date:{" "}
                            <span className="text-black">
                                {new Date(order.dateordered).toLocaleDateString("en-US", {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                            Delivery to: {order.adress}, {order.commune}, {order.wilaya}
                        </p>
                    </div>
                    <div className="text-left md:text-right">
                        <p className="text-sm">
                            Status:{" "}
                            <span
                                className={`font-semibold ${
                                    order.status === "delivered" ? "text-green-600" : 
                                    order.status === "shipped" ? "text-blue-600" : "text-yellow-600"
                                }`}
                            >
                                {order.status}
                            </span>
                        </p>
                        <p className="text-sm">
                            Total:{" "}
                            <span className="font-bold text-custom-brown">
                                {order.totalprice.toFixed(2)} DZA
                            </span>
                        </p>
                        <p className="text-sm">
                            Contact: {order.phonenumber}
                        </p>
                    </div>
                </div>

                {/* Toggle Details Button */}
                <button
                    onClick={() => toggleOrderDetails(order._id)}
                    className="text-blue-600 hover:underline text-sm self-start flex items-center gap-1"
                >
                    {expandedOrder === order._id ? (
                        <>
                            <span>Hide Details</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                        </>
                    ) : (
                        <>
                            <span>Show Order Details</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </>
                    )}
                </button>

                {/* Order Details */}
                {expandedOrder === order._id && (
                    <div className="mt-4 border-t pt-4 flex flex-col gap-6">
                        <h3 className="font-semibold text-lg">Items</h3>
                        {order.orderitems.map((item, index) => (
                            <div key={index} className="flex flex-col sm:flex-row gap-4 border-b pb-4">
                                <div className="flex-shrink-0">
                                    <Image
                                        src={item.product?.images[0] || "/placeholder.jpg"}
                                        alt={item.product?.name || "Product image"}
                                        width={100}
                                        height={100}
                                        className="rounded-lg object-cover w-24 h-24"
                                    />
                                </div>
                                <div className="flex-grow">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        <p>
                                            <span className="font-semibold">Product:</span>{" "}
                                            {item.product?.name || "Unknown product"}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Unit Price:</span>{" "}
                                            {item.product?.Price.toFixed(2)} DZA
                                        </p>
                                        <p>
                                            <span className="font-semibold">Color:</span> {item.color}
                                        </p>
                                        {item.size && (
                                            <p>
                                                <span className="font-semibold">Size:</span> {item.size}
                                            </p>
                                        )}
                                        <p>
                                            <span className="font-semibold">Quantity:</span> {item.quantity}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Subtotal:</span>{" "}
                                            {item.priceproduct.toFixed(2)} DZA
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {/* Shipping Information */}
                        <div className="mt-4 pt-4 border-t">
                            <h3 className="font-semibold text-lg mb-2">Shipping Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="font-semibold">Delivery Address</p>
                                    <p>{order.adress}</p>
                                    <p>{order.commune}, {order.wilaya}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Contact</p>
                                    <p>Phone: {order.phonenumber}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;