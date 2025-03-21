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
        <h2 className="text-2xl ">Privacy and Cookie Policy</h2>
        <br />

        <p className="mb-5">
          Thank you for choosing to be part of our community at SHOESHOE ("shoeshoebkk", "we", "us", "our").
          We are committed to protecting your personal information and your right to privacy.
          If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information,
          please contact us at support@shoeshoebkk.com
          <a href="mailto:support@shoeshoebkk.com" className="text-blue-500"> support@shoeshoebkk.com</a>
        </p>
        <p>
          This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from www.shoeshoebkk.com (the “Site”).
          This privacy notice applies to all information collected through our Services (which, as described above, includes our Website), as well as, any related services, sales, marketing or events.
        </p>

        <h3 className='text-lg font-semibold mt-5'>PERSONAL INFORMATION WE COLLECT</h3>
        <p className="mb-5">
          When you visit the Site, we automatically collect certain information about your device,
          including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device.
          Additionally, as you browse the Site, we collect information about the individual web pages or products that you view,
          what websites or search terms referred you to the Site, and information about how you interact with the Site.
          We refer to this automatically-collected information as “Device Information.”
        </p>

        <p className="mb-2">We collect Device Information using the following technologies:</p>
        <ul className='list-disc ml-6'>
          <li>“Cookies” are data files that are placed on your device or computer and often include an anonymous unique identifier. For more information about cookies, and how to disable cookies, visit http://www.allaboutcookies.org.</li>
          <li> “Log files” track actions occurring on the Site, and collect data including your IP address, browser type, Internet service provider, referring/exit pages, and date/time stamps.</li>
          <li> “Web beacons,” “tags,” and “pixels” are electronic files used to record information about how you browse the Site.</li>
        </ul>

        <p className="mt-5">
          when you make a purchase or attempt to make a purchase through the Site, we collect certain information from you, including your name, billing address, shipping address, email address, and phone number. We refer to this information as “Order Information.”
        </p>

        <p className="mt-5">
          “Payment Data” We may collect data necessary to process your payment if you make purchases, such as your payment instrument number (such as a credit card number), and the security code associated with your payment instrument. All payment data is stored by kbank and 2c2p.
        </p>

        <p className="mt-5">
          “Social Media Login Data” We may provide you with the option to register with us using your existing social media account details, like your Facebook, AppleID or other social media account. If you choose to register in this way, we will collect the Information described in the section called "HOW DO WE HANDLE YOUR SOCIAL LOGINS" below.
        </p>

        <p className="mb-5">All personal information that you provide to us must be true, complete and accurate, and you must notify us of any changes to such personal information.</p>
        <p className="mb-5">When we talk about “Personal Information” in this Privacy Policy, we are talking about Device Information, Order Information, Payment data and Social Media Login Data.</p>
        <p className="mb-5">All personal information that you provide to us must be true, complete and accurate, and you must notify us of any changes to such personal information.</p>

        <h3 className='text-lg font-semibold mt-4'>HOW DO WE USE YOUR PERSONAL INFORMATION?</h3>
        <p className="mb-5">
          We use the Order Information that we collect generally to fulfill any orders placed through the Site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations). Additionally, we use this Order Information to:
        </p>

        <p className="mb-5">Communicate with you;</p>
        <p className="mb-5">Screen our orders for potential risk or fraud; and</p>
        <p className="mb-5">When in line with the preferences you have shared with us, provide you with information or advertising relating to our products or services.</p>
        <p className="mb-5">We use the Device Information that we collect to help us screen for potential risk and fraud (in particular, your IP address), and more generally to improve and optimize our Site (for example, by generating analytics about how our customers browse and interact with the Site, and to assess the success of our marketing and advertising campaigns).</p>

        <h3 className='text-lg font-semibold mt-4'>HOW DO WE HANDLE YOUR SOCIAL LOGINS?</h3>
        <p className="mb-5">Our offers you the ability to register and login using your third-party social media account details (like your Facebook or AppleID logins). Where you choose to do this, we will receive certain profile information about you from your social media provider. The profile Information we receive may vary depending on the social media provider concerned, but will often include your name, email address, friends list, profile picture as well as other information you choose to make public on such social media platform.</p>
        <p className="mb-5">We will use the information we receive only for the purposes that are described in this privacy notice or that are otherwise made clear to you on the relevant Website. Please note that we do not control, and are not responsible for, other uses of your personal information by your third-party social media provider. We recommend that you review their privacy notice to understand how they collect, use and share your personal information, and how you can set your privacy preferences on their sites and apps.</p>

        <h3 className='text-lg font-semibold mt-4'>SHARING YOUR PERSONAL INFORMATION</h3>
        <p className="mb-5">We share your Personal Information with third parties to help us use your Personal Information, as described above. We also use Google Analytics to help us understand how our customers use the Site--you can read more about how Google uses your Personal Information here: https://www.google.com/intl/en/policies/privacy/. You can also opt-out of Google Analytics here: https://tools.google.com/dlpage/gaoptout.</p>
        <p className="mb-5">Finally, we may also share your Personal Information to comply with applicable laws and regulations, to respond to a subpoena, search warrant or other lawful request for information we receive, or to otherwise protect our rights.</p>

        <h3 className='text-lg font-semibold mt-4'>BEHAVIOURAL ADVERTISING</h3>
        <p>As described above, we use your Personal Information to provide you with targeted advertisements or marketing communications we believe may be of interest to you. For more information about how targeted advertising works, you can visit the Network Advertising Initiative’s (“NAI”) educational</p>
        <p>page at http://www.networkadvertising.org/understanding-online-advertising/how-does-it-work.</p>
        <p>FACEBOOK - https://www.facebook.com/settings/?tab=ads</p>
        <p>GOOGLE - https://www.google.com/settings/ads/anonymous</p>

        <h3 className='text-lg font-semibold mt-4'>DO NOT TRACK</h3>
        <p className="mb-5">Please note that we do not alter our Site’s data collection and use practices when we see a Do Not Track signal from your browser.</p>

        <h3 className='text-lg font-semibold mt-4'>DATA RETENTION</h3>
        <p className="mb-5">When you place an order through the Site, we will maintain your Order Information for our records unless and until you ask us to delete this information.</p>

        <h3 className='text-lg font-semibold mt-4'>MINORS</h3>
        <p className="mb-5">The Site is not intended for individuals under the age of 13.</p>

        <h3 className='text-lg font-semibold mt-4'>CHANGES</h3>
        <p className="mb-5">We may update this privacy policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal or regulatory reasons.</p>

        <h3 className='text-lg font-semibold mt-4'>CONTACT US</h3>
        <p className="mb-5">For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e-mail at support@shoeshoebkk.com</p>

        <h3 className='text-lg font-semibold mt-4'>ACCOUNT MANAGEMENT</h3>
        <p className="mb-5">To delete your account Please contact admin via inbox fan page Carnival Store (*After deletion, you will not be able to use your account.) After our admin receive your request, all of your personal data will be deleted within 7-14 working days.</p>

      </div>
    </div>
  );
};

export default PrivacyPolicy;
