"use client";
import React, { useState, FormEvent } from "react";
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { Facebook, Instagram } from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import DevCredit from "@/components/devCredit";

interface FormData {
  name: string;
  email: string;
  message: string;
}

const ContactUs = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'Your message has been sent successfully!'
        });
        setFormData({ name: "", email: "", message: "" });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send message');
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-custom-beige text-white py-8 md:py-12 px-4 md:px-6 bottom-0">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Section - Contact Info & Social Media */}
          <div className="space-y-4 md:space-y-6 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold drop-shadow-lg">Contact Us</h2>
            <p className="text-sm md:text-lg text-gray-200">
              Have questions? We're here to help with sizing, orders, or styling advice.
            </p>

            {/* Contact Details */}
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center gap-2 md:gap-3">
                <EnvelopeIcon className="w-5 md:w-6 h-5 md:h-6 text-white" />
                <a href="mailto:meeriproject@gmail.com" className="text-gray-300 text-sm md:text-base hover:underline">
                  meeriproject@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <PhoneIcon className="w-5 md:w-6 h-5 md:h-6 text-white" />
                <a href="tel:+213777777777" className="text-gray-300 text-sm md:text-base hover:underline">
                  +213 777 777 777
                </a>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <MapPinIcon className="w-5 md:w-6 h-5 md:h-6 text-white" />
                <p className="text-gray-300 text-sm md:text-base">meeri online boutique, Alger Algeria</p>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="mt-4 md:mt-6">
              <h3 className="text-base md:text-lg font-semibold mb-2">Follow Us</h3>
              <div className="flex gap-3 md:gap-4 justify-center md:justify-start">
                <a 
                  href="https://www.facebook.com/people/Meeri-collection/61559554550501" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-300 transition"
                  aria-label="Facebook"
                >
                  <Facebook className="w-6 md:w-7 h-6 md:h-7 text-white" />
                </a>
                <a 
                  href="https://www.instagram.com/meeri__.collection?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="  
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-300 transition"
                  aria-label="Instagram"
                >
                  <Instagram className="w-6 md:w-7 h-6 md:h-7 text-white" />
                </a>
                <a 
                  href="https://www.tiktok.com/@meeri.collection"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-300 transition"
                  aria-label="TikTok"
                >
                  <FaTiktok className="w-6 md:w-7 h-6 md:h-7 text-white" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Section - Contact Form */}
          <div className="bg-white text-black p-5 md:p-6 rounded-lg shadow-lg w-full">
            <h3 className="text-xl md:text-2xl font-semibold text-center text-[#C4A484] mb-3 md:mb-4">
              Send Us a Message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
              {submitStatus.type && (
                <div className={`p-3 rounded-md ${
                  submitStatus.type === 'success' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {submitStatus.message}
                </div>
              )}
              
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2 md:p-3 text-sm md:text-base focus:border-[#C4A484] focus:ring-[#C4A484]"
                placeholder="Full Name"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2 md:p-3 text-sm md:text-base focus:border-[#C4A484] focus:ring-[#C4A484]"
                placeholder="Email Address"
                required
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={3}
                className="w-full border border-gray-300 rounded-md p-2 md:p-3 text-sm md:text-base focus:border-[#C4A484] focus:ring-[#C4A484]"
                placeholder="Your Message"
                required
              ></textarea>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-custom-beige text-white py-2 md:py-3 rounded-md font-semibold hover:bg-[#a27a64] transition-all ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
      {/* Developer Credit */}
      <DevCredit />
    </footer>
  );
};

export default ContactUs;