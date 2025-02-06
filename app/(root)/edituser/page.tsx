"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { handleUserinfo } from "@/lib/action";

const EditUser = () => {
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
                        email: "${formdata.email}",
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

    return (
        <form onSubmit={handleEdit} className="m-10 mb-3 max-W-100">
            <h1 className="text-2xl font-bold text-center mb-6">Edit Your Information</h1>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                {/* Email */}
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
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

                {/* Phone Number */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                        type="text"
                        name="phonenumber"
                        value={formdata.phonenumber}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your phone number"
                    />
                </div>

                {/* Wilaya */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Wilaya</label>
                    <input
                        type="text"
                        name="wilaya"
                        value={formdata.wilaya}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your wilaya"
                    />
                </div>

                {/* Commune */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Commune</label>
                    <input
                        type="text"
                        name="commune"
                        value={formdata.commune}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your commune"
                    />
                </div>

                {/* Code Postal */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Code Postal</label>
                    <input
                        type="text"
                        name="code_postal"
                        value={formdata.code_postal}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your postal code"
                    />
                </div>

                {/* Adresse */}
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <input
                        type="text"
                        name="adresse"
                        value={formdata.adresse}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your address"
                    />
                </div>

                {/* Country (Read-only) */}
                <div className="mb-3">
                    <label htmlFor="pays">Country</label>
                    <select
                        id="pays"
                        className="form-select"
                        name="pays"
                        title="Select your country"
                        value={formdata.pays}
                        onChange={handleInputChange}
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
                className="w-full mt-4 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
                Update Info
            </button>
        </form>
    );
};

export default EditUser;
