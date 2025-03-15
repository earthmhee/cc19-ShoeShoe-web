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

      <div className='mb-20'>
        <p className='mb-3'>คำถามทีพบบ่อย</p>
        <p>คำถาม : ฉันจะทำการรายการสั่งซื้อได้อย่างไร ?</p>
        <p className='mt-3 mb-4'>คำตอบ : คุณสามารถ สมัครสมาชิกและเข้าสู่ระบบ จากนั้นเลือกสินค้าที่คุณต้องการสั่งซื้อ ภายในตะกร้าของคุณจะแสดงสินค้าที่คุณต้องการสั่งซื้อ
          และดำเนินการทำตามขั้นตอนถัดไปโดยการใส่รายละเอียดสำหรับการจัดส่งสินค้าและรายละเอียดการชำระเงิน
          เมื่อเสร็จสิ้นขั้นตอนการสั่งซื้อคุณจะได้รับเลขคำสั่งซื้อและรายการคำสั่งซื้อจะปรากฎในบัญชีของคุณ</p>
        <p className='mb-3'>คำถาม : ช่องทางการชำระเงินและการยืนยันชำระเงิน</p>

        <p>คำตอบ : ช่องทางการชำระเงินจะแบ่งออกตามหัวข้อดังนี้</p>
        <ul className="list-disc ml-5 mb-3">
          <li>การชำระผ่านช่องทางบัตรเครดิต/เดบิต (คุณไม่ต้องทำการยืนยันชำระเงิน *กรณีหากพบว่ายอดเงินของคุณไม่ถูกหักจากบัญชี โปรดแจ้งตรวจสอบผ่านทางฝ่ายบริการลูกค้า*)</li>
          <li>การชำระผ่านช่องทาง QR code (คุณไมต้องทำการยืนยันชำระเงิน *กรณีหากพบว่ายอดเงินของคุณไม่ถูกหักจากบัญชี โปรดแจ้งตรวจสอบผ่านทางฝ่ายบริการลูกค้า*)</li>
          <li>การชำระผ่านช่องทางการโอนเงิน (เมื่อคุณโอนเงินแล้ว กรุณาทำรายการยืนยันการชำระเงินโดยกดที่ "CONFIRM PAYMENT” แล้วกรอกรายละเอียด รายการสั่งซื้อถึงจะเข้าระบบ https://www.shoeshoe.com/cpayment/request/new/</li>
          <li>การชำระแบบเก็บเงินปลายทาง (คุณจะไม่ได้รับแต้มสะสม)</li>
        </ul>

        <p>คำถาม : การติดตามสถานะจัดส่ง</p>
        <p>คำตอบ : หลังจากคุณสั่งซื้อจะได้รับเลขพัสดุในประวัติการสั่งซื้อของคุณ (เว็บไซต์) หรือ กดติดตาม (แอพพลิเคชั่น) สถานะการจัดส่งจะอัปเดต ภายใน 1-2 วันทำการ หากเกินระยะเวลาดังกล่าวโปรดตรวจสอบผ่านทางฝ่ายบริการลูกค้า</p>
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