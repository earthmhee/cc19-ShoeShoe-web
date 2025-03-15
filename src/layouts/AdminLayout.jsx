import React, { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { 
  ChevronLeft, 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Users, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin' },
    { icon: <ShoppingBag size={20} />, label: 'Products', path: '/admin/products' },
    { icon: <Package size={20} />, label: 'Orders', path: '/admin/orders' },
    { icon: <Package size={20} />, label: 'Inventory', path: '/admin/inventory' },
    { icon: <Users size={20} />, label: 'Users', path: '/admin/users' },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 lg:hidden z-10"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed lg:static inset-y-0 left-0 z-20 flex flex-col bg-white border-r border-gray-200 
          ${collapsed ? 'w-20' : 'w-64'} 
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          transition-all duration-300`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between p-4 border-b">
          {!collapsed && <h1 className="text-xl font-bold">Admin Panel</h1>}
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 hidden lg:block"
          >
            <ChevronLeft 
              size={20} 
              className={`transition-transform ${collapsed ? 'rotate-180' : ''}`} 
            />
          </button>
          <button 
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg hover:bg-gray-200 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Sidebar links */}
        <div className="flex-1 py-6 overflow-y-auto">
          <nav className="px-2 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors 
                  ${isActive(item.path) 
                    ? 'bg-black text-white' 
                    : 'text-gray-700 hover:bg-gray-100'}`}
              >
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </Link>
            ))}
          </nav>
        </div>
        
        {/* Sidebar footer */}
        <div className="p-4 border-t">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <LogOut size={20} />
            {!collapsed && <span>Back to Website</span>}
          </Link>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setMobileOpen(true)}
              className="p-1.5 rounded-lg hover:bg-gray-100 lg:hidden"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-xl font-semibold ml-2 lg:ml-0">Shoeshoe Admin</h1>
            <div className="flex items-center gap-4">
              {/* Notifications, profile, etc. could go here */}
            </div>
          </div>
        </header>
        
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout