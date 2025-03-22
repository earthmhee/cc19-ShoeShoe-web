import React, { useEffect, useState } from "react";
import { getAllProduct } from "../api/product";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router";
import {
  CloseIcon,
  DownArrowIcon,
  MenuIcon,
  SearchIcon,
  ShoeshoeLogo,
  ShoppingCartIcon,
  UpArrowIcon,
  UserIcon,
} from "../icons";
import UserProfileForSideBar from "./UserProfileForSideBar";
import useUserStore from "../stores/userStore";
import UserProfileForNavBar from "./UserProfileForNavBar";
import CartIcon from "./CartIcon";
import { Hand } from "lucide-react";
import AIChatModal from "./aigemini/AIRecommend";

function ResponsiveNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState("TH");
  const [expandedMenus, setExpandedMenus] = useState({});
  const [expandedTopMenus, setExpandedTopMenus] = useState({});
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [products, setProducts] = useState([]);
  const [isHovered, setIsHovered] = useState(null);
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navigate = useNavigate();

  // Parse the image string into an array
  const parseImages = (imagesString) => {
    try {
      if (typeof imagesString === "string") {
        return JSON.parse(imagesString);
      }
      return imagesString || [];
    } catch (error) {
      // Fallback if the string isn't valid JSON
      return (
        imagesString
          ?.replace(/^\[|\]$/g, "")
          .split(",")
          .map((url) => url.replace(/^"|"$/g, "")) || []
      );
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProduct();
        setProducts(response.data.data || []);
        console.log(response.data.data);
      } catch (error) {
        console.log("Error fetching products:", error);
        setProducts([]); // Fallback to empty array on error
      }
    };

    fetchProducts();
  }, []);

  const toggleSubmenu = (menuId) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  const toggleTopSubmenu = (menuId) => {
    setExpandedTopMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  // Menu data structure
  const menuItems = [
    {
      id: "new-arrival",
      label: "NEW ARRIVAL",
      hasChildren: false,
      path: "/new-arrival",
    },
    {
      id: "shop",
      label: "SHOP",
      hasChildren: false,
      path: "/products",
    },
    {
      id: "men",
      label: "MEN",
      hasChildren: false,
      path: "/for-men",
    },
    {
      id: "women",
      label: "WOMEN",
      hasChildren: false,
      path: "/for-women",
    },
    { id: "sale", label: "SALE", hasChildren: false, path: "/on-sale" },
  ];

  return (
    <div className="flex flex-col sticky top-0 z-100 ">
      {/* Mobile sticky header - always visible on mobile */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-md z-101 flex justify-between items-center px-4 py-3">
        <div className="flex items-center ">
          <button
            className="mr-3 p-1 text-gray-700"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            {isOpen ? (
              <CloseIcon className="w-5" />
            ) : (
              <MenuIcon className="w-5" />
            )}
          </button>
        </div>
        <div>
          <a href="/home" className="flex items-center">
            <ShoeshoeLogo className="h-7" />
          </a>
        </div>

        <div className="flex items-center space-x-4">
          <button className="text-gray-700">
            <SearchIcon className="w-5 h-5" />
          </button>
          <CartIcon />
        </div>
      </div>

      {/* Top Navbar - only visible on lg screens and above */}
      <div className="hidden lg:block bg-white shadow-md z-100">
        <div className="containerflex items-center gap-10">
          {/* Top navigation */}
          <div className="flex justify-between items-center py-2 px-4 border-b border-gray-200">
            <div className="flex items-center">
              <button className="flex mr-6 px-6 py-3 transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none">
                <div className="flex items-center">
                  <a href="/home">
                    <ShoeshoeLogo />
                  </a>
                </div>
              </button>

              <nav className="flex space-x-6 ">
                {menuItems.map((item) => (
                  <div
                    key={item.id}
                    className="relative group"
                    onClick={() => {
                      handleNavigate(item.path);
                    }}
                  >
                    <div
                      className="py-2 text-sm cursor-pointer flex items-center font-normal hover:scale-105"
                      onMouseEnter={() =>
                        item.hasChildren && toggleTopSubmenu(item.id)
                      }
                      onMouseLeave={() =>
                        item.hasChildren && toggleTopSubmenu(item.id)
                      }
                    >
                      {item.label}
                      {item.hasChildren}
                    </div>

                    {/* Dropdown menu */}
                    {item.hasChildren && expandedTopMenus[item.id] && (
                      <div
                        className="absolute left-0 w-64 bg-white shadow-lg rounded-md border z-100"
                        onMouseEnter={() =>
                          item.hasChildren && toggleTopSubmenu(item.id)
                        }
                        onMouseLeave={() =>
                          item.hasChildren && toggleTopSubmenu(item.id)
                        }
                      >
                        <div className=" inline-flex space-x-8 p-4">
                          {item.children.map((section, idx) => (
                            <div key={idx} className="mb-4">
                              {section.heading && (
                                <h4 className="font-medium text-gray-500 mb-2 text-xs uppercase">
                                  {section.heading}
                                </h4>
                              )}
                              <ul className="space-y-2">
                                {section.items.map((subItem, subIdx) => (
                                  <li
                                    key={subIdx}
                                    className="hover:underline cursor-pointer text-sm"
                                  >
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

            <div className="flex justify-center items-center space-x-4 m-3">
              <button
                className="text-sm font-medium cursor-pointer"
                onClick={() => setLanguage(language === "TH" ? "EN" : "TH")}
              >
                {language}
              </button>
              <AIChatModal />
              <button className="text-gray-700 cursor-pointer">
                <SearchIcon className="w-6 h-6 cursor-pointer" />
              </button>

              {/* User icon and dropdown */}
              <UserProfileForNavBar />

              {/* chart button */}
              <button className="p-2 text-gray-700">
                <CartIcon />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar - visible when isOpen=true on mobile or small screens */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:hidden transition duration-200 ease-in-out z-100 w-74 bg-white shadow-lg overflow-y-auto pt-14`} /* Added pt-14 for header space */
        aria-hidden={!isOpen}
      >
        <div className="flex flex-col h-full">
          {/* Top navigation */}
          <div className="flex border-b border-gray-200">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="flex-1 py-4 text-center text-sm cursor-pointer hover:font-semibold text-md relative before:absolute before:right-0 before:top-[20%] before:h-[60%] before:w-[1px] before:bg-gray-200">
                  Sign in
                </button>
              </SignInButton>

              <SignUpButton mode="modal">
                <button className="flex-1 py-4 text-center text-sm cursor-pointer hover:font-semibold">
                  Register
                </button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <UserProfileForSideBar />
            </SignedIn>
          </div>

          {/* Menu items */}
          <nav className="flex-1 overflow-y-auto mt-4">
            {menuItems.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  handleNavigate(item.path), toggleSidebar();
                }}
              >
                <div className="py-3 px-4 text-sm flex justify-between items-center cursor-pointer hover:font-semibold">
                  <span>{item.label}</span>
                  {item.hasChildren &&
                    (expandedMenus[item.id] ? (
                      <UpArrowIcon className="w-5" />
                    ) : (
                      <DownArrowIcon className="w-5" />
                    ))}
                </div>

                {/* Submenu */}
                {item.hasChildren && expandedMenus[item.id] && (
                  <div className="bg-gray-50 py-2 px-4 text-sm ">
                    {item.children.map((section, idx) => (
                      <div key={idx} className="mb-4">
                        {section.heading && (
                          <h4 className="font-medium text-1xl mb-2 uppercase">
                            {section.heading}
                          </h4>
                        )}
                        <ul className="space-y-2">
                          {section.items.map((subItem, subIdx) => (
                            <li
                              key={subIdx}
                              className=" hover:underline cursor-pointer text-xs"
                            >
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
              onClick={() => setLanguage(language === "TH" ? "EN" : "TH")}
            >
              {language}
            </button>
            <AIChatModal />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResponsiveNavigation;
