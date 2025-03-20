import React from 'react';
import { Link } from 'react-router';

function ExchangePolicy() {
  return (
    <div className='container px-8 text-sm p-3 mb-20'>
      <div className="breadcrumbs text-sm mb-5">
        <ul>
          <li className='text-gray-400 hover:text-black'>
            <Link to={"/"}>HOME</Link>
          </li>
          <li>POLICIES</li>
        </ul>
      </div>

      <div className='ml-5 text-sm'>
        <h2 className="font-bold text-xl pb-4">EXCHANGE POLICY</h2>
        <h3 className="font-semibold">Return/Refund Policy</h3>
        <ul className="list-disc ml-5">
          <li>The issue with the product is a result of a production defect.</li>
          <li>Our team will conduct an inventory check to determine if there is a model of that product available. *We will provide a replacement for the customer.*</li>
          <li>In the event that the product is currently unavailable, customers have the option to select from other available models.</li>
          <li>Carnival retains the authority to cancel the order and provide a full refund to the customer.</li>
        </ul>
      </div>

      <hr className="my-5" />

      {/* English Section: Order Cancellation */}
      <div className='ml-5 text-sm'>
        <h3 className="font-semibold text-xl pb-4">Order Cancellation</h3>
        <ul className="list-disc ml-5">
          <li>If there is an error in the bank website payment system resulting in an ordering error.</li>
          <li>Should a system error occur, Carnival retains the authority to cancel the customer's order and provide a full refund.</li>
          <li>If we detect any attempts to utilize the program for unauthorized ordering (bot) or any attempts to attack the website, the customer and user will be added to our blacklist.</li>
          <li>Carnival retains the authority to cancel the customer's order and provide a full refund.</li>
        </ul>
      </div>

      <hr className="my-5" />

      {/* English Section: Managing My Account */}
      <div className='ml-5 text-sm'>
        <h3 className="font-semibold text-xl pb-4">MANAGING MY ACCOUNT</h3>
        <ul className="list-disc ml-5">
          <li>To delete your account, please contact admin via inbox fan page <strong>Carnival Store</strong>. (*After deletion, you will not be able to use your account.)</li>
          <li>After our admin receives your request, all of your personal data will be deleted within <strong>7-14 working days</strong>.</li>
        </ul>
      </div>
    </div>
  );
}

export default ExchangePolicy;
