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

      {/* Membership Information */}
      <div className='ml-5 text-sm'>
        <h2>CARNIVAL MEMBERSHIP (For English version please see below.)</h2>
        <br />

        <h3 className="font-semibold">ระดับสถานะ MEMBER</h3>
        <br />
        <h3 className="font-semibold">SILVER MEMBER</h3>
        <br />
        <p>สำหรับลูกค้าใหม่ เมื่อท่านลงทะเบียนสมาชิกผ่านทางเว็บไซต์ หรือ Application ท่านจะได้สิทธิ์ในการเป็น Silver Member โดยจะสามารถสะสมคะแนนได้ทันที (บัตรสมาชิกจะแสดงอยู่ใน Application)</p>
        <p>**คะแนนสะสมจะเกิดจากการซื้อสินค้าที่หน้าร้าน และทางออนไลน์ โดยทุกการซื้อสินค้า 100 บาท จะเท่ากับ 1 คะแนน (1 คะแนน = 1 บาท)**</p>
        <br />

        <h3 className="font-semibold">GOLD MEMBER (Vip Member เดิม)</h3>
        <br />
        <h3 className="font-semibold">สิทธิประโยชน์สำหรับสมาชิก GOLD MEMBER</h3>
        <ul className="list-disc ml-5">
          <li>รับส่วนลด 10% สำหรับสินค้าที่เข้าร่วมรายการ</li>
          <li>GOLD MEMBERSHIP มีอายุการใช้งาน 2 ปี</li>
          <li>**เพื่อรับสิทธิต่างๆ ลูกค้าจะต้องแสดงบัตร MEMBER ใน Application เท่านั้น**</li>
        </ul>
        <br />

        <h3 className="font-semibold">เงื่อนไขการเปลี่ยนสถานะสมาชิกจาก SILVER สู่ GOLD</h3>
        <p>**ใช้คะแนนสะสมในบัญชี 150 คะแนนในการเปลี่ยนสถานะสมาชิก**</p>
        <h4 className="font-semibold">วิธีการกดแลกสถานะ</h4>
        <p>**สามารถทำได้ด้วยตัวเอง**</p>

        <h4 className="font-semibold">การเปลี่ยนสถานะบนแอพพลิเคชั่น</h4>
        <ol className="list-decimal ml-5">
          <li>กดเลือกหัวข้อ ME</li>
          <li>กดเลือกหัวข้อ “ข้อมูลผู้ใช้” (ACCOUNT INFORMATION)</li>
          <li>กดเลือก UPGRADE สถานะเพื่อเปลี่ยนเป็น GOLD MEMBERSHIP (ใช้คะแนนสะสมในบัญชี 150 คะแนน)</li>
        </ol>
        <br />

        <h4 className="font-semibold">การเปลี่ยนสถานะบนเว็บไซต์</h4>
        <ol className="list-decimal ml-5">
          <li>กดเลือกหัวข้อ บัญชีของฉัน (MY ACCOUNT)</li>
          <li>กดเลือกหัวข้อ “ข้อมูลผู้ใช้” (ACCOUNT INFORMATION)</li>
          <li>กดเลือก UPGRADE สถานะเพื่อเปลี่ยนเป็น GOLD MEMBERSHIP (ใช้คะแนนสะสมในบัญชี 150 คะแนน)</li>
        </ol>
        <br />

        <h3 className="font-semibold">วิธีการต่ออายุสมาชิก</h3>
        <p>**ใช้คะแนนสะสมในบัญชี 100 คะแนนเพื่อต่ออายุสมาชิก**</p>

        <h4 className="font-semibold">การต่อสถานะสมาชิก GOLD บนแอพพลิเคชั่น</h4>
        <ol className="list-decimal ml-5">
          <li>กดเลือกหัวข้อ ME</li>
          <li>กดเลือกหัวข้อ “ข้อมูลผู้ใช้” (ACCOUNT INFORMATION)</li>
          <li>กดเลือก RENEW สถานะเพื่อเปลี่ยนเป็น GOLD MEMBERSHIP (ใช้คะแนนสะสมในบัญชี 100 คะแนน)</li>
        </ol>
        <br />

        <h4 className="font-semibold">การต่อสถานะสมาชิก GOLD บนเว็บไซต์</h4>
        <ol className="list-decimal ml-5">
          <li>กดเลือกหัวข้อ บัญชีของฉัน (MY ACCOUNT)</li>
          <li>กดเลือกหัวข้อ “ข้อมูลผู้ใช้” (ACCOUNT INFORMATION)</li>
          <li>กดเลือก RENEW สถานะเพื่อเปลี่ยนเป็น GOLD MEMBERSHIP (ใช้คะแนนสะสมในบัญชี 100 คะแนน)</li>
        </ol>
        <br />

        <p>หากมีข้อสงสัยเกี่ยวกับการสมัครสมาชิกท่านสามารถติดต่อเบอร์ Hotline ได้ที่ 02-114-7423</p>
      </div>

      <hr className="my-5" />

      {/* English Version */}
      <div className='ml-5 text-sm'>
        <h2 className="font-bold">ENGLISH VERSION</h2>
        <br />

        <h3 className="font-semibold">SILVER MEMBERSHIP</h3>
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
