"use client"; // If using Next.js with client-side fetching

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getOrdersByUser } from "@/lib/action";

const Orders = () => {
    const [orders, setOrders] = useState<OrderType[]>([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await getOrdersByUser();
                console.log("Fetched Orders:", data); // Debugging output
                if (Array.isArray(data)) {
                    setOrders(data);
                } else {
                    console.error("Unexpected response format:", data);
                    setOrders([]); // Fallback to empty array
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
                setOrders([]); // Handle error case
            }
        };
        fetchOrders();
    }, []);


    return (
        <div className="px-10 py-5 max-sm:px-3">
            <p className="text-heading3-bold my-10">Your Orders</p>
            {!orders || orders.length === 0 ? (
                <p className="text-body-bold my-5">You have no orders yet.</p>
            ) : (
                <div className="flex flex-col gap-10">
                    {orders.map((order: OrderType) => (
                        <div key={order._id} className="flex flex-col gap-8 p-4 hover:bg-grey-1">
                            <div className="flex gap-20 max-md:flex-col max-md:gap-3">
                                <p className="text-base-bold">Order ID: {order._id}</p>
                                <p className="text-base-bold">Total Amount: ${order.totalprice}</p>
                            </div>

                            <div className="flex flex-col gap-5">
                                {order.orderitems.map((orderItem: OrderItem, index: number) => (
                                    <div key={index} className="flex gap-4">
                                        <Image
                                            src={orderItem.product.images[0]}
                                            alt={orderItem.product.name}
                                            width={100}
                                            height={100}
                                            className="w-32 h-32 object-cover rounded-lg"
                                        />
                                        <div className="flex flex-col justify-between">
                                            <p className="text-small-medium">
                                                Title: <span className="text-small-bold">{orderItem.product.name}</span>
                                            </p>
                                            {orderItem.product.productDetail && (
                                                <p className="text-small-medium">
                                                    Color: <span className="text-small-bold">{orderItem.product.productDetail[0].color}</span>
                                                </p>
                                            )}
                                            {orderItem.product.productDetail?.[0]?.sizes?.[0]?.size && (
                                                <p className="text-small-medium">
                                                    Size: <span className="text-small-bold">{orderItem.product.productDetail[0].sizes[0].size}</span>
                                                </p>
                                            )}
                                            <p className="text-small-medium">
                                                Unit price: <span className="text-small-bold">{orderItem.product.Price}</span>
                                            </p>
                                            <p className="text-small-medium">
                                                Quantity: <span className="text-small-bold">{orderItem.quantity}</span>
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;
