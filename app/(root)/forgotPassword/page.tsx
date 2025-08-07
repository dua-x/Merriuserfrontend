"use client";
import React, { useState, FormEvent } from "react";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ForgotPasswordResponse {
  data?: {
    userForgotPassword: {
      success: boolean;
      message: string;
    };
  };
  errors?: Array<{
    message: string;
  }>;
}

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await axios.post<ForgotPasswordResponse>(
        process.env.NEXT_PUBLIC_IPHOST + "/StoreAPI/users/userauth",
        {
          query: `
            mutation {
              userForgotPassword(input: {email: "${email}"}) {
                success
                message
              }
            }
          `,
        }
      );
  // problem ta3 tye script  wsh rayk nkhdmo f li fel action khirmn njiboha hena 
      const result = response.data?.data?.userForgotPassword;
      if (result?.success) {
        setMessage(result.message || "Password reset instructions sent to your email.");
        setTimeout(() => {
          router.push("/signin");
        }, 3000);
      } else {
        setError(result?.message || "Failed to send reset instructions.");
      }
    } catch (error) {
  if (axios.isAxiosError(error)) {
    setError(
      error.response?.data?.errors?.[0]?.message ||
      "An error occurred. Please try again later."
    );
  } else {
    setError("An unexpected error occurred.");
  }
}
 finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-container">
        <div className="form-card">
          <h1 className="text-xl font-semibold mb-4">Forgot Password</h1>

          {error && (
            <p className="text-red-500">
              {error} <br />
              Don't have an account?{" "}
              <Link href="/signup" className="text-blue-600 underline">
                Sign up here
              </Link>
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
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="d-grid">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </div>

          <p className="form-link text-center mt-4">
            Remember your password?{" "}
            <Link href="/signin" className="text-blue-600 underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </form>
  );
}