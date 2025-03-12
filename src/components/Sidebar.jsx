import React, { useState } from "react";

function ResponsiveNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState('TH');
  const [expandedMenus, setExpandedMenus] = useState({});
  const [expandedTopMenus, setExpandedTopMenus] = useState({});
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  
  const toggleSubmenu = (menuId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };
  
  const toggleTopSubmenu = (menuId) => {
    setExpandedTopMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };
  
  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };
  
  // Menu data structure
  const menuItems = [
    { id: 'new-arrival', label: 'NEW ARRIVAL', hasChildren: false },
    { 
      id: 'carnival', 
      label: 'CARNIVAL®', 
      hasChildren: true,
      children: [
        { heading: 'Collection', items: [
          'CARNIVAL® x YAMADA',
          'CARNIVAL® x Guns N\' Roses',
          'CARNIVAL® x OVER THE PITCH',
          'UMBRO x CARNIVAL® "FIELD LEGACY"',
          'CARNIVAL® Fall/Winter 2024',
          'CARNIVAL® x Lambretta',
          'CARNIVAL® Home & Away'
        ]},
        { heading: 'Category', items: [
          'T-SHIRT',
          'HOODIE',
          'SWEATER',
          'PANTS',
          'SHORTS',
          'SANDALS',
          'HEADWEAR',
          'ACCESSORIES'
        ]}
      ]
    },
    { 
      id: 'shop', 
      label: 'SHOP', 
      hasChildren: true,
      children: [
        { heading: 'Category', items: [
          'Accessories',
          'Bags',
          'Hats',
          'Jackets',
          'Jeans',
          'Jerseys',
          'Pants',
          'Sneakers',
          'Shirts',
          'Shoe Care',
          'Shorts',
          'Socks',
          'T-Shirts',
          'Hoodies',
          'Magazine',
          'Kids',
          'Sales'
        ]},
        { heading: 'Brands', items: [
          'Carnival',
          'Nike',
          'Adidas',
          'Asics',
          'Converse',
          'New Balance',
          'Tower Box',
          'Crep Protect'
        ]}
      ]
    },
    { 
      id: 'footwear', 
      label: 'FOOTWEAR', 
      hasChildren: true,
      children: [
        { heading: '', items: [
          'View All',
          'Men',
          'Women',
          'Sneakers',
          'Sandals',
          'Sale'
        ]}
      ]
    },
    { 
      id: 'men', 
      label: 'MEN', 
      hasChildren: true,
      children: [
        { heading: '', items: [
          'Carnival',
          'Footwear',
          'Sneakers',
          'Apparel',
          'Accessories',
          'Sale'
        ]}
      ]
    },
    { 
      id: 'women', 
      label: 'WOMEN', 
      hasChildren: true,
      children: [
        { heading: '', items: [
          'View All',
          'Carnival',
          'Footwear',
          'Apparel',
          'Accessories',
          'Sale'
        ]}
      ]
    },
    { id: 'blog', label: 'BLOG', hasChildren: false },
    { id: 'sale', label: 'SALE', hasChildren: false }
  ];
  
  return (
    <div className="flex flex-col h-screen">
      {/* Mobile menu button - only visible below lg breakpoint */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md text-gray-700 bg-white shadow-md"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>
      
      {/* Top Navbar - only visible on lg screens and above */}
      <div className="hidden lg:block bg-white shadow-md z-30">
        <div className="container mx-auto">
          {/* Top navigation */}
          <div className="flex justify-between items-center py-2 px-4 border-b border-gray-200">
            <div className="flex items-center">
              <h1 className="text-xl font-bold mr-8">CARNIVAL®</h1>
              <nav className="flex space-x-6">
                {menuItems.map((item) => (
                  <div key={item.id} className="relative group">
                    <div 
                      className="py-2 font-medium text-sm cursor-pointer flex items-center"
                      onClick={() => item.hasChildren && toggleTopSubmenu(item.id)}
                    >
                      {item.label}
                      {item.hasChildren && (
                        <svg 
                          className="w-4 h-4 ml-1" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </div>
                    
                    {/* Dropdown menu */}
                    {item.hasChildren && expandedTopMenus[item.id] && (
                      <div className="absolute left-0 mt-1 w-64 bg-white shadow-lg rounded-md z-50">
                        <div className="p-4">
                          {item.children.map((section, idx) => (
                            <div key={idx} className="mb-4">
                              {section.heading && (
                                <h4 className="font-medium text-gray-500 mb-2 text-xs uppercase">{section.heading}</h4>
                              )}
                              <ul className="space-y-2">
                                {section.items.map((subItem, subIdx) => (
                                  <li key={subIdx} className="hover:text-red-600 cursor-pointer text-sm">
                                    {subItem}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="text-sm font-medium" onClick={() => setLanguage(language === 'TH' ? 'EN' : 'TH')}>
                {language}
              </button>
              <button className="p-2 text-gray-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              
              {/* User menu with dropdown */}
              <div className="relative">
                <button 
                  className="p-2 text-gray-700 relative"
                  onClick={toggleUserMenu}
                  aria-expanded={showUserMenu}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
                
                {/* User dropdown menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 py-1">
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      เข้าสู่ระบบ
                    </button>
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      สมัครสมาชิก
                    </button>
                  </div>
                )}
              </div>
              
              <button className="p-2 text-gray-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sidebar - visible when isOpen=true on mobile or small screens */}
      <div 
        className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:hidden transition duration-200 ease-in-out z-30 w-64 bg-white shadow-lg overflow-y-auto`}
        aria-hidden={!isOpen}
      >
        <div className="flex flex-col h-full">
          {/* Top navigation */}
          <div className="flex border-b border-gray-200">
            <button className="flex-1 py-4 text-center text-sm font-medium border-r border-gray-200">
              เข้าสู่ระบบ
            </button>
            <button className="flex-1 py-4 text-center text-sm font-medium">
              สมัครสมาชิก
            </button>
          </div>
          
          {/* Menu items */}
          <nav className="flex-1 overflow-y-auto">
            {menuItems.map((item) => (
              <div key={item.id} className="border-b border-gray-200">
                <div 
                  className="py-3 px-4 font-bold text-sm flex justify-between items-center cursor-pointer"
                  onClick={() => item.hasChildren && toggleSubmenu(item.id)}
                >
                  {item.label}
                  {item.hasChildren && (
                    <svg 
                      className={`w-4 h-4 transition-transform ${expandedMenus[item.id] ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </div>
                
                {/* Submenu */}
                {item.hasChildren && expandedMenus[item.id] && (
                  <div className="bg-gray-50 py-2 px-4 text-sm">
                    {item.children.map((section, idx) => (
                      <div key={idx} className="mb-4">
                        {section.heading && (
                          <h4 className="font-medium text-gray-500 mb-2 text-xs uppercase">{section.heading}</h4>
                        )}
                        <ul className="space-y-2">
                          {section.items.map((subItem, subIdx) => (
                            <li key={subIdx} className="hover:text-red-600 cursor-pointer">
                              {subItem}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
          
          {/* Language selector */}
          <div className="py-3 px-4 border-t border-gray-200 flex justify-between items-center">
            <span className="text-sm font-medium">LANGUAGE</span>
            <button 
              className="text-sm font-medium"
              onClick={() => setLanguage(language === 'TH' ? 'EN' : 'TH')}
            >
              {language}
            </button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className={`flex-1 bg-gray-100 transition-all duration-200 ${isOpen ? 'lg:ml-0' : 'ml-0'} lg:pt-0 pt-16`}>
        <div className="max-w-7xl mx-auto p-4">
          {/* Content */}
          <div className="mt-8">
            <h1 className="text-2xl font-bold mb-2">NEW COLLECTION</h1>
            <h2 className="text-3xl font-bold mb-8">NEW ARRIVAL</h2>
            
            {/* Product grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Product 1 */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="h-64 bg-blue-500 relative">
                  <img 
                    src="https://placehold.co/600x400/3b82f6/FFFFFF?text=Nike+Blue" 
                    alt="Nike Blue" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold">NIKE FIELD GENERAL</h3>
                  <p className="text-gray-600 mt-1">ราคาเริ่มต้น ฿3,700.00</p>
                </div>
              </div>
              
              {/* Product 2 */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="h-64 bg-red-500 relative">
                  <img 
                    src="https://placehold.co/600x400/ef4444/FFFFFF?text=Nike+Red" 
                    alt="Nike Red" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold">NIKE DUNK LOW RETRO</h3>
                  <p className="text-gray-600 mt-1">ราคาเริ่มต้น ฿3,700.00</p>
                </div>
              </div>
              
              {/* Product 3 */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="h-64 bg-gray-200 relative">
                  <img 
                    src="https://placehold.co/600x400/e5e7eb/000000?text=Nike+White" 
                    alt="Nike White" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold">NIKE FIELD GENERAL LTR 2</h3>
                  <p className="text-gray-600 mt-1">ราคาเริ่มต้น ฿3,700.00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={toggleSidebar}
          aria-hidden="true"
        ></div>
      )}
    </div>
  );
}

export default ResponsiveNavigation;