"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { handleUserinfo } from "@/lib/action";
import { Eye, EyeOff } from "lucide-react";

const EditUser = () => {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedWilaya, setSelectedWilaya] = useState("");
  const [selectedShipping, setSelectedShipping] = useState("desktop");
  const [deliveryPrices, setDeliveryPrices] = useState({ desktop: 0, domicile: 0 });
  const [wilayaData, setWilayaData] = useState<any[]>([]);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // Form states
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

  const [errors, setErrors] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phonenumber: "",
    wilaya: "",
    commune: "",
    adresse: "",
    general: ""
  });

  const [successMessage, setSuccessMessage] = useState("");

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
    setErrors({...errors, wilaya: "", commune: ""});
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
        setErrors({...errors, general: "Failed to load user data"});
      }
    };

    fetchUserData();
  }, []);

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      firstname: "",
      lastname: "",
      email: "",
      phonenumber: "",
      wilaya: "",
      commune: "",
      adresse: "",
      general: ""
    };

    if (!formdata.firstname.trim()) {
      newErrors.firstname = "First name is required";
      valid = false;
    }

    if (!formdata.lastname.trim()) {
      newErrors.lastname = "Last name is required";
      valid = false;
    }

    if (!formdata.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formdata.email)) {
      newErrors.email = "Please enter a valid email";
      valid = false;
    }

    if (!formdata.phonenumber.trim()) {
      newErrors.phonenumber = "Phone number is required";
      valid = false;
    }

    if (!formdata.wilaya) {
      newErrors.wilaya = "Wilaya is required";
      valid = false;
    }

    if (!formdata.commune) {
      newErrors.commune = "Commune is required";
      valid = false;
    }

    if (!formdata.adresse.trim()) {
      newErrors.adresse = "Address is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const validatePasswordForm = () => {
    if (!passwordData.oldPassword) {
      setPasswordError("Current password is required");
      return false;
    }

    if (!passwordData.newPassword) {
      setPasswordError("New password is required");
      return false;
    } else if (passwordData.newPassword.length < 5) {
      setPasswordError("Password must be at least 5 characters");
      return false;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Passwords don't match");
      return false;
    }

    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormdata({
      ...formdata,
      [name]: value,
    });
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
    // Clear password error when user starts typing
    if (passwordError) setPasswordError("");
  };

  const togglePasswordVisibility = (field: 'old' | 'new' | 'confirm') => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field]
    });
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrors({...errors, general: ""});

    if (!validateForm()) return;

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
      setSuccessMessage("User information updated successfully!");
      setErrors({
        firstname: "",
        lastname: "",
        email: "",
        phonenumber: "",
        wilaya: "",
        commune: "",
        adresse: "",
        general: ""
      });
    } catch (error: any) {
      setErrors({
        ...errors,
        general: error.response?.data?.errors?.[0]?.message || "Failed to update user information"
      });
      console.error("Error updating user information:", error);
    }
  };

 const handlePasswordSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setPasswordError("");
  setPasswordSuccess("");

  if (!validatePasswordForm()) return;

  try {
    const token = localStorage.getItem("authtoken");
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_IPHOST}/StoreAPI/users/userauth`,
      {
        query: `
          mutation {
            userChangePassword(input: {
              oldpassword: "${passwordData.oldPassword}",
              password: "${passwordData.newPassword}"
            }) {
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
      }
    );

    const result = response.data.data.userChangePassword;
    setPasswordSuccess(result.message || "Password changed successfully!");
    setPasswordData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    setPasswordError("");
    
    // Only close the form after a delay to show the success message
    setTimeout(() => {
      setShowPasswordForm(false);
    }, 5000); // 2 seconds delay
    
  } catch (error: any) {
    setPasswordError(error.response?.data?.errors?.[0]?.message || "Failed to change password");
    console.error("Error changing password:", error);
  }
};

  return (
    <div className="max-w-lg mx-auto p-6 mt-12">
      <div className="bg-white rounded-lg shadow-md p-4">
        <form onSubmit={handleEdit} className="mb-6">
          <h1 className="text-2xl font-bold text-center mb-4">Edit Your Information</h1>

          {errors.general && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {errors.general}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
              {successMessage}
            </div>
          )}

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formdata.email}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your email"
                required
                disabled
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>
            
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                name="firstname"
                value={formdata.firstname}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.firstname ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your first name"
                required
              />
              {errors.firstname && <p className="mt-1 text-sm text-red-600">{errors.firstname}</p>}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                name="lastname"
                value={formdata.lastname}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.lastname ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your last name"
                required
              />
              {errors.lastname && <p className="mt-1 text-sm text-red-600">{errors.lastname}</p>}
            </div>

            {/* Adresse */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                name="adresse"
                value={formdata.adresse}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.adresse ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your address"
              />
              {errors.adresse && <p className="mt-1 text-sm text-red-600">{errors.adresse}</p>}
            </div>

            {/* Wilaya */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Wilaya</label>
              <select 
                name="wilaya" 
                value={formdata.wilaya} 
                onChange={handleWilayaChange} 
                className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.wilaya ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select Wilaya</option>
                {wilayaData.map((wilaya) => (
                  <option key={wilaya.code} value={wilaya.wilaya}>
                    {`${wilaya.code}-${wilaya.wilaya}`}
                  </option>
                ))}
              </select>
              {errors.wilaya && <p className="mt-1 text-sm text-red-600">{errors.wilaya}</p>}
            </div>

            {/* Commune */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Commune</label>
              <select 
                name="commune" 
                value={formdata.commune} 
                onChange={handleInputChange} 
                className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.commune ? "border-red-500" : "border-gray-300"
                }`}
                disabled={!selectedWilaya}
              >
                <option value="">Select Commune</option>
                {selectedWilaya && wilayaData.find((w) => w.wilaya === selectedWilaya)?.commune.map((commune: string) => (
                  <option key={commune} value={commune}>{commune}</option>
                ))}
              </select>
              {errors.commune && <p className="mt-1 text-sm text-red-600">{errors.commune}</p>}
            </div>

            {/* Phone Number */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="text"
                name="phonenumber"
                value={formdata.phonenumber}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.phonenumber ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Phone Number"
              />
              {errors.phonenumber && <p className="mt-1 text-sm text-red-600">{errors.phonenumber}</p>}
            </div>
            
            {/* Country (Read-only) */}
            <div className="mb-3 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
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
          
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-4 p-3 bg-custom-beige text-white rounded-md hover:bg-[#a27a64] transition-colors duration-300"
          >
            Update Info
          </button>
        </form>

        {/* Password Change Section */}
        <div className="mt-6">
          {!showPasswordForm ? (
            <button
              onClick={() => setShowPasswordForm(true)}
              className="w-full p-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-300"
            >
              Change Password
            </button>
          ) : (
            <form onSubmit={handlePasswordSubmit} className="mt-4 p-4 border rounded-lg bg-gray-50">
              <h2 className="text-xl font-semibold mb-4">Change Password</h2>
              
              {passwordError && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                  {passwordError}
                </div>
              )}
              
              {passwordSuccess && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
                  {passwordSuccess}
                </div>
              )}
              
              <div className="mb-4 relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.old ? "text" : "password"}
                    name="oldPassword"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('old')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.old ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              
              <div className="mb-4 relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              
              <div className="mb-4 relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 p-2 bg-custom-beige text-white rounded-md hover:bg-[#a27a64] transition-colors duration-300"
                >
                  Save Password
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordError("");
                    setPasswordSuccess("");
                  }}
                  className="flex-1 p-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditUser;