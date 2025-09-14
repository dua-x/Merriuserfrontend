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

    useEffect(() => {
        const token = localStorage.getItem('authtoken');
        setIsLoggedIn(!!token);
    }, []);

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
                setError("Échec du chargement des commandes. Veuillez réessayer.");
                console.error("Erreur lors du chargement des commandes :", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [isLoggedIn]);

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
                setError("Aucune commande trouvée avec cet identifiant. Vérifiez votre numéro de commande et réessayez.");
            } else if (err.message.includes('Network Error')) {
                setError("Erreur réseau. Vérifiez votre connexion internet et réessayez.");
            } else {
                setError("Échec de la recherche de la commande. Veuillez réessayer.");
            }
        } else {
            setError("Une erreur inattendue est survenue. Veuillez réessayer.");
        }
        console.error("Erreur lors de la recherche de commande :", err);
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
                Suivi de commandes
            </h1>

            {/* Barre de recherche */}
            <div className="w-full max-w-2xl mb-8">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Rechercher par numéro de commande..."
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
                        {isLoading ? "Recherche en cours..." : "Suivre ma commande"}
                    </button>
                )}
            </div>

            {/* Message d'erreur */}
            {error && (
                <div className="w-full max-w-4xl mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            {/* Chargement */}
            {isLoading && (
                <div className="text-center py-12">
                    <p className="text-lg text-gray-500">Chargement...</p>
                </div>
            )}

            {/* Contenu */}
            {!isLoading && (
                <>
                    {/* Utilisateur connecté */}
                    {isLoggedIn && (
                        <>
                            {filteredOrders.length === 0 ? (
                                <div className="text-center mt-12">
                                    {searchTerm ? (
                                        <p className="text-lg text-gray-500 mb-6">
                                            Aucune commande trouvée avec l’ID "{searchTerm}"
                                        </p>
                                    ) : (
                                        <p className="text-lg text-gray-500 mb-6">
                                            Vous n’avez pas encore passé de commande.
                                        </p>
                                    )}
                                    <button
                                        onClick={() => router.push("/#collections")}
                                        className="inline-flex items-center gap-2 bg-[#C4A484] hover:bg-[#a98c68] text-white font-semibold py-3 px-6 rounded-lg transition"
                                    >
                                        <ShoppingBag />
                                        Commencer mes achats
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

                    {/* Utilisateur invité */}
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
                            Entrez votre numéro de commande pour suivre son état
                        </p>
                    )}
                </>
            )}
        </div>
    );
};

// Composant d'une commande
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
                {/* En-tête commande */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                        <p className="text-gray-700 text-sm font-medium mb-1">
                            Numéro de commande : <span className="font-semibold">{order.idorder}</span>
                        </p>
                        <p className="text-gray-500 text-sm">
                            Date :{" "}
                            <span className="text-black">
                                {new Date(order.dateordered).toLocaleDateString("fr-FR", {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                            Livraison à : {order.adress}, {order.commune}, {order.wilaya}
                        </p>
                    </div>
                    <div className="text-left md:text-right">
                        <p className="text-sm">
                            Statut :{" "}
                            <span
                                className={`font-semibold ${
                                    order.status === "livré" ? "bg-green-100 text-green-800" :
                                    order.status === "confirmé" ? "bg-blue-100 text-blue-800" :
                                    order.status === "en livraison" ? "bg-yellow-100 text-yellow-800" :
                                    order.status === "annulé" ? "bg-red-100 text-red-800" :
                                    "bg-gray-100 text-gray-800"
                                }`}
                            >
                                {order.status === "livré" ? "Livrée" :
                                order.status === "confirmé" ? "Confirmée" :
                                order.status === "annulé" ? "Annulée" :
                                order.status === "en livraison" ? "En livraison" :
                                "En cours"}
                                                        
                           </span>
                        </p>
                        <p className="text-sm">
                            Total :{" "}
                            <span className="font-bold text-custom-brown">
                                {order.totalprice.toFixed(2)} DZA
                            </span>
                        </p>
                        <p className="text-sm">
                            Contact : {order.phonenumber}
                        </p>
                    </div>
                </div>

                {/* Bouton détails */}
                <button
                    onClick={() => toggleOrderDetails(order._id)}
                    className="text-blue-600 hover:underline text-sm self-start flex items-center gap-1"
                >
                    {expandedOrder === order._id ? (
                        <>
                            <span>Masquer les détails</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                        </>
                    ) : (
                        <>
                            <span>Afficher les détails</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </>
                    )}
                </button>

                {/* Détails commande */}
                {expandedOrder === order._id && (
                    <div className="mt-4 border-t pt-4 flex flex-col gap-6">
                        <h3 className="font-semibold text-lg">Articles</h3>
                        {order.orderitems.map((item, index) => {
                            // Safe access to product properties
                            const productName = item.product?.name || "Produit inconnu";
                            const productPrice = item.product?.Price || 0;
                            const productImages = item.product?.images || [];
                            
                            const imageSrc = Array.isArray(productImages)
                                ? productImages[0] || "/placeholder.png"
                                : productImages || "/placeholder.png";
                            
                            return (
                                <div key={index} className="flex flex-col sm:flex-row gap-4 border-b pb-4">
                                    <div className="w-24 aspect-[3/4] overflow-hidden rounded-lg">
                                        <Image
                                            src={imageSrc}
                                            alt={productName}
                                            width={100}
                                            height={133}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-grow">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            <p>
                                                <span className="font-semibold">Produit :</span>{" "}
                                                {productName}
                                            </p>
                                            <p>
                                                <span className="font-semibold">Prix unitaire :</span>{" "}
                                                {productPrice.toFixed(2)} DZA
                                            </p>
                                            <p>
                                                <span className="font-semibold">Couleur :</span> {item.color || "Non spécifié"}
                                            </p>
                                            {item.size && (
                                                <p>
                                                    <span className="font-semibold">Taille :</span> {item.size}
                                                </p>
                                            )}
                                            <p>
                                                <span className="font-semibold">Quantité :</span> {item.quantity}
                                            </p>
                                            <p>
                                                <span className="font-semibold">Sous-total :</span>{" "}
                                                {item.priceproduct?.toFixed(2) || "0.00"} DZA
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        
                        {/* Informations livraison */}
                        <div className="mt-4 pt-4 border-t">
                            <h3 className="font-semibold text-lg mb-2">Informations de livraison</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="font-semibold">Adresse</p>
                                    <p>{order.adress}</p>
                                    <p>{order.commune}, {order.wilaya}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Contact</p>
                                    <p>Téléphone : {order.phonenumber}</p>
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
