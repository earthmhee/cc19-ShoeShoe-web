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


      {/* Section: เงื่อนไขการเปลี่ยนสินค้า */}
      <div className='ml-5 text-sm'>
        <h2 className="font-bold text-xl pb-4">เงื่อนไขการเปลี่ยนสินค้า</h2>
        <ul className="list-disc ml-5">
          <li>สินค้าต้องอยู่ในสภาพเดิม 100% และมีบิลใบเสร็จ ไม่มีการตัดป้าย ซัก หรือสวมใส่ของสินค้า และต้องไม่เกิน 7 วัน นับตั้งแต่วันได้รับสินค้า</li>
          <li>ทางร้านขอคืนเงินในกรณีที่บริษัทไม่สามารถหาสินค้ามาเปลี่ยนหรือทดแทนสินค้าเดิมที่ลูกค้าได้สั่งซื้อไป</li>
          <li>ทางร้านขอคืนเงินในกรณีที่สินค้าชำรุดเสียหายจากทางบริษัท หรือสินค้าชิ้นนั้นๆ หมด</li>
          <li>ในกรณีที่ลูกค้าตั้งใจพยายามสั่งซื้อเข้ามาเกินข้อกำหนด ข้อจำกัดการซื้อของสินค้าแต่ละรุ่น ทางร้านจะรับคืนสินค้าและสามารถเปลี่ยนเป็นสินค้ารุ่นอื่นๆ แทนได้ แต่จะไม่สามารถคืนเงินได้</li>
          <li>สินค้าตัวพิเศษ ตัวจับฉลาก / RAFFLE ไม่สามารถเปลี่ยนหรือคืนเงินได้</li>
          <li>กรณีการขอคืนเงิน ลูกค้าต้องส่งหลักฐานการทำรายการ และทางร้านจะดำเนินเรื่องการทำจ่ายเงินคืนเข้าบัญชีของลูกค้า โดยมีระยะเวลาประมาณ 7-25 วันทำการ ขึ้นอยู่กับธนาคารของลูกค้าที่ทำรายการเข้ามา</li>
          <li>สินค้าโปรโมชั่น ลดราคา ไม่สามารถเปลี่ยนหรือคืนเงินได้ในทุกกรณี</li>
          <li>สอบถามเพิ่มเติมเกี่ยวกับการเปลี่ยนสินค้าได้ที่เบอร์ <strong>02-114-7423</strong></li>
        </ul>
      </div>

      <hr className="my-5" />

      {/* Section: การจัดการบัญชี */}
      <div className='ml-5 text-sm'>
        <h2 className="font-bold text-xl pb-4">การจัดการบัญชี</h2>
        <ul className="list-disc ml-5">
          <li>หากต้องการลบบัญชีผู้ใช้ของคุณ กรุณาติดต่อแอดมินทางอินบ็อกแฟนเพจ <strong>Carnival Store</strong> (*หลังจากลบบัญชีแล้ว คุณจะไม่สามารถใช้งานบัญชีของคุณได้อีก)</li>
          <li>หากทางร้านตรวจพบ หรือระบบจับเจอ การกระทำที่เข้าข่ายการใช้โปรแกรมช่วยกดสั่งซื้อสินค้า ทางร้านขอสงวนสิทธิ์ในการลบบัญชีและแต้มที่มีอยู่ ไม่ให้ใช้งานได้อีก</li>
        </ul>
      </div>

      <hr className="my-5" />

      {/* English Section: Exchange Policy */}
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
