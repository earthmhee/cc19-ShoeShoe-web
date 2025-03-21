import React from 'react'
import { Link } from 'react-router'

function ShippingPolicy() {
  return (
    <div className='container px-8 p-3 text-sm mb-20'>

      <div className="breadcrumbs text-sm mb-5">
        <ul>
          <li className='text-gray-400 hover:text-black'>
            <Link to={"/"}>HOME</Link>
          </li>
          <li>SHIPPING POLICY</li>
        </ul>
      </div>

      <div>
        <h2 className='font-semibold text-2xl mb-5'>Shipping</h2>
        <h2 className='font-semibold text-2xl mb-5'>Domestic Shipping</h2>

        <ul className="list-disc ml-5 mb-20">
          <li>General products: Shipped within 1-2 business days (excluding weekends and public holidays).</li>
          <li>Special Collection products: Shipped within 3-5 business days (excluding weekends and public holidays).</li>
          <li>Pre-order products: Shipped according to the announced schedule (please check our Facebook page or the product details at the time of purchase).</li>
          <p>If you do not receive your order or need further assistance, please contact our Call Center at 02-114-7423, via Facebook inbox, or through LINE: @shoeshoebkk from 10:00 AM - 7:00 PM.</p>
        </ul>

        <h2 className='font-semibold text-2xl mb-5'>Shipping Information</h2>
        <p className='mb-3'>SHOESHOE uses Kerry Express for domestic shipping.</p>
        <p className='mb-3'>Customers must provide a valid mobile phone number, as Kerry Express will call before delivering the package.</p>
        <ul className="list-disc ml-5 mb-20">
          <li>If Kerry Express cannot reach the customer or the customer is unable to answer the call, they will attempt to contact again.</li>
          <li>If Kerry Express is still unable to reach the customer within 1-2 days, the package will be returned to SHOESHOE.</li>
        </ul>

        <p lassName='mb-3'>📦 Track your shipment here: https://th.kerryexpress.com/en/track/</p>

        <p>If you are unable to receive calls from Kerry Express, you may request delivery via Thailand Post (EMS) at no additional cost (EMS delivery usually takes longer than Kerry Express).</p>
      </div>

    </div>
  )
}

export default ShippingPolicy