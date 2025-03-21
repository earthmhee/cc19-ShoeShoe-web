import React, { useState, useRef, useEffect } from 'react';

const AccountSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const [activeItem, setActiveItem] = useState('Account Dashboard');

  const dropdownRef = useRef(null);
  const [dropdownHeight, setDropdownHeight] = useState('auto');

  const menuItems = [
    { id: 'dashboard', label: 'Account Dashboard' },
    { id: 'info', label: 'Account Information' },
    { id: 'address', label: 'Address Book' },
    { id: 'orders', label: 'My Orders' },
    { id: 'wishlist', label: 'My Wish List' }
  ];

  useEffect(() => {
    if (dropdownRef.current) {
      const height = dropdownRef.current.scrollHeight;
      setDropdownHeight(`${height}px`);
    }
  }, [menuItems]);

  const toggleMenu = () => {
    setIsExpanded(!isExpanded);
  };


  const handleMenuItemClick = (item) => {
    setActiveItem(item);
    //  add navigation logic here
  };

  return (
<div className="w-full mx-auto md:max-w-lg lg:max-w-md xl:max-w-lg mt-11 p-6">


        <div
          className="flex justify-between items-center px-4 py-3 bg-gray-100 cursor-pointer border-b"
          onClick={toggleMenu}
        >
          <h2 className="text-gray-600 font-medium text-sm">MY ACCOUNT</h2>
          <svg
            className={`w-4 h-4 text-gray-600 transform transition-transform duration-300 ease-in-out ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
          </svg>
        </div>


        <div
          ref={dropdownRef}
          className="overflow-hidden transition-all duration-300 ease-in-out "
          style={{
            maxHeight: isExpanded ? dropdownHeight : '0px',
            opacity: isExpanded ? '1' : '0'
          }}
        >
          <div>
            {menuItems.map((item) => (
              <div
                key={item.id}
                className={`px-4 py-3 cursor-pointer ${activeItem === item.label
                    ? 'bg-gray-200 font-medium'
                    : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                onClick={() => handleMenuItemClick(item.label)}
              >
                <span className={`text-xs ${activeItem === item.label
                    ? 'text-gray-800'
                    : 'text-gray-500'
                  }`}>
                  {item.label.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
  );
};

export default AccountSidebar;
