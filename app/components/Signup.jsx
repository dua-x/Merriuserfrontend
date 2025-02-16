"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // Utilisation du routeur de Next.js

export default function SignUp() {
    const [formdata, setformdata] = useState({
        email: "",
        password: "",
        firstname: "",
        lastname: "",
    });

    const [error, setError] = useState(""); // Gestion des messages d'erreur
    const [message, setMessage] = useState(""); // Gestion des messages de succès

    const handleInputchange = (e) => {
        setformdata({
            ...formdata,
            [e.target.name]: e.target.value, // Mise à jour de l'état
        });
    };

    const handleSignup = async (e) => {
        e.preventDefault(); // Empêcher le comportement par défaut
        setError(""); // Réinitialisation des messages
        setMessage("");

        try {
            const response = await axios.post(
                process.env.NEXT_PUBLIC_IPHOST + "/StoreAPI/users/userauth",
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
            localStorage.setItem("authtoken", token); // Stocker le token
            setMessage(message); // Afficher le message de succès
            location.href = "/"; // Rediriger l'utilisateur
        } catch (error) {
            // Gestion des erreurs
            if (error.response && error.response.data) {
                setError(error.response.data.errors[0]?.message || "Une erreur est survenue.");
            } else {
                setError("Impossible de s'inscrire. Veuillez réessayer plus tard.");
            }
        }
    };

    return (
        <form onSubmit={handleSignup}>
            <div className="form-container">
                <div className="form-card">
                    <h1>Sign Up</h1>

                    {/* Champs de saisie */}
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

                    {/* Bouton de soumission */}
                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary">
                            Sign Up
                        </button>
                    </div>

                    {/* Messages */}
                    {message && <p className="success-message">{message}</p>}
                    {error && <p className="error-message">{error}</p>}

                    {/* Lien vers la connexion */}
                    <p className="form-link">
                        Already registered? <a href="/signin">Sign in</a>
                    </p>
                </div>
            </div>
        </form>
    );
}
