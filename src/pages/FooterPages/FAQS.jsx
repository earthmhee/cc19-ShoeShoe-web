import React from 'react'
import { Link } from 'react-router'

function FAQS() {
  return (
    <div className='container px-8 text-sm p-3 mb-20'>

      <div className="breadcrumbs text-sm mb-5">
        <ul>
          <li className='text-gray-400 hover:text-black'>
            <Link to={"/"}>HOME</Link>
          </li>
          <li>FAQS</li>
        </ul>
      </div>

      <div className='mb-5'>
        <p className='mb-3'>FAQ Question</p>
        <p>Question : How to place the order?</p>
        <p className='mt-3 mb-4'>Answer : You can register and sign in. Then select the product you want to order.
          At cart will show your products and proceed to the next step by entering details for shipping and payment details.
          After completion of the order process, you will receive the order number in your account.</p>
        <p className='mb-3'>Question : Payment methods and confirmation</p>

        <p>Answer : Payment methods</p>
        <ul className="list-disc ml-5 mb-3">
          <li>Payment via credit/debit card (You don't have to confirm the payment. *In the case that your money is not paid from your account, please contact Customer Service*)</li>
          <li>Payment via QR code (You don't have to confirm the payment. *In the case that your money is not paid from your account, please contact Customer Service*)</li>
          <li>Payment transfer (After you transfer money, Please confirm the payment on "CONFIRM PAYMENT" and put your details. http://www.shoeshoe.com/confirmpayment/)</li>
          <li>Cash on delivery or COD (You will not earn the points)</li>
        </ul>

        <p>Question : Shipping Status Tracking</p>
        <p>Answer : After you place the order, You will receive the tracking number in your order history (website) or follow the button (application).
          The delivery status will be updated within 1-2 business days. </p>
        <p>(After 2 days without any update, please contact customer service.)</p>
      </div>

    </div>
  )
}

export default FAQS