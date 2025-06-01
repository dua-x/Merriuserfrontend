"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { handleUserinfo } from "@/lib/action";
import React from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import { userCart } from "@/lib/action";
import Link from "next/link";
import Image from "next/image";

interface ProductItem {
  Productid: {
    _id: string;
    name: string;
    Price: number;
    image: string;
  };
  quantityselect: number;
  color?: string;
  size?: string;
}

interface CartData {
  ProductList: ProductItem[];
  total: number;
}

const Checkout = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const buyNowMode = searchParams.get('mode') === 'buynow';
  const productId = searchParams.get('productId');
  const quantity = parseInt(searchParams.get('quantity') || '1');
  const color = searchParams.get('color') || '';
  const size = searchParams.get('size') || '';

  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedWilaya, setSelectedWilaya] = useState("");
  const [selectedShipping, setSelectedShipping] = useState("desktop");
  const [deliveryPrices, setDeliveryPrices] = useState({ desktop: 0, domicile: 0 });
  const [wilayaData, setWilayaData] = useState<any[]>([]);
  const [singleProduct, setSingleProduct] = useState<any>(null);

  // Fetch data based on mode
  useEffect(() => {
    const initializeCheckout = async () => {
      try {
        if (buyNowMode) {
          // Buy Now mode - get product from localStorage
          const buyNowProduct = localStorage.getItem("buyNowProduct");
          
          if (!buyNowProduct) {
            router.push('/');
            return;
          }

          const productData = JSON.parse(buyNowProduct);
          
          setCart({
            ProductList: [{
              Productid: {
                _id: productData.productId,
                name: productData.name,
                Price: productData.price,
                image: productData.image
              },
              quantityselect: productData.quantity,
              color: productData.color,
              size: productData.size
            }],
            total: productData.price * productData.quantity
          });
        } else {
          // Cart mode - fetch user cart
          const token = localStorage.getItem("authtoken");
          if (!token) {
            router.push('/login?redirect=checkout');
            return;
          }
          
          const data = await userCart();
          if (data) {
            setCart(data);
          }
        }
      } catch (error) {
        console.error("Error initializing checkout:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeCheckout();
  }, [buyNowMode, router]);

  // Fetch wilaya and commune data
  const fetchWilayaData = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_IPHOST}/StoreAPI/orders/delivery`);
      return response.data;
    } catch (error) {
      console.error("Error fetching wilaya data:", error);
      return [];
    }
  };

  useEffect(() => {
    const getWilayaData = async () => {
      const data = await fetchWilayaData();
      setWilayaData(data);
    };

    getWilayaData();
  }, []);

  const [formdata, setFormdata] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phonenumber: "",
    wilaya: "",
    commune: "",
    adresse: "",
    pays: "Algeria",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Fetch user data if authenticated
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("authtoken");
        if (!token) return;
        
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

  const handleWilayaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const wilaya = e.target.value;
    setSelectedWilaya(wilaya);
    setFormdata({ ...formdata, wilaya, commune: "" });
    const selected = wilayaData.find((w) => w.wilaya === wilaya);
    if (selected) {
      setDeliveryPrices({ desktop: selected.stop_desk, domicile: selected.a_domicile });
    }
  };

  const handledeletecart = async () => {
    try {
      const token = localStorage.getItem('authtoken');
      if (!token) return;
      
      await axios.post(
        `${process.env.NEXT_PUBLIC_IPHOST}/StoreAPI/carts/cartPOST`,
        {
          query: `
            mutation {
              Deletecartuser {
                message
              }
            }
          `,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error('Error deleting cart:', error);
    }
  };

  const handleOrderCreation = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    if (!formdata.wilaya || !formdata.commune || !formdata.adresse || !formdata.phonenumber) {
      setError("Please fill all required fields");
      return;
    }

    // Prepare order items based on mode
    let orderItems;
    if (buyNowMode && singleProduct) {
      orderItems = [{
        product: singleProduct._id,
        quantity: quantity,
        color: color,
        size: size,
      }];
    } else if (cart) {
      orderItems = cart.ProductList.map((item: ProductItem) => ({
        product: item.Productid._id,
        quantity: item.quantityselect,
        color: item.color,
        size: item.size,
      }));
    } else {
      setError("No items to order");
      return;
    }

    const orderData = {
      firstname: formdata.firstname || "Anonymous",
      lastname: formdata.lastname || "User",
      email: formdata.email,
      orderitems: orderItems,
      adress: formdata.adresse,
      wilaya: formdata.wilaya,
      commune: formdata.commune,
      phonenumber: formdata.phonenumber,
      shippingType: selectedShipping,
      shippingPrice: selectedShipping === "desktop" ? deliveryPrices.desktop : deliveryPrices.domicile
    };

    try {
      const token = localStorage.getItem('authtoken');
      
      if (token) {
        // Authenticated user order
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_IPHOST}/StoreAPI/orders/orderPOST`,
          {
            query: `
              mutation CreateOrder($input: OrderInput!) {
                createOrder(input: $input) {
                  order {
                    _id
                    idorder
                  }
                  message
                }
              }
            `,
            variables: {
              input: {
                livprice: orderData.shippingPrice,
                orderitems: orderData.orderitems,
                adress: orderData.adress,
                wilaya: orderData.wilaya,
                commune: orderData.commune,
                phonenumber: orderData.phonenumber,
              },
            },
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.errors) {
          setError(response.data.errors[0].message || "Error creating order");
        } else {
          setMessage("Order created successfully!");
          if (!buyNowMode) {
            await handledeletecart();
          }
          // Redirect to order confirmation
          router.push(`/order-confirmation?id=${response.data.data.createOrder.order.idorder}`);
        }
      } else {
        // Guest user order
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_IPHOST}/StoreAPI/orders/orderPOST`,
          {
            query: `
              mutation CreateOrderAnonym($input: OrderInputAnonym!) {
                createOrderAnonym(input: $input) {
                  order {
                    _id
                    idorder
                  }
                  message
                }
              }
            `,
            variables: {
              input: {
                firstname: orderData.firstname,
                lastname: orderData.lastname,
                email: orderData.email,
                orderitems: orderData.orderitems,
                adress: orderData.adress,
                commune: orderData.commune,
                wilaya: orderData.wilaya,
                phonenumber: orderData.phonenumber,
                livprice: orderData.shippingPrice
              },
            },
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.data.errors) {
          setError(response.data.errors[0].message || "Error creating order");
        } else {
          setMessage("Order created successfully!");
          // Redirect to order confirmation
          router.push(`/order-confirmation?id=${response.data.data.createOrderAnonym.order.idorder}`);
        }
      }
    } catch (error: any) {
      console.error("Error creating order:", error);
      setError(error.response?.data?.message || "There was an issue with your order. Please try again.");
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!buyNowMode && !cart?.ProductList?.length) {
    return (
      <div className="text-center py-10">
        <p>Your cart is empty</p>
        <Link href="/#/#collections" className="text-blue-500 mt-2 inline-block">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="flex gap-20 py-16 px-10 max-lg:flex-col max-sm:px-2">
      <div className="w-2/3 max-lg:w-full">
        <form onSubmit={handleOrderCreation} className="max-w-lg mx-auto p-4">
          {error && <div className="text-red-500 mb-4 p-2 bg-red-50 rounded">{error}</div>}
          {message && <div className="text-green-500 mb-4 p-2 bg-green-50 rounded">{message}</div>}
          
          <div className="mb-6">
            <h1 className="text-2xl mb-4">Contact</h1>
            {!localStorage.getItem("authtoken") && (
              <p className="mb-4">
                Already have an account? <Link href={`/signin?redirect=checkout${buyNowMode ? `?mode=buynow&productId=${productId}&quantity=${quantity}` : ''}`} className="text-blue-500">Log in</Link>
              </p>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <input
              type="email"
              name="email"
              value={formdata.email}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Email"
              required
            />
          </div>

          {/* Shipping Information */}
          <div className="mt-8">
            <h1 className="text-2xl mb-6">Shipping Information</h1>
            
            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Country (Read-only) */}
              <div className="mb-3 md:col-span-2">
                <label className="block mb-1 text-sm">Country</label>
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
                <label className="block mb-1 text-sm">First Name</label>
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
                <label className="block mb-1 text-sm">Last Name</label>
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

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block mb-1 text-sm">Address</label>
                <input
                  type="text"
                  name="adresse"
                  value={formdata.adresse}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Street address"
                  required
                />
              </div>

              {/* Wilaya */}
              <div>
                <label className="block mb-1 text-sm">Wilaya</label>
                <select 
                  name="wilaya" 
                  value={formdata.wilaya} 
                  onChange={handleWilayaChange} 
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Select Wilaya</option>
                  {wilayaData.map((wilaya) => (
                    <option key={wilaya.code} value={wilaya.wilaya}>
                      {`${wilaya.code}-${wilaya.wilaya}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Commune */}
              <div>
                <label className="block mb-1 text-sm">Commune</label>
                <select 
                  name="commune" 
                  value={formdata.commune} 
                  onChange={handleInputChange} 
                  className="w-full p-2 border rounded-md" 
                  disabled={!selectedWilaya}
                  required
                >
                  <option value="">Select Commune</option>
                  {selectedWilaya && wilayaData.find((w) => w.wilaya === selectedWilaya)?.commune.map((commune: string) => (
                    <option key={commune} value={commune}>{commune}</option>
                  ))}
                </select>
              </div>

              {/* Phone Number */}
              <div className="md:col-span-2">
                <label className="block mb-1 text-sm">Phone Number</label>
                <input
                  type="text"
                  name="phonenumber"
                  value={formdata.phonenumber}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Phone Number"
                  required
                />
              </div>
            </div>
          </div>

          {/* Shipping Mode */}
          <div className="mt-8">
            <h1 className="text-2xl mb-4">Shipping Method</h1>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 p-3 border rounded hover:border-blue-500">
                <input 
                  type="radio" 
                  name="shipping" 
                  value="desktop" 
                  checked={selectedShipping === "desktop"} 
                  onChange={() => setSelectedShipping("desktop")} 
                  className="w-4 h-4" 
                /> 
                <div>
                  <p className="font-medium">STOP DESK</p>
                  <p className="text-sm">{deliveryPrices.desktop} DZD</p>
                </div>
              </label>
              <label className="flex items-center gap-2 p-3 border rounded hover:border-blue-500">
                <input 
                  type="radio" 
                  name="shipping" 
                  value="domicile" 
                  checked={selectedShipping === "domicile"} 
                  onChange={() => setSelectedShipping("domicile")} 
                  className="w-4 h-4" 
                /> 
                <div>
                  <p className="font-medium">À Domicile</p>
                  <p className="text-sm">{deliveryPrices.domicile} DZD</p>
                </div>
              </label>
            </div>
          </div>

          {/* Payment */}
          <div className="mt-8">
            <h1 className="text-2xl mb-4">Payment</h1>
            <div className="bg-[#C4A484]/40 rounded p-4">
              <h3 className="font-medium">Cash on Delivery</h3>
              <p className="text-sm mt-1">Pay when you receive your order</p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-6 p-3 bg-custom-beige text-white rounded-md hover:bg-[#a27a64] transition"
          >
            Complete Order
          </button>
        </form>
      </div>

      {/* Order Summary */}
      <div className="w-full lg:w-1/3 bg-[#a27a64]/10 border border-costum-beige p-6 rounded-lg">
        <h1 className="text-2xl mb-6">Order Summary</h1>
        <div className="space-y-4">
          {cart?.ProductList?.map((cartItem: ProductItem) => (
            <div key={cartItem.Productid._id} className="flex items-center gap-4 p-3 border-b">
              <div className="relative w-16 h-16">
                <Image 
                  src={cartItem.Productid.image || "/placeholder.png"} 
                  fill
                  className="rounded-lg object-cover" 
                  alt={cartItem.Productid.name} 
                />
              </div>
              <div className="flex-1">
                <p className="font-medium">{cartItem.Productid.name}</p>
                {cartItem.color && <p className="text-sm">Color: {cartItem.color}</p>}
                {cartItem.size && <p className="text-sm">Size: {cartItem.size}</p>}
                <p className="text-sm">Qty: {cartItem.quantityselect}</p>
              </div>
              <p className="font-medium">{cartItem.Productid.Price * cartItem.quantityselect} DZD</p>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{cart?.total?.toFixed(2) || "0.00"} DZD</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>
              {selectedShipping === "desktop" 
                ? `${deliveryPrices.desktop} DZD` 
                : `${deliveryPrices.domicile} DZD`}
            </span>
          </div>
          <div className="border-t pt-3 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>
              {cart 
                ? (cart.total + (selectedShipping === "desktop" ? deliveryPrices.desktop : deliveryPrices.domicile)).toFixed(2) 
                : "0.00"} DZD
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;