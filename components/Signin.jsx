"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; 
import axios from "axios";

export default function SignIn() {
    const [formdata, setFormdata] = useState({
        email: "",
        password: ""
    });

    const handleInputChange = (e) => {
        setFormdata({
            ...formdata,
            [e.target.name]: e.target.value
        });
    };

    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

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
                    <h1>Sign In</h1>

                    {error && (
                        <p style={{ color: "red" }}>
                            {error} <br />
                            No account?{" "}
                            <a href="/signup" style={{ color: "blue", textDecoration: "underline" }}>
                                Sign up here
                            </a>
                            .
                        </p>
                    )}
                    {message && <p style={{ color: "green" }}>{message}</p>}

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

                    <div className="mb-3">
                        <label>Password</label>
                        <input
                            name="password"
                            type="password"
                            className="form-control"
                            placeholder="Enter password"
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary">
                            Sign In
                        </button>
                    </div>

                    <p className="form-link p-4">
                        Not yet registered?{" "}
                        <a href="/signup" style={{ color: "blue", textDecoration: "underline" }}>
                            Sign up
                        </a>
                    </p>
                </div>
            </div>
        </form>
    );
}
