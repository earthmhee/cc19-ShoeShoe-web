import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router';

const AccountSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  
  const [isExpanded, setIsExpanded] = useState(true);
  const [dropdownHeight, setDropdownHeight] = useState('auto');

  const menuItems = [
    { id: "dashboard", label: "Account Dashboard", navigate: "" },
    { id: "info", label: "Account Information", navigate: "update" },
    { id: "address", label: "Address Book", navigate: "address" },
    { id: "orders", label: "My Orders", navigate: "orders" },
    { id: "wishlist", label: "My Wish List", navigate: "wishList" },
  ];

  // Get active item based on current path
  const getActiveItem = useCallback(() => {
    const currentPath = location.pathname.split("/").pop();
    return menuItems.find(item => item.navigate === currentPath)?.label || menuItems[0].label;
  }, [location.pathname]);

  const [activeItem, setActiveItem] = useState(getActiveItem());

  useEffect(() => {
    setActiveItem(getActiveItem());
  }, [location, getActiveItem]);

  useEffect(() => {
    if (dropdownRef.current) {
      const height = dropdownRef.current.scrollHeight;
      setDropdownHeight(`${height}px`);
    }
  }, [menuItems]);

  const toggleMenu = () => {
    setIsExpanded(!isExpanded);
  };

  const handleMenuItemClick = (item, path) => {
    setActiveItem(item);
    navigate(path);
  };

  return (
    <nav 
      className="w-full mx-auto md:w-full lg:w-[300px] xl:max-w-[300px] mt-11 p-6"
      aria-label="Account navigation"
    >
      <button
        className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 cursor-pointer border-b"
        onClick={toggleMenu}
        aria-expanded={isExpanded}
        aria-controls="account-menu"
      >
        <h2 className="text-gray-600 font-medium text-sm">MY ACCOUNT</h2>
        <svg
          className={`w-4 h-4 text-gray-600 transform transition-transform duration-300 ease-in-out ${
            isExpanded ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M5 15l7-7 7 7"
          />
        </svg>
      </button>

      <div
        id="account-menu"
        ref={dropdownRef}
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: isExpanded ? dropdownHeight : '0px',
          opacity: isExpanded ? '1' : '0'
        }}
      >
        <div>
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`w-full text-left px-4 py-3 cursor-pointer ${
                activeItem === item.label
                  ? 'bg-gray-200 font-medium'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
              onClick={() => handleMenuItemClick(item.label, item.navigate)}
              aria-current={activeItem === item.label ? "page" : undefined}
            >
              <span 
                className={`text-xs ${
                  activeItem === item.label
                    ? 'text-gray-800'
                    : 'text-gray-500'
                }`}
              >
                {item.label.toUpperCase()}
              </span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default AccountSidebar;