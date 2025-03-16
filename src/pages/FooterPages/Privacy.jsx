import React from "react";
import { Link } from "react-router";

const PrivacyPolicy = () => {
  return (
    <div className='container px-8 text-sm p-3 mb-20'>
      <div className="breadcrumbs text-sm mb-5">
        <ul>
          <li className='text-gray-400 hover:text-black'>
            <Link to={'/'}>HOME</Link>
          </li>
          <li>PRIVACY AND COOKIE POLICY</li>
        </ul>
      </div>

      <div className='ml-5 text-sm'>
        <h2 className="text-2xl font-bold">Privacy and Cookie Policy</h2>
        <br />

        <p>
          โดยบริษัท SHOESHOE SUPPLY CO., LTD. ซึ่งต่อไปนี้จะเรียกว่า (“บริษัท”, “เรา”, “พวกเรา”, “ของเรา” หรือ “ของพวกเรา”) 
          มุ่งมั่นที่จะปกป้องข้อมูลส่วนบุคคลของคุณและสิทธิ์ในความเป็นส่วนตัวของคุณ หากคุณมีคำถามหรือข้อกังวลใดๆ โปรดติดต่อเราที่
          <a href="mailto:support@shoeshoebkk.com" className="text-blue-500"> support@shoeshoebkk.com</a>
        </p>
        
        <h3 className='text-lg font-semibold mt-4'>ข้อมูลส่วนบุคคลที่เรารวบรวม</h3>
        <p>
          เมื่อคุณเยี่ยมชมเว็บไซต์ เราอาจเก็บข้อมูลเกี่ยวกับอุปกรณ์ของคุณ เช่น เบราว์เซอร์ ที่อยู่ IP และคุกกี้บางส่วน
        </p>
        <ul className='list-disc ml-6'>
          <li>คุกกี้ - ไฟล์ข้อมูลที่บันทึกบนอุปกรณ์ของคุณ</li>
          <li>ไฟล์บันทึก - บันทึกการกระทำที่เกิดขึ้นบนเว็บไซต์</li>
          <li>เว็บบีคอน, แท็ก, พิกเซล - ใช้ติดตามการใช้งานเว็บไซต์</li>
        </ul>

        <h3 className='text-lg font-semibold mt-4'>การใช้ข้อมูลส่วนบุคคล</h3>
        <p>
          เราใช้ข้อมูลของคุณเพื่อประมวลผลคำสั่งซื้อ ปรับปรุงเว็บไซต์ และเพื่อการตลาด
        </p>

        <h3 className='text-lg font-semibold mt-4'>การแบ่งปันข้อมูล</h3>
        <p>
          เราอาจแบ่งปันข้อมูลของคุณกับบุคคลที่สาม เช่น Google Analytics เพื่อวิเคราะห์การใช้งานเว็บไซต์
        </p>

        <h3 className='text-lg font-semibold mt-4'>การจัดการบัญชี</h3>
        <p>
          หากคุณต้องการลบบัญชีของคุณ โปรดติดต่อแอดมินผ่านอินบ็อกซ์เพจ SHOESHOE Store หลังจากที่เรารับคำขอ
          ข้อมูลของคุณจะถูกลบภายใน 7-14 วันทำการ
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
