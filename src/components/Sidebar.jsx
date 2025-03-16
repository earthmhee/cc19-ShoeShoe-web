import React, { useEffect, useState } from "react";
import { getAllProduct } from "../api/product";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  SignUpButton,
  UserButton,
  UserProfile,
} from "@clerk/clerk-react";
import { Link } from "react-router";
import { CloseIcon, MenuIcon, SearchIcon, ShoeshoeLogo, ShoppingCartIcon, UserIcon } from "../icons";

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
        console.log(response.data.products);
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

  // Menu data structure
  const menuItems = [
    { id: "new-arrival", label: "NEW ARRIVAL", hasChildren: false },
    {
      id: "shop",
      label: "SHOP",
      hasChildren: true,
      children: [
        {
          heading: "Category",
          items: [
            "Accessories",
            "Bags",
            "Hats",
            "Jackets",
            "Jeans",
            "Jerseys",
            "Pants",
            "Sneakers",
            "Shirts",
            "Shoe Care",
            "Shorts",
            "Socks",
            "T-Shirts",
            "Hoodies",
            "Magazine",
            "Kids",
            "Sales",
          ],
        },
        {
          heading: "Brands",
          items: [
            "Carnival",
            "Nike",
            "Adidas",
            "Asics",
            "Converse",
            "New Balance",
            "Tower Box",
            "Crep Protect",
          ],
        },
      ],
    },
    {
      id: "footwear",
      label: "FOOTWEAR",
      hasChildren: true,
      children: [
        {
          heading: "",
          items: ["View All", "Men", "Women", "Sneakers", "Sandals", "Sale"],
        },
      ],
    },
    {
      id: "men",
      label: "MEN",
      hasChildren: true,
      children: [
        {
          heading: "",
          items: [
            "Carnival",
            "Footwear",
            "Sneakers",
            "Apparel",
            "Accessories",
            "Sale",
          ],
        },
      ],
    },
    {
      id: "women",
      label: "WOMEN",
      hasChildren: true,
      children: [
        {
          heading: "",
          items: [
            "View All",
            "Carnival",
            "Footwear",
            "Apparel",
            "Accessories",
            "Sale",
          ],
        },
      ],
    },
    { id: "sale", label: "SALE", hasChildren: false },
  ];

  return (
    <div className="flex flex-col ">


      {/* Top Navbar - only visible on lg screens and above */}
      <div className=" bg-white shadow-md z-30">

        <div className="containerflex items-center gap-10">
          {/* Top navigation */}
          <div className="flex justify-between items-center py-2 px-4 border-b border-gray-200">

            <div className="flex items-center">

              {/* Mobile menu button - only visible below lg breakpoint */}
              <button
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md text-gray-700 bg-white shadow-md"
                onClick={toggleSidebar}
                aria-label="Toggle sidebar"
              >
                {isOpen ? <CloseIcon className="w-6" /> : <MenuIcon className="w-6" />}
              </button>

              <button className="flex mr-6 px-6 py-3 transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none">
                <Link to="/" className="flex items-center">
                  <a><ShoeshoeLogo /></a>
                </Link>
              </button>



              <nav className="hidden lg:flex space-x-3 ">
                {menuItems.map((item) => (
                  <div key={item.id} className="relative group">
                    <div
                      className="py-2 font-medium text-sm cursor-pointer flex items-center"
                      onClick={() =>
                        item.hasChildren && toggleTopSubmenu(item.id)
                      }
                    >
                      {item.label}
                      {item.hasChildren}
                    </div>

                    {/* Dropdown menu */}
                    {item.hasChildren && expandedTopMenus[item.id] && (
                      <div className="absolute left-0 mt-1 w-64 bg-white shadow-lg rounded-md z-50 ">
                        <div className="p-4">
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
                                    className="hover:text-red-600 cursor-pointer text-sm"
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

              <button className="text-gray-700 cursor-pointer">
                <SearchIcon className="w-6 h-6 cursor-pointer" />
              </button>

              {/* User menu with dropdown */}
              <div className="dropdown relative flex items-center justify-center  ">
                <SignedOut>
                  <button
                    className="text-gray-700"
                    onClick={toggleUserMenu}
                    aria-expanded={showUserMenu}
                  >
                    <UserIcon className="w-5 cursor-pointer" />
                  </button>
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>

                {/* User dropdown menu */}
                {showUserMenu &&(
                  <div className="dropdown-content menu absolute right-0 mt-30 w-52 bg-white rounded-box shadow-lg z-10 py-1 border duration-300">
                    <SignedOut>
                      <SignInButton mode="modal">
                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          เข้าสู่ระบบ
                        </button>
                      </SignInButton>

                      <SignUpButton mode="modal">
                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          สมัครสมาชิก
                        </button>
                      </SignUpButton>
                    </SignedOut>
                    <SignedIn>
                      <SignOutButton>
                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          logout
                        </button>
                      </SignOutButton>
                    </SignedIn>
                  </div>
                )}
              </div>

              <button className="text-gray-700">
                <ShoppingCartIcon className="w-5 cursor-pointer transform transition duration-300 hover:rotate-6" />
              </button>
            </div>


          </div>
        </div>
      </div>



      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 transition-opacity duration-300 z-20"
          onClick={toggleSidebar}
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
        ></div>
      )}

    </div>
  );
}

export default ResponsiveNavigation;
