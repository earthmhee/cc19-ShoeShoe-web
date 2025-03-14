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
        <h2 className='text-2xl mb-5'>Shipping</h2>
        <h2 className='text-2xl mb-5'>การจัดส่งสินค้าภายในประเทศ</h2>

        <ul className="list-disc ml-5 mb-20">
          <li>สินค้าทั่วไป จัดส่งภายใน 1-2 วันทำการ ไม่รวมวันเสาร์อาทิตย์และวันหยุดนักขัตฤกษ์</li>
          <li>สินค้า Special Collection จัดส่งภายใน 3-5 วันทำการ ไม่รวมวันเสาร์อาทิตย์และวันหยุดนักขัตฤกษ์</li>
          <li>สินค้า Pre-order จัดส่งตามวันเวลาที่ได้ทำการประกาศเอาไว้ (สามารถดูข้อมูลได้ที่ facebook ของทางร้าน หรือสามารถดูได้ที่ตัวสินค้าตอนทำรายการสั่งซื้อสินค้านั้นๆ)</li>
          <p>หากท่านไม่ได้รับสินค้าหรือต้องการสอบถามข้อมูลเพิ่มเติมกรุณาติดต่อที่ Call center 02-114-7423 หรือทาง inbox facebook และ ทาง line : @shoeshoebkk เวลา 10.00 - 19.00 น</p>
        </ul>

        <h2 className='text-2xl mb-5'>SHOESHOE ใช้บริการขนส่งของบริษัท Kerry Express ในการส่งสินค้าภายในประเทศไทย</h2>
        <p className='mb-3'>ลูกค้าจำเป็นต้องให้เบอร์โทรศัพท์มือถือที่ติดต่อได้ เนื่องจากทาง Kerry Express จะโทรเข้าไปก่อนจะเข้าไปส่งสินค้า หากทาง Kerry ไม่สามารถติดต่อลูกค้าได้ หรือ ลูกค้าไม่สามารถรับโทรศัพท์ได้
          Kerry Express จะติดเข้าไปใหม่ หากภายใน 1-2 วันทาง Kerry ยังติดต่อลูกค้าไม่ได้ ทาง Kerry จะไม่สามารถส่งสินค้าได้และจะส่งสินค้าคืนมายัง SHOESHOE
        </p>

        <p lassName='mb-3'>**ตรวจสอบสถานการณ์จัดส่งได้ทาง  https://th.kerryexpress.com/en/track/</p>

        <p>หากลูกค้าไม่สะดวกรับโทรศัพท์จาก Kerry Express ลูกค้าสามารถแจ้งให้ทางเราส่งด้วย ไปรษณีย์ไทย (EMS) ได้เช่นกัน โดยไม่มีค่าใช้จ่ายเพิ่ม (ระยะเวลาในการส่งของ EMS โดยปกติจะช้ากว่า Kerry Express)</p>
      </div>

    </div>
  )
}

export default ShippingPolicy