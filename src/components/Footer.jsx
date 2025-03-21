import React from 'react';
import { FacebookIcon, InstagramIcon, YoutubeIcon } from '../icons';
import { Link } from 'react-router';

export default function Footer() {
    return (
        <footer className="w-full bg-white border-t border-gray-300 text-sm relative">
            <div className="container mx-auto px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    
      
                    <div>
                        <h3 className="font-bold text-lg mb-3">CUSTOMER SERVICE</h3>
                        <ul className="space-y-4">
                            <li><Link to="/membership" className="hover:underline">SHOESHOE MEMBERSHIP</Link></li>
                            <li><Link to="/howtoorder" className="hover:underline">HOW TO ORDER</Link></li>
                            <li><Link to="/policies" className="hover:underline">POLICIES</Link></li>
                            <li><Link to="/privacy" className="hover:underline">PRIVACY AND COOKIE POLICY</Link></li>
                            <li><Link to="/faqs" className="hover:underline">FAQs</Link></li>
                            <li className="mt-2 font-semibold">HOT LINE : 02-1147423</li>
                        </ul>
                    </div>


                    <div>
                        <h3 className="font-bold text-lg mb-3">SHIPPING</h3>
                        <ul className="space-y-4">
                            <li><Link to="/shipping-policy" className="hover:underline">SHIPPING POLICY</Link></li>
                            <li><Link to="/status-tracking" className="hover:underline">STATUS TRACKING</Link></li>
                            <li><Link to="/amlocator" className="hover:underline">STORE LOCATION</Link></li>
                        </ul>
                    </div>


                    <div>
                        <h3 className="font-bold text-lg mb-3">CONTACT US</h3>
                        <ul className="space-y-4">
                            <li><Link to="/about-us" className="hover:underline">ABOUT US</Link></li>
                            <li className="mt-2 text-xs">
                                <span className="font-semibold">CONTACT PHONE:</span> 02-1147423
                            </li>
                            <li className="text-xs">PHONE HOURS, MON-SUN: 10 AM - 7 PM ICT</li>
                            <li>
                                <a href="mailto:support@shoeshoe.com" className="text-blue-500 hover:underline">
                                    SUPPORT@SHOESHOE.COM
                                </a>
                            </li>
                        </ul>
                    </div>

    
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
        </footer>
    );
}
