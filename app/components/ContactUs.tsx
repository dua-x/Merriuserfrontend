import React from "react";
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { Facebook, Instagram, Twitter } from "lucide-react";

const ContactUs = () => {
    return (
        <footer className="bg-custom-beige text-white py-8 md:py-12 px-4 md:px-6">
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
                                <p className="text-gray-300 text-sm md:text-base">support@merri.com</p>
                            </div>
                            <div className="flex items-center gap-2 md:gap-3">
                                <PhoneIcon className="w-5 md:w-6 h-5 md:h-6 text-white" />
                                <p className="text-gray-300 text-sm md:text-base">+1 (234) 567-890</p>
                            </div>
                            <div className="flex items-center gap-2 md:gap-3">
                                <MapPinIcon className="w-5 md:w-6 h-5 md:h-6 text-white" />
                                <p className="text-gray-300 text-sm md:text-base">123 Merri Street, Fashion City</p>
                            </div>
                        </div>

                        {/* Social Media Links */}
                        <div className="mt-4 md:mt-6">
                            <h3 className="text-base md:text-lg font-semibold mb-2">Follow Us</h3>
                            <div className="flex gap-3 md:gap-4 justify-center md:justify-start">
                                <a href="#" className="hover:text-gray-300 transition">
                                    <Facebook className="w-6 md:w-7 h-6 md:h-7 text-white" />
                                </a>
                                <a href="#" className="hover:text-gray-300 transition">
                                    <Instagram className="w-6 md:w-7 h-6 md:h-7 text-white" />
                                </a>
                                <a href="#" className="hover:text-gray-300 transition">
                                    <Twitter className="w-6 md:w-7 h-6 md:h-7 text-white" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Contact Form */}
                    <div className="bg-white text-black p-5 md:p-6 rounded-lg shadow-lg w-full">
                        <h3 className="text-xl md:text-2xl font-semibold text-center text-[#C4A484] mb-3 md:mb-4">
                            Send Us a Message
                        </h3>
                        <form className="space-y-3 md:space-y-4">
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-md p-2 md:p-3 text-sm md:text-base focus:border-[#C4A484] focus:ring-[#C4A484]"
                                placeholder="Full Name"
                            />
                            <input
                                type="email"
                                className="w-full border border-gray-300 rounded-md p-2 md:p-3 text-sm md:text-base focus:border-[#C4A484] focus:ring-[#C4A484]"
                                placeholder="Email Address"
                            />
                            <textarea
                                rows={3}
                                className="w-full border border-gray-300 rounded-md p-2 md:p-3 text-sm md:text-base focus:border-[#C4A484] focus:ring-[#C4A484]"
                                placeholder="Your Message"
                            ></textarea>
                            <button
                                type="submit"
                                className="w-full bg-custom-beige text-white py-2 md:py-3 rounded-md font-semibold hover:bg-[#a27a64] transition-all"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default ContactUs;
