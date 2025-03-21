import React from 'react';
import { Link } from 'react-router';

function Membership() {
  return (
    <div className='container px-8 text-sm p-3 mb-20'>

      <div className="breadcrumbs text-sm mb-5">
        <ul>
          <li className='text-gray-400 hover:text-black'>
            <Link to={"/"}>HOME</Link>
          </li>
          <li>SHOESHOE MEMBERSHIP</li>
        </ul>
      </div>

      <div className='ml-5 text-sm'>
        <h2 className="font-semibold">SILVER MEMBERSHIP</h2>
        <p>For new customers, your account will be SILVER MEMBERSHIP after registration through the Carnival website or application. With this level, you can collect and earn points at your first purchase in Carnival.</p>
        <br />

        <h3 className="font-semibold">Privileges for SILVER MEMBERSHIP</h3>
        <ul className="list-disc ml-5">
          <li>Every 100 THB spent on Carnival will earn 1 point</li>
          <li>Redeem points to get a discount (1 point = 1 THB Discount)</li>
          <li>Points earned do not expire</li>
        </ul>
        <br />

        <h3 className="font-semibold">GOLD MEMBERSHIP</h3>
        <br />

        <h3 className="font-semibold">Privileges for GOLD MEMBERSHIP</h3>
        <ul className="list-disc ml-5">
          <li>Get 10% discount for any purchasing in Carnival</li>
          <li>Every 100 THB spent on Carnival will earn 1 point</li>
          <li>Redeem points to get the discount (1 point = 1 THB Discount)</li>
          <li>2-year Expiration</li>
        </ul>
        <br />

        <p>**To redeem the points, please show the membership on the application at the cashier**</p>
        <p>**The discount and points earned are not applicable to any exclusive products**</p>
        <br />

        <h3 className="font-semibold">How to UPGRADE MEMBERSHIP from SILVER to GOLD</h3>
        <p>(Use 150 Points to upgrade to GOLD MEMBERSHIP)</p>

        <h4 className="font-semibold">On Carnival Application</h4>
        <ul className="list-disc ml-5">
          <li>Select “Me”</li>
          <li>Select “Account Information”</li>
          <li>Select “Upgrade” (Use 150 Points to upgrade)</li>
        </ul>
        <br />

        <h4 className="font-semibold">On Website</h4>
        <ul className="list-disc ml-5">
          <li>Select “My Account”</li>
          <li>Select “Account Information”</li>
          <li>Select “Upgrade” (Use 150 Points to upgrade)</li>
        </ul>
        <br />

        <p>If you have any questions, please contact our Call Center: 02-114-7423</p>
      </div>
    </div>
  );
}

export default Membership;
