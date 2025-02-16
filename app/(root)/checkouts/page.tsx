"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { handleUserinfo } from "@/lib/action";
import React from 'react'
import { useRouter } from "next/navigation";
import { userCart } from "@/lib/action";
import Link from "next/link";
import Image from "next/image";

const Checkout = () => {
  const router = useRouter();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedWilaya, setSelectedWilaya] = useState("");
  const [selectedShipping, setSelectedShipping] = useState("desktop");
  const [deliveryPrices, setDeliveryPrices] = useState({ desktop: 0, domicile: 0 });

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

  const wilayas: { name: string; priceDesktop: number; priceDomicile: number }[] = [
    { name: "Algiers", priceDesktop: 200, priceDomicile: 500 },
    { name: "Oran", priceDesktop: 300, priceDomicile: 600 },
    { name: "Constantine", priceDesktop: 250, priceDomicile: 550 },
  ];

  // Explicitly define the type for communes
  const communes: Record<string, string[]> = {
    Algiers: ["Bir Mourad Rais", "El Harrach", "Bab El Oued"],
    Oran: ["Es Senia", "Bir El Djir", "Ain Turk"],
    Constantine: ["El Khroub", "Ali Mendjeli", "Zighoud Youcef"],
  };



  const [formdata, setFormdata] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phonenumber: "",
    wilaya: "",
    commune: "",
    code_postal: "",
    adresse: "",
    pays: "Algeria",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userdata = await handleUserinfo();
        setFormdata({
          ...userdata,
          pays: "Algeria",
        });
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormdata({
      ...formdata,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const token = localStorage.getItem("authtoken");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_IPHOST}/StoreAPI/users/userauth`,
        {
          query: `
                mutation {
                  userEdit (input: {
                    firstname: "${formdata.firstname}",
                    lastname: "${formdata.lastname}",
                    phonenumber: "${formdata.phonenumber}",
                    wilaya: "${formdata.wilaya}",
                    commune: "${formdata.commune}",
                    code_postal: "${formdata.code_postal}",
                    adresse: "${formdata.adresse}"
                  }) {message}
                }
            `,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const user = response.data.data.userEdit;
      setMessage("User information updated successfully!");
      setTimeout(() => (window.location.href = "/"), 1500);
    } catch (error) {
      setError("Failed to update user information.");
      console.error("Error updating user information:", error);
    }
  };

  const handleWilayaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const wilaya = e.target.value;
    setSelectedWilaya(wilaya);
    setFormdata({ ...formdata, wilaya, commune: "" });
    const selected = wilayas.find((w) => w.name === wilaya);
    if (selected) {
      setDeliveryPrices({ desktop: selected.priceDesktop, domicile: selected.priceDomicile });
    }
  };

  return (
    <div className="flex flex gap-20 py-16 px-10 max-lg:flex-col max-sm:px-3max-lg:flex-col max-sm:px-2">
      <div className="w-2/3 max-lg:w-full">

        <form onSubmit={handleEdit} className="max-w-lg mx-auto p-4">
          <div>
            <h1 className="text-2xl mb-6">Contact</h1>
            <Link href={'/login'}>Open session</Link>
          </div>

          {/* Email */}
          <div className="md:col-span-2">
            <input
              type="email"
              name="email"
              value={formdata.email}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>


          {/* Grid Layout */}
          <h1 className="text-2xl mb-6">Livraison</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Country (Read-only) */}
            <div className="mb-3 md:col-span-2">
              <select
                id="pays"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-100 cursor-not-allowed"
                name="pays"
                value={formdata.pays}
                disabled
              >
                <option value="Algeria">Algeria</option>
              </select>
            </div>

            {/* First Name */}
            <div>
              <input
                type="text"
                name="firstname"
                value={formdata.firstname}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="First Name"
                required
              />
            </div>

            {/* Last Name */}
            <div>
              <input
                type="text"
                name="lastname"
                value={formdata.lastname}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Last Name"
                required
              />
            </div>

            {/* Adresse */}
            <div className="md:col-span-2">
              <input
                type="text"
                name="Adresse"
                value={formdata.adresse}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your address"
              />
            </div>


            {/* Wilaya */}
            <select name="wilaya" value={formdata.wilaya} onChange={handleWilayaChange} className="w-full p-2 border rounded-md">
              <option value="">Select Wilaya</option>
              {wilayas.map((wilaya) => (
                <option key={wilaya.name} value={wilaya.name}>{wilaya.name}</option>
              ))}
            </select>

            <select name="commune" value={formdata.commune} onChange={handleInputChange} className="w-full p-2 border rounded-md mt-3" disabled={!selectedWilaya}>
              <option value="">Select Commune</option>
              {selectedWilaya && communes[selectedWilaya]?.map((commune) => (
                <option key={commune} value={commune}>{commune}</option>
              ))}
            </select>


            {/* Phone Number */}
            <div className="md:col-span-2">
              <input
                type="text"
                name="phonenumber"
                value={formdata.phonenumber}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Phone Number"
              />
            </div>


          </div>
          <h1 className="text-2xl mt-4">Mode d’expédition</h1>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2">
              <input type="radio" name="shipping" value="desktop" checked={selectedShipping === "desktop"} onChange={() => setSelectedShipping("desktop")} className="w-4 h-4" /> STOP DESK - {deliveryPrices.desktop} DZD
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="shipping" value="domicile" checked={selectedShipping === "domicile"} onChange={() => setSelectedShipping("domicile")} className="w-4 h-4" /> À Domicile - {deliveryPrices.domicile} DZD
            </label>
          </div>


          <h1 className="text-2xl mb-6">Paiment</h1>
          <div className="bg-custom-beige/30 rounded ">
            <h3> Paiement à la livraison </h3>
          </div>


          {/* Error & Success Messages */}
          {error && <p className="text-red-500 mt-2">{error}</p>}
          {message && <p className="text-green-500 mt-2">{message}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-4 p-3 bg-custom-beige text-white rounded-md hover:bg-blue-700 transition"
          >
            Valider le paiment
          </button>
        </form>
      </div >
      <div>

        <div className="w-full lg:w-1/3 bg-gray-100 p-4 rounded-lg">
          <h1 className="text-2xl mb-4">Résumé de la commande</h1>
          {cart?.ProductList?.length > 0 ? (
            cart.ProductList.map((cartItem: any) => (
              <Link href={`/products/${cartItem.Productid._id}`} key={cartItem.Productid._id}>
                <div className="flex items-center gap-4 p-2 border-b">
                  <Image src={cartItem.Productid.image || "/placeholder.png"} width={80} height={80} className="rounded-lg" alt={cartItem.Productid.name} />
                  <div>
                    <p>{cartItem.Productid.name}</p>
                    <p>{cartItem.Productid.Price} DZD</p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-500">Your cart is empty.</p>
          )}
          <p className="text-lg mt-4">Total Amount: {cart?.total?.toFixed(2) || "0.00"} DZD</p>
        </div>
      </div >

    </div >
  );
}

export default Checkout;

