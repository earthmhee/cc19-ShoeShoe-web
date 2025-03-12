import React, { useState } from 'react'
import { FacebookIcon, InstagramIcon, YoutubeIcon } from '../icons';
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function Footer() {
    const [isOpen, setIsOpen] = useState(false);


    return (
        <footer className="w-full bg-white border-t border-gray-300 text-sm relative md:block hidden">

            <div className="md:hidden flex justify-center py-4">
                <button
                    className="flex items-center space-x-2 text-blue-500 font-semibold"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span>{isOpen ? "Hide Footer" : "Show Footer"}</span>
                    {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                </button>
            </div>

            {/* Footer Content */}
            <div
                className={`${isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0 md:max-h-[1000px] md:opacity-100"
                    } overflow-hidden transition-all duration-500 ease-in-out`}
            >
                <div className="container mx-auto px-6 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                        {/* CUSTOMER SERVICE */}
                        <div>
                            <h3 className="font-bold text-lg mb-3">CUSTOMER SERVICE</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="hover:underline">SHOESHOE MEMBERSHIP</a></li>
                                <li><a href="#" className="hover:underline">HOW TO ORDER</a></li>
                                <li><a href="#" className="hover:underline">POLICIES</a></li>
                                <li><a href="#" className="hover:underline">PRIVACY AND COOKIE POLICY</a></li>
                                <li><a href="#" className="hover:underline">FAQs</a></li>
                                <li className="mt-2 font-semibold">HOT LINE : 02-1147423</li>
                            </ul>
                        </div>

                        {/* SHIPPING */}
                        <div>
                            <h3 className="font-bold text-lg mb-3">SHIPPING</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="hover:underline">SHIPPING POLICY</a></li>
                                <li><a href="#" className="hover:underline">STATUS TRACKING</a></li>
                                <li><a href="#" className="hover:underline">STORE LOCATION</a></li>
                            </ul>
                        </div>

                        {/* CONTACT US */}
                        <div>
                            <h3 className="font-bold text-lg mb-3">CONTACT US</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="hover:underline">ABOUT US</a></li>
                                <li className="mt-2">
                                    <span className="font-semibold">CONTACT PHONE:</span> 02-1147423
                                </li>
                                <li>PHONE HOURS, MON-SUN: 10 AM - 7 PM ICT</li>
                                <li>
                                    <a href="mailto:support@shoeshoe.com" className="text-blue-500 hover:underline">
                                        SUPPORT@SHOESHOE.COM
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* FOLLOW US */}
                        <div>
                            <h3 className="font-bold text-lg mb-3">FOLLOW US</h3>
                            <div className="flex space-x-4">
                                <a href="#" className="hover:scale-110 transition">
                                    <FacebookIcon className="w-7" />
                                </a>
                                <a href="#" className="hover:scale-110 transition">
                                    <InstagramIcon className="w-7" />
                                </a>
                                <a href="#" className="hover:scale-110 transition">
                                    <YoutubeIcon className="w-7" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center py-4 border-t border-gray-300 text-xs text-gray-500">
                    © SHOESHOE SUPPLY CO., LTD. ALL RIGHTS RESERVED.
                </div>
            </div>
        </footer>
    );
}
