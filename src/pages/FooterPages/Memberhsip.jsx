import React from 'react';

function Membership() {
  return (
    <div className="membership-page">
      <h1>SHOESHOE MEMBERSHIP</h1>
      <p>SHOESHOE MEMBERSHIP (For English version please see below.)</p>

      {/* Thai Version */}
      <div className="thai-version">
        <h2>ระดับสถานะ MEMBER</h2>

        <h3>SILVER MEMBER</h3>
        <p>สำหรับลูกค้าใหม่ เมื่อท่านลงทะเบียนสมาชิกผ่านทางเว็บไซต์ หรือ Application ท่านจะได้สิทธิ์ในการเป็น Silver Member...</p>
        <p><strong>คะแนนสะสมจะเกิดจากการซื้อสินค้าจากหน้าร้านและทางออนไลน์ โดยทุกการซื้อสินค้า 100 บาท เท่ากับ 1 คะแนน</strong></p>

        <h3>GOLD MEMBER (Vip Member เดิม)</h3>
        <p>สิทธิประโยชน์สำหรับสมาชิก GOLD MEMBER: รับส่วนลด 10% สำหรับสินค้าที่เข้าร่วมรายการ...</p>
        <p><strong>การเปลี่ยนสถานะสมาชิกจาก SILVER สู่ GOLD ใช้คะแนนสะสม 150 คะแนนในการเปลี่ยนสถานะสมาชิก</strong></p>

        {/* Steps for upgrading membership */}
        <h4>วิธีการเปลี่ยนสถานะสมาชิก</h4>
        <p>บนแอพพลิเคชั่น: กดเลือกหัวข้อ ME > ข้อมูลผู้ใช้ > UPRADE สถานะเพื่อเปลี่ยนเป็น GOLD MEMBERSHIP</p>
        <p>บนเว็บไซต์: กดเลือกหัวข้อ MY ACCOUNT > ข้อมูลผู้ใช้ > UPRADE สถานะเพื่อเปลี่ยนเป็น GOLD MEMBERSHIP</p>

        <h3>การต่ออายุสมาชิก GOLD</h3>
        <p>ใช้คะแนนสะสม 100 คะแนนเพื่อการต่ออายุสมาชิก</p>

        <p>หากมีข้อสงสัยเกี่ยวกับการสมัครสมาชิก สามารถติดต่อเบอร์ Hotline: 02-114-7423</p>
      </div>

      {/* English Version */}
      <div className="english-version">
        <h2>SILVER MEMBERSHIP</h2>
        <p>For the new customers, your account will be SILVER MEMBERSHIP after registration through Carnival website or application. With this level, you can collect and earn points on your first purchase.</p>
        <p><strong>Every 100 THB spent on Carnival will earn 1 point</strong></p>

        <h2>GOLD MEMBERSHIP</h2>
        <p>Privileges for GOLD MEMBERSHIP: Get 10% discount for any purchasing...</p>
        <p><strong>To upgrade, use 150 points to become GOLD MEMBER</strong></p>

        {/* Steps for upgrading membership */}
        <h4>How to UPGRADE MEMBERSHIP from SILVER to GOLD</h4>
        <p>On the app: Select “Me” > Account Information > Upgrade</p>
        <p>On the website: Select “My Account” > Account Information > Upgrade</p>

        <h3>How to Renewal GOLD MEMBERSHIP</h3>
        <p>Use 100 points to renew GOLD MEMBERSHIP.</p>

        <p>If you have any questions, please contact our Call Center: 02-114-7423</p>
      </div>
    </div>
  );
}

export default Membership;
