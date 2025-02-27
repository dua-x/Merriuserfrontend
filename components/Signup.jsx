"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function SignUp() {
    const [formdata, setformdata] = useState({
        email: "",
        password: "",
        firstname: "",
        lastname: "",
    });

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const router = useRouter();

    const handleInputchange = (e) => {
        setformdata({
            ...formdata,
            [e.target.name]: e.target.value,
        });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

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

            const { token, message } = response.data.data.userRegister;
            localStorage.setItem("authtoken", token);
            setMessage(message);

            router.push("/signin");

        } catch (error) {
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.errors[0]?.message || "An error occurred.";

                // Check if the account already exists and redirect to Sign In page
                if (errorMessage.toLowerCase().includes("already exists")) {
                    setError("An account with this email already exists. Redirecting to Sign In...");
                    router.push("/signin");
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
                    <h1>Sign Up</h1>

                    <div className="mb-3">
                        <label>First name</label>
                        <input
                            name="firstname"
                            type="text"
                            className="form-control"
                            placeholder="First name"
                            value={formdata.firstname}
                            onChange={handleInputchange}
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
                            onChange={handleInputchange}
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
                            onChange={handleInputchange}
                        />
                    </div>
                    <div className="mb-3">
                        <label>Password</label>
                        <input
                            name="password"
                            type="password"
                            className="form-control"
                            placeholder="Enter password"
                            value={formdata.password}
                            onChange={handleInputchange}
                        />
                    </div>

                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary">
                            Sign Up
                        </button>
                    </div>

                    {message && <p className="success-message" style={{ color: "green" }}>{message}</p>}
                    {error && <p className="error-message" style={{ color: "red" }}>{error}</p>}

                    <p className="form-link" style={{ textAlign: "center", marginTop: "10px" }}>
                        Already registered?{" "}
                        <a href="/signin" style={{ color: "blue", textDecoration: "underline" }}>
                            Sign in
                        </a>
                    </p>
                </div>
            </div>
        </form>
    );
}
