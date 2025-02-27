"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

export default function SignIn() {
    const [formdata, setFormdata] = useState({
        email: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleInputChange = (e) => {
        setFormdata({
            ...formdata,
            [e.target.name]: e.target.value
        });
    };

    const handleSignIn = async (e) => {
        e.preventDefault(); 
        setError(""); 
        setMessage(""); 

        try {
            const response = await axios.post(
                process.env.NEXT_PUBLIC_IPHOST + '/StoreAPI/users/userauth',
                {
                    query: `
                        mutation {
                            userLogin(input: {email: "${formdata.email}", password: "${formdata.password}"}) {
                                username
                                token
                                message
                            }
                        }
                    `
                }
            );

            const loginData = response.data.data.userLogin;
            
            if (loginData.token) {
                localStorage.setItem('authtoken', loginData.token);
                setMessage("Signed in successfully! ...");
                setTimeout(() => {
                    router.push('/');
                }, 2000);
            } else {
                setError(loginData.message || "Invalid email or password.");
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data.data.userLogin.message || "An error occurred.");
            } else {
                setError("Failed to sign in. Please try again later.");
            }
        }
    };

    return (
        <form onSubmit={handleSignIn}>
            <div className="form-container">
                <div className="form-card">
                    <h1 className="text-xl font-semibold mb-4">Sign In</h1>

                    {error && (
                        <p className="text-red-500">
                            {error} <br />
                            No account?{" "}
                            <a href="/signup" className="text-blue-600 underline">
                                Sign up here
                            </a>
                            .
                        </p>
                    )}
                    {message && <p className="text-green-500">{message}</p>}

                    <div className="mb-3">
                        <label>Email address</label>
                        <input
                            name="email"
                            type="email"
                            className="form-control"
                            placeholder="Enter email"
                            onChange={handleInputChange}
                            required
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
                                onChange={handleInputChange}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-8 transform -translate-y-1/2 text-gray-500"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary">
                            Sign In
                        </button>
                    </div>

                    <p className="form-link text-center mt-4">
                        Not yet registered?{" "}
                        <a href="/signup" className="text-blue-600 underline">
                            Sign up
                        </a>
                    </p>
                </div>
            </div>
        </form>
    );
}
