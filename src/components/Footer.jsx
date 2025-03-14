import React, { useState } from 'react'
import { FacebookIcon, InstagramIcon, YoutubeIcon } from '../icons';
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Link } from 'react-router';

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
                            <ul className="space-y-4">
                                <Link to={"/membership"}><li><a className="hover:underline">SHOESHOE MEMBERSHIP</a></li></Link>
                                <Link to={"/howtoorder"}><li><a className="hover:underline">HOW TO ORDER</a></li></Link>
                                <Link to={"/policies"}><li><a className="hover:underline">POLICIES</a></li></Link>
                                <Link to={"/privacy"}><li><a className="hover:underline">PRIVACY AND COOKIE POLICY</a></li></Link>
                                <Link to={"/faqs"}><li><a className="hover:underline">FAQs</a></li></Link>
                                <li className="mt-2 font-semibold">HOT LINE : 02-1147423</li>
                            </ul>
                        </div>

                        {/* SHIPPING */}
                        <div>
                            <h3 className="font-bold text-lg mb-3">SHIPPING</h3>
                            <ul className="space-y-4">
                                <Link to={"/shipping-policy"}><li><a className="hover:underline">SHIPPING POLICY</a></li></Link>
                                <Link to={"/status-tracking"}><li><a className="hover:underline">STATUS TRACKING</a></li></Link>
                                <Link to={"/amlocator"}><li><a className="hover:underline">STORE LOCATION</a></li></Link>
                            </ul>
                        </div>

                        {/* CONTACT US */}
                        <div>
                            <h3 className="font-bold text-lg mb-3">CONTACT US</h3>
                            <ul className="space-y-4">
                                <Link to={"about-us"}><li><a className="hover:underline">ABOUT US</a></li></Link>

                                <li className="mt-2 text-xs">
                                    <span className="font-semibold">CONTACT PHONE:</span> 02-1147423
                                    <li className='textarea-xs'>PHONE HOURS, MON-SUN: 10 AM - 7 PM ICT</li>
                                </li>
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
                                <a className="hover:scale-110 transition">
                                    <FacebookIcon className="w-7" />
                                </a>
                                <a className="hover:scale-110 transition">
                                    <InstagramIcon className="w-7" />
                                </a>
                                <a className="hover:scale-110 transition">
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
        </footer >
    );
}
