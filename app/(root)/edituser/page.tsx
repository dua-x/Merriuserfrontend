"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { handleUserinfo } from "@/lib/action";

const EditUser = () => {
     const [cart, setCart] = useState<any>(null);
      const [loading, setLoading] = useState(true);
      const [selectedWilaya, setSelectedWilaya] = useState("");
      const [selectedShipping, setSelectedShipping] = useState("desktop");
      const [deliveryPrices, setDeliveryPrices] = useState({ desktop: 0, domicile: 0 });
      const [wilayaData, setWilayaData] = useState<any[]>([]); // New state for wilaya data
    
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
  // Handle wilaya change
  const handleWilayaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const wilaya = e.target.value;
    setSelectedWilaya(wilaya);
    setFormdata({ ...formdata, wilaya, commune: "" });
    const selected = wilayaData.find((w) => w.wilaya === wilaya);
    if (selected) {
      setDeliveryPrices({ desktop: selected.stop_desk, domicile: selected.a_domicile });
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
        } catch (error) {
            setError("Failed to update user information.");
            console.error("Error updating user information:", error);
        }
    };

    return (

<form onSubmit={handleEdit} className="max-w-lg mx-auto p-6 h-[88%]  flex flex-col justify-center items-center">
            <h1 className="text-2xl font-bold text-center mb-6">Edit Your Information</h1>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
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
           
       
            {/* First Name */}
            <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                        type="text"
                        name="firstname"
                        value={formdata.firstname}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your first name"
                        required
                    />
                </div>

                {/* Last Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                        type="text"
                        name="lastname"
                        value={formdata.lastname}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your last name"
                        required
                    />
                </div>


            {/* Adresse */}
            <div className="md:col-span-2">
              <input
                type="text"
                name="adresse"
                value={formdata.adresse}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your address"
              />
            </div>

            {/* Wilaya */}
            <select name="wilaya" value={formdata.wilaya} onChange={handleWilayaChange} className="w-full p-2 border rounded-md">
              <option value="">Select Wilaya</option>
              {wilayaData.map((wilaya) => (
                <option key={wilaya.code} value={wilaya.wilaya}>
                  {`${wilaya.code}-${wilaya.wilaya}`}
                </option>
              ))}
            </select>

            {/* Commune */}
            <select name="commune" value={formdata.commune} onChange={handleInputChange} className="w-full p-2 border rounded-md mt-3" disabled={!selectedWilaya}>
              <option value="">Select Commune</option>
              {selectedWilaya && wilayaData.find((w) => w.wilaya === selectedWilaya)?.commune.map((commune: string) => (
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

          </div>
 
          
            {/* Error & Success Messages */}
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {message && <p className="text-green-500 mt-2">{message}</p>}

            {/* Submit Button */}
            <button
                type="submit"
                className="w-full mt-4 p-3 bg-custom-beige text-white rounded-md hover:bg-[#a27a64] transition-colors duration-300"
            >
                Update Info
            </button>
        </form>
    
    );
};

export default EditUser;
