"use client";
import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";

// Wrap the main component with Suspense
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_IPHOST}/StoreAPI/users/setpassword/${token}`,
        { password }
      );

      if (response.data.success) {
        setMessage(response.data.message || "Password reset successfully. You can now sign in.");
      } else {
        setError(response.data.message || "Failed to reset password.");
      }
    } catch (error: any) {
      setError(
        error.response?.data?.errors?.[0]?.message ||
        "An error occurred. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="form-container">
        <div className="form-card">
          <h1 className="text-xl font-semibold mb-4">Invalid Token</h1>
          <p className="text-red-500 mb-4">
            The reset link is invalid or has expired.
          </p>
          <Link
            href="/forgotPassword"
            className="text-blue-600 underline"
          >
            Request a new reset link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-card">
        <h1 className="text-xl font-semibold mb-4">Reset Your Password</h1>

        {error && (
          <p className="text-red-500 mb-4">
            {error}
          </p>
        )}
        {message && <p className="text-green-500 mb-4">{message}</p>}

        <div className="mb-3">
          <label>New Password</label>
          <input
            name="password"
            type="password"
            className="form-control"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Confirm Password</label>
          <input
            name="confirmPassword"
            type="password"
            className="form-control"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <div className="d-grid">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </div>

        {message && (
          <p className="form-link text-center mt-4">
            <Link href="/signin" className="text-blue-600 underline">
              Back to Sign In
            </Link>
          </p>
        )}
      </div>
    </form>
  );
}