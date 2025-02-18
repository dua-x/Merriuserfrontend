"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getOrdersByUser } from "@/lib/action";

const Orders = () => {
    const [orders, setOrders] = useState<OrderType[]>([]);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await getOrdersByUser();
                console.log("Fetched Orders:", data);
                if (Array.isArray(data)) {
                    setOrders(data);
                } else {
                    console.error("Unexpected response format:", data);
                    setOrders([]);
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
                setOrders([]);
            }
        };
        fetchOrders();
    }, []);

    const toggleOrderDetails = (orderId: string) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    return (
        <div className="flex flex-col gap-10 py-16 px-10 max-lg:flex-col max-sm:px-3">
            <div className="px-10 py-5 max-sm:px-3">
                <p className="text-heading3-bold my-10">Historique des commandes</p>
                {!orders || orders.length === 0 ? (
                    <p className="text-body-bold my-5">Vous n'avez aucune commande jusqu'à maintenant.</p>
                ) : (
                    <div className="flex flex-col gap-10">
                        {orders.map((order: OrderType) => (
                            <div key={order._id} className="border border-gray-200 rounded-lg p-6 shadow-sm">
                                <p className="text-base-bold mb-4">ID de la commande: {order.idorder}</p>

                                {/* Tableau vertical pour les détails */}
                                <div className="border border-gray-300 rounded-lg p-4 w-fit">
                                    <table className="border-collapse">
                                        <tbody>
                                            <tr className="border-b">
                                                <th className="text-left p-2 pr-4 text-gray-700">Date:</th>
                                                <td className="p-2">{order.dateordered}</td>
                                            </tr>
                                            <tr className="border-b">
                                                <th className="text-left p-2 pr-4 text-gray-700">Statut:</th>
                                                <td className="p-2">{order.status}</td>
                                            </tr>
                                            <tr>
                                                <th className="text-left p-2 pr-4 text-gray-700">Total (DZA):</th>
                                                <td className="p-2">{order.totalprice}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Résumé de commande  */}
                                <button
                                    onClick={() => toggleOrderDetails(order._id)}
                                    className="mt-4 text-blue-600 hover:underline"
                                >
                                    {expandedOrder === order._id ? "Masquer le résumé" : "Afficher le résumé de commande"}
                                </button>

                                {/* Order Summary (Collapsible Section) */}
                                {expandedOrder === order._id && (
                                    <div className="mt-4 flex flex-col gap-5 border-t pt-4">
                                        {order.orderitems.map((orderItem: OrderItem, index: number) => (
                                            <div key={index} className="flex gap-4 border-b pb-4">
                                                {orderItem.product && (
                                                    <Image
                                                        src={orderItem.product.images[0] || "/placeholder.jpg"}
                                                        alt={orderItem.product.name || "Product Image"}
                                                        width={100}
                                                        height={100}
                                                        className="w-32 h-32 object-cover rounded-lg"
                                                    />
                                                )}

                                                <div className="flex flex-col justify-between">
                                                    <p className="text-small-medium">
                                                        Titre: <span className="text-small-bold">{orderItem.product?.name || "Produit inconnu"}</span>
                                                    </p>

                                                    <p className="text-small-medium">
                                                        Couleur: <span className="text-small-bold">{orderItem.color}</span>
                                                    </p>

                                                    {orderItem.size && (
                                                        <p className="text-small-medium">
                                                            Taille: <span className="text-small-bold">{orderItem.size}</span>
                                                        </p>
                                                    )}

                                                    <p className="text-small-medium">
                                                        Prix unitaire: <span className="text-small-bold">{orderItem.product?.Price || "N/A"} DZA</span>
                                                    </p>

                                                    <p className="text-small-medium">
                                                        Quantité: <span className="text-small-bold">{orderItem.quantity}</span>
                                                    </p>
                                                    <p className="text-small-medium">
                                                        Total : <span className="text-small-bold">{orderItem.priceproduct}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
