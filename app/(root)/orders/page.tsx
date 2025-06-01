"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getOrdersByUser } from "@/lib/action";
import { ShoppingBag } from "lucide-react";
import { playfair } from "@/app/fonts/font";

const Orders = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
        try {
            const data = await getOrdersByUser();
            console.log("Fetched Orders:", data);
            if (Array.isArray(data)) {
                // Trier les commandes par date (plus récentes en premier)
                const sortedOrders = data.sort((a, b) => new Date(b.dateordered).getTime() - new Date(a.dateordered).getTime());
                setOrders(sortedOrders);
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
    <div className="flex flex-col items-center py-16 px-6 md:px-12">
      <h1 className={`${playfair.className} text-4xl font-bold text-custom-brown mb-10 text-center`}>
        Historique des commandes
      </h1>

      {orders.length === 0 ? (
        <div className="text-center mt-12">
          <p className="text-lg text-gray-500 mb-6">
            Vous n'avez aucune commande jusqu'à maintenant.
          </p>
          <button
            onClick={() => router.push("/#collections")}
            className="inline-flex items-center gap-2 bg-[#C4A484] hover:bg-[#a98c68] text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            <ShoppingBag />
            Commencer vos achats
          </button>
        </div>
      ) : (
        <div className="w-full max-w-4xl flex flex-col gap-8">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition bg-white"
            >
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-700 text-sm font-medium mb-1">
                      Commande ID: <span className="font-semibold">{order.idorder}</span>
                    </p>
                    <p className="text-gray-500 text-sm">
                      Date:{" "}
                      <span className="text-black">
                        {new Date(order.dateordered).toLocaleDateString("fr-FR")}
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">
                      Statut:{" "}
                      <span
                        className={`font-semibold ${
                          order.status === "livré" ? "text-green-600" : "text-yellow-600"
                        }`}
                      >
                        {order.status}
                      </span>
                    </p>
                    <p className="text-sm">
                      Total:{" "}
                      <span className="font-bold text-custom-brown">
                        {order.totalprice} DZA
                      </span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => toggleOrderDetails(order._id)}
                  className="text-blue-600 hover:underline text-sm self-start"
                >
                  {expandedOrder === order._id
                    ? "Masquer le résumé"
                    : "Afficher le résumé de commande"}
                </button>

                {expandedOrder === order._id && (
                  <div className="mt-4 border-t pt-4 flex flex-col gap-6">
                    {order.orderitems.map((item, index) => (
                      <div key={index} className="flex gap-4 border-b pb-4">
                        <Image
                          src={item.product?.images[0] || "/placeholder.jpg"}
                          alt={item.product?.name || "Image du produit"}
                          width={100}
                          height={100}
                          className="rounded-lg object-cover w-24 h-24"
                        />
                        <div className="flex flex-col text-sm gap-1">
                          <p>
                            <span className="font-semibold">Titre:</span>{" "}
                            {item.product?.name || "Produit inconnu"}
                          </p>
                          <p>
                            <span className="font-semibold">Couleur:</span> {item.color}
                          </p>
                          {item.size && (
                            <p>
                              <span className="font-semibold">Taille:</span> {item.size}
                            </p>
                          )}
                          <p>
                            <span className="font-semibold">Prix unitaire:</span>{" "}
                            {item.product?.Price} DZA
                          </p>
                          <p>
                            <span className="font-semibold">Quantité:</span> {item.quantity}
                          </p>
                          <p>
                            <span className="font-semibold">Total:</span> {item.priceproduct} DZA
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
