import React from 'react';
import { Link } from 'react-router';

function HowtoOrder() {
    return (
        <div className='container px-8 text-sm p-3 mb-20'>

            <div className="breadcrumbs text-sm mb-5">
                <ul>
                    <li className='text-gray-400 hover:text-black'>
                        <Link to={"/"}>HOME</Link>
                    </li>
                    <li>HOW TO ORDER</li>
                </ul>
            </div>

            <h2 className='font-semibold'>How to Order</h2>
            <br />
            <h2 className='font-semibold'>How to Order from SHOESHOE Store</h2>
            <br />

            <div className='ml-5'>
                <p>1. Visit our physical stores at the following locations:</p>
                <ul className=' ml-5'>
                    <li className='mb-2'>Siam Square Soi 7 (Hard Rock Cafe area)<br />Phone: 02-2524215, 081-1734560</li>
                    <li className='mb-2'>Central Ladprao (3rd floor)<br />Phone: 02-937-1469, 081-590-2546</li>
                    <li className='mb-2'>UPPERGROUND CentralWorld (3rd floor, near Isetan entrance)<br />Phone: 02-2527372</li>
                    <li>Shoeshoe Mega Bangna (1st floor)<br />Phone: 02-105-1802</li>
                    <p>For store locations, visit: <a href="STORE_LOCATION">STORE LOCATION</a></p>
                </ul>
                <br />
                <p>2. Order online (for customers outside the area or unable to visit the store)</p>
                <p><a href="https://www.shoeshoebkk.com">Visit: www.shoeshoebkk.com to place your order. We have gathered products from various</a></p>
                    <p>brands in one place for your convenience. You can also collect points for special discounts. All products will be delivered within 1-2 business days.</p>
            </div>
            <br />

            <h2 className='font-semibold'>Steps to Order Online</h2>
            <br />

            <div className='ml-5'>
                <ol>
                    <li className='mb-2'>1. Register for an account, or if you already have a user, simply log in to place your order.</li>
                    <li className='mb-2'>2. Browse and select items from the NEW ARRIVAL, BRAND, CATEGORY, and SALE sections.</li>
                    <li className='mb-2'>3. Choose your delivery method: You can use Kerry Express or Thailand Post (EMS) for shipping. Shipping fees are 70 or 100 Baht (depending on the product). For more details, check SHIPPING FREE.</li>
                    <li className='mb-2'>4. Select your payment method (2 options available).</li>
                    <li className='mb-2'>5. Wait for the confirmation email. We will process your order and ship within 1-2 business days.</li>
                </ol>
            </div>
            <br />

            <div>
                <h2>Contact Us</h2>
                <p>If you have any questions or are unable to order via the website, feel free to contact us:</p>
                <ul>
                    <li><strong>Hotline:</strong> 02-114-7423</li>
                    <li><strong>Facebook Inbox:</strong> <a href="https://www.facebook.com/SHOESHOE">SHOESHOE Store</a></li>
                    <li><strong>Line id:</strong> @shoeshoebkk (don't forget to include the "@" symbol)</li>
                </ul>
                <p><strong>Business hours:</strong>10:00 AM - 7:00 PM every day, no holidays.</p>
            </div>

        </div>

    );
}

export default HowtoOrder;
