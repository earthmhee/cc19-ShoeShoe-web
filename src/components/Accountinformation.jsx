import React, { useState } from 'react';

const AccountInformation = () => {

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    birthDay: '',
    birthMonth: '',
    birthYear: '',
    email: '',
    phone: '',
    newsletters: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Form submitted:', formData);
  };

  return (
    <div className="w-full px-4 sm:px-6 md:max-w-4xl mx-auto">
      <div className="border-b border-gray-300 pb-2 mb-4 sm:mb-6">
        <h1 className="text-lg sm:text-xl font-bold text-gray-800">MY ACCOUNT INFORMATION</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-4 sm:gap-y-6">
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block mb-1 sm:mb-2 text-xs sm:text-sm font-medium text-gray-700">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-sm"
              required
            />
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block mb-1 sm:mb-2 text-xs sm:text-sm font-medium text-gray-700">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-sm"
              required
            />
          </div>

          {/* Gender */}
          <div>
            <label htmlFor="gender" className="block mb-1 sm:mb-2 text-xs sm:text-sm font-medium text-gray-700">
              Gender
            </label>
            <div className="relative">
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded appearance-none focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-sm"
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="not_specified">Not Specified</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Birthday */}
          <div>
            <label htmlFor="birthDay" className="block mb-1 sm:mb-2 text-xs sm:text-sm font-medium text-gray-700">
              Birthday <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-1 sm:gap-2">
              {/* Day */}
              <div className="relative">
                <select
                  id="birthDay"
                  name="birthDay"
                  value={formData.birthDay}
                  onChange={handleChange}
                  className="w-full p-1 sm:p-2 border border-gray-300 rounded appearance-none focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-xs sm:text-sm"
                  required
                >
                  <option value="">DD</option>
                  {[...Array(31)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {(i + 1).toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-1 sm:px-2 pointer-events-none">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
              
              {/* Month */}
              <div className="relative">
                <select
                  id="birthMonth"
                  name="birthMonth"
                  value={formData.birthMonth}
                  onChange={handleChange}
                  className="w-full p-1 sm:p-2 border border-gray-300 rounded appearance-none focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-xs sm:text-sm"
                  required
                >
                  <option value="">MM</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {(i + 1).toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-1 sm:px-2 pointer-events-none">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
              
              {/* Year */}
              <div className="relative">
                <select
                  id="birthYear"
                  name="birthYear"
                  value={formData.birthYear}
                  onChange={handleChange}
                  className="w-full p-1 sm:p-2 border border-gray-300 rounded appearance-none focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-xs sm:text-sm"
                  required
                >
                  <option value="">YYYY</option>
                  {[...Array(100)].map((_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-1 sm:px-2 pointer-events-none">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block mb-1 sm:mb-2 text-xs sm:text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-sm"
              required
            />
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phone" className="block mb-1 sm:mb-2 text-xs sm:text-sm font-medium text-gray-700">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 bg-gray-100 border border-gray-300 rounded focus:outline-none text-sm"
            />
          </div>
        </div>

        {/* Change Password Link */}
        <div className="mt-6 sm:mt-8">
          <a href="#" className="text-sm text-teal-500 hover:text-teal-700 font-medium">
            CHANGE PASSWORD
          </a>
        </div>

        {/* Newsletter Checkbox */}
        <div className="mt-4 sm:mt-6 flex items-center">
          <input
            type="checkbox"
            id="newsletters"
            name="newsletters"
            checked={formData.newsletters}
            onChange={handleChange}
            className="h-4 w-4 text-teal-600 border-gray-300 rounded"
          />
          <label htmlFor="newsletters" className="ml-2 text-xs sm:text-sm text-gray-700">
            Newsletters
          </label>
        </div>

        {/* Save Button */}
        <div className="mt-6 sm:mt-8">
          <button
            type="submit"
            className="px-8 sm:px-12 py-2 sm:py-3 bg-black text-white text-sm font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            SAVE
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountInformation;