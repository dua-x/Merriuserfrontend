"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function SignUp() {
    const [formdata, setFormdata] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        firstname: "",
        lastname: "",
    });

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const router = useRouter();

    const handleInputChange = (e) => {
        setFormdata({
            ...formdata,
            [e.target.name]: e.target.value,
        });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        // Password match validation
        if (formdata.password !== formdata.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_IPHOST}/StoreAPI/users/userauth`,
                {
                    query: `
                        mutation RegisterUser($input: registerinput!) {
                            userRegister(input: $input) {
                                token
                                message
                            }
                        }
                    `,
                    variables: {
                        input: {
                            email: formdata.email,
                            firstname: formdata.firstname,
                            lastname: formdata.lastname,
                            passwordhash: formdata.password,
                        },
                    },
                }
            );

            setTimeout(() => {
                router.push("/signin");
            }, 200);
            

        } catch (error) {
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.errors[0]?.message || "An error occurred.";

                if (errorMessage.toLowerCase().includes("already exists")) {
                    setError("An account with this email already exists. Redirecting to Sign In...");
                    setTimeout(() => {
                        router.push("/signin");
                    }, 200);
                } else {
                    setError(errorMessage);
                }
            } else {
                setError("Unable to register. Please try again later.");
            }
        }
    };

    return (
        <form onSubmit={handleSignup}>
            <div className="form-container">
                <div className="form-card">
                    <h1 className="text-xl font-semibold mb-4">Sign Up</h1>

                    <div className="mb-3">
                        <label>First name</label>
                        <input
                            name="firstname"
                            type="text"
                            className="form-control"
                            placeholder="First name"
                            value={formdata.firstname}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label>Last name</label>
                        <input
                            name="lastname"
                            type="text"
                            className="form-control"
                            placeholder="Last name"
                            value={formdata.lastname}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label>Email address</label>
                        <input
                            name="email"
                            type="email"
                            className="form-control"
                            placeholder="Enter email"
                            value={formdata.email}
                            onChange={handleInputChange}
                        />
                    </div>
                    
                    <div className="mb-3 relative">
                        <label>Password</label>
                        <div className="relative">
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                className="form-control pr-10"
                                placeholder="Enter password"
                                value={formdata.password}
                                onChange={handleInputChange}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="mb-3 relative">
                        <label>Confirm Password</label>
                        <div className="relative">
                            <input
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                className="form-control pr-10"
                                placeholder="Confirm password"
                                value={formdata.confirmPassword}
                                onChange={handleInputChange}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary">
                            Sign Up
                        </button>
                    </div>

                    {message && <p className="success-message text-green-500">{message}</p>}
                    {error && <p className="error-message text-red-500">{error}</p>}

                    <p className="form-link text-center mt-4">
                        Already registered?{" "}
                        <a href="/signin" className="text-blue-600 underline">
                            Sign in
                        </a>
                    </p>
                </div>
            </div>
        </form>
    );
}