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

            <h1 className='text-2xl'>How to Order</h1>
            <br />
            <h2 className='text-2xl'>วิธีการซื้อสินค้าจากร้าน SHOESHOE Store</h2>
            <br />

            <div className='ml-5'>
                <p>1. ลูกค้าสามารถมาเลือกชมสินค้าได้ที่หน้าร้านทุกสาขาดังต่อไปนี้:</p>
                <ul className=' ml-5'>
                    <li className='mb-2'>สาขา สยาม สแควร์ ซอย 7(ลาน Hard rock Cafe)<br />โทร 02-2524215, 081-1734560</li>
                    <li className='mb-2'>สาขา เซ็นทรัล ลาดพร้าว (ชั้น 3)<br />โทร 02-937-1469, 081-590-2546</li>
                    <li className='mb-2'>UPPERGROUND เซ็นทรัลเวิลด์ (ชั้น 3 ใกล้ทางเข้า Isetan)<br />โทร 02-2527372</li>
                    <li>Shoeshoe เมกา บางนา ชั้น 1<br />โทร 02-105-1802</li>
                    <p>รายละเอียดของแต่ละสาขา : <a href="STORE_LOCATION">STORE LOCATION</a></p>
                </ul>
                <br />
                <p>2. วิธีการสั่งซื้อสินค้าทาง ONLINE STORE (สำหรับลูกค้าต่างจังหวัด หรือไม่สะดวกมาซื้อสินค้าที่หน้าร้าน)
                    <a href="https://www.shoeshoebkk.com"> www.shoeshoebkk.com</a>
                    <p>เพื่อทำรายสั่งซื้อ โดยเราได้รวบรวมสินค้าจากทุกแบรนด์มาไว้ในที่เดียว เพิ่มความสะดวกในการเลือกซื้อสินค้า</p>
                    รวมถึงสามารถสะสมคะแนนเพื่อเป็นส่วนลดพิเศษได้อีกด้วย สินค้าทุกชิ้นจะถึงมือลูกค้าภายใน 1-2 วันทำการ
                </p>
            </div>
            <br />

            <h3 className='text-2xl'>ขั้นตอนการสั่งซื้อสินค้า Online</h3>
            <br />

            <div className='ml-5'>
                <ol>
                    <li className='mb-2'>1. สมัครสมาชิก หรือลูกค้าที่มี User อยู่แล้ว สามารถทำการ Login เพื่อสั่งซื้อได้เลยครับ (หากยังไม่มี User กรุณาลงทะเบียนก่อนทำการสั่งซื้อสินค้า)</li>
                    <li className='mb-2'>2. เลือกซื้อสินค้าที่ต้องการจาก NEW ARRIVAL, BRAND, CATEGORY และ SALE</li>
                    <li className='mb-2'>3. เลือกวิธีการจัดส่งสินค้า ซึ่งเรามีให้เลือกใช้บริการทั้งจาก Kerry Express และ ไปรษณีย์ไทย (EMS) ค่าจัดส่ง 70 หรือ 100 บาท (ขึ้นอยู่กับสินค้า สามารถตรวจสอบได้ที่ SHIPPING FREE)</li>
                    <li className='mb-2'>4. เลือกวิธีการชำระเงิน สามารถชำระเงินได้ 2 ช่องทาง</li>
                    <li className='mb-2'>5. รอรับอีเมลยืนยันการสั่งซื้อ ทางร้านจะจัดส่งสินค้าภายใน 1-2 วันทำการ</li>
                </ol>
            </div>
            <br />

            <div>
                <h3>ติดต่อเรา</h3>
                <p>หากมีข้อสงสัย หรือไม่สามารถสั่งสินค้าผ่านทางเว็บไซต์ได้ สามารถติดต่อเราได้ที่:</p>
                <ul>
                    <li><strong>Hotline:</strong> 02-114-7423</li>
                    <li><strong>Facebook Inbox:</strong> <a href="https://www.facebook.com/SHOESHOE">SHOESHOE Store</a></li>
                    <li><strong>Line id:</strong> @shoeshoebkk (ต้องใส่สัญลักษณ์ @ ข้างหน้าด้วยนะครับ)</li>
                </ul>
                <p><strong>เวลาทำการในการสั่งซื้อและตอบคำถามลูกค้า:</strong> 10.00 น. - 19.00 น. ทุกวันไม่มีวันหยุด</p>
            </div>

        </div>

    );
}

export default HowtoOrder;
