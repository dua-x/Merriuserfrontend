"use client";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";

const OrderConfirmationContent = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-20 px-6 bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <div className="animate-pulse mb-6">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto"></div>
        </div>
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Processing your order...</h1>
        <p className="text-gray-600 mb-6">Please wait while we confirm your order details</p>
      </div>
    </div>
  );
};

const OrderConfirmationClient = () => {
  const { useSearchParams } = require("next/navigation");
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-20 px-6 bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="mb-6">
          <div className="w-16 h-16 bg-custom-beige/80 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-10 h-10  text-custom-beige" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        </div>

        {/* Order Confirmation */}
        <h1 className="text-2xl font-bold mb-4 text-gray-800">شكراً لطلبكم!</h1>
        <h2 className="text-xl font-semibold mb-2  text-custom-beige">Thank You for Your Order!</h2>
        
        {/* Order ID */}
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <p className="text-sm text-gray-600 mb-2">رقم الطلب | Order ID</p>
          <p className="text-lg font-mono font-bold text-gray-800">{orderId}</p>
        </div>

        {/* Important Information */}
               <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">  Important Information  |  معلومات مهمة </h3>
          <p className="text-blue-700 text-sm mb-2">
            ✅ تم تسجيل طلبكم بنجاح
          </p>
          <p className="text-blue-700 text-sm mb-2">
            ✅ Your order has been successfully registered
          </p>
          <p className="text-blue-700 text-sm font-bold">
            📱 يرجى انتظار اتصال في الـ24 ساعة القادمة لتأكيد الطلب
          </p>
          <p className="text-blue-700 text-sm">
             Please wait for a confirmation call within the next 24 hours 📱
          </p>
        </div>

        {/* Next Steps */}
        <div className="mb-6 text-right">
          <h4 className="font-semibold text-gray-700 mb-2"> Next Steps:  الخطوات القادمة </h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li> 1.سيصلكم رسالة تأكيد خلال 24 ساعة</li>
            <li>1. You will receive a confirmation message within 24 hours</li>
            <li>2. سيتصل بكم فريقنا لتأكيد التفاصيل</li>
            <li>2. Our team will contact you to confirm details</li>

          </ul>
        </div>

        {/* Contact Information */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-yellow-800 mb-2">للاستفسار | For inquiries:</h4>
          <p className="text-yellow-700 text-sm">📞 0770-090-610</p>
          <p className="text-yellow-700 text-sm">✉️ meeriproject@gmail.com</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/#collections" 
            className="bg-custom-beige text-white px-6 py-3 rounded-lg hover:bg-[#a27a64] transition-colors"
          >
            متابعة التسوق | Continue Shopping
          </Link>
          <Link 
            href="/orders" 
            className="border border-custom-beige text-custom-beige px-6 py-3 rounded-lg hover:bg-custom-beige hover:text-white transition-colors"
          >
            تتبع الطلب | Track Order
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<OrderConfirmationContent />}>
      <OrderConfirmationClient />
    </Suspense>
  );
}