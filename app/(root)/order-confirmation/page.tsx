// app/order-confirmation/page.tsx
"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import React from "react";

const OrderConfirmationPage = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6">
      <h1 className="text-3xl font-bold mb-4">Thank You for Your Order!</h1>
      <p className="text-lg mb-6">
        Your order <span className="font-medium">{orderId}</span> has been placed successfully.
      </p>
      <Link href="/#collections" className="text-blue-600 underline">
        Continue Shopping
      </Link>
    </div>
  );
};

export default OrderConfirmationPage;
