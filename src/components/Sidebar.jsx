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
<<<<<<< HEAD
import AIRecommend from "../components/aigemini/AIRecommend";
=======
import { Hand } from "lucide-react";
>>>>>>> dev

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

<<<<<<< HEAD
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

=======
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

>>>>>>> dev
  const toggleTopSubmenu = (menuId) => {
    setExpandedTopMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

<<<<<<< HEAD
  // Menu data structure
  const menuItems = [
    { id: "new-arrival", label: "NEW ARRIVAL", hasChildren: false },
    {
      id: "carnival",
      label: "CARNIVAL®",
      hasChildren: true,
      children: [
        {
          heading: "Collection",
          items: [
            "CARNIVAL® x YAMADA",
            "CARNIVAL® x Guns N' Roses",
            "CARNIVAL® x OVER THE PITCH",
            'UMBRO x CARNIVAL® "FIELD LEGACY"',
            "CARNIVAL® Fall/Winter 2024",
            "CARNIVAL® x Lambretta",
            "CARNIVAL® Home & Away",
          ],
        },
        {
          heading: "Category",
          items: [
            "T-SHIRT",
            "HOODIE",
            "SWEATER",
            "PANTS",
            "SHORTS",
            "SANDALS",
            "HEADWEAR",
            "ACCESSORIES",
          ],
        },
      ],
    },
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
    { id: "blog", label: "BLOG", hasChildren: false },
    { id: "sale", label: "SALE", hasChildren: false },
  ];

  return (
    <div className="flex flex-col ">
      {/* Mobile menu button - only visible below lg breakpoint */}
      <button
        className={`lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md text-gray-700 bg-white shadow-md ${
          isOpen ? "translate-x-62" : "-translate-x-0"
        } transition duration-200 ease-in-out`}
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        {isOpen ? (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>

      {/* Top Navbar - only visible on lg screens and above */}
      <div className="hidden lg:block bg-white shadow-md z-30">
        <div className="containerflex items-center gap-10">
          {/* Top navigation */}
          <div className="flex justify-between items-center py-2 px-4 border-b border-gray-200">
            <div className="flex items-center">
              <button className="flex mr-6 px-6 py-3 transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none">
                <Link
                  to="/"
                  className="inline-flex w-[184px] items-center mr-6 px-6 py-3 transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none"
                >
                  <ShoeshoeLogo />
                </Link>
              </button>

              <nav className="flex space-x-6">
                {menuItems.map((item) => (
                  <div key={item.id} className="relative group">
                    <div
                      className="py-2 font-medium text-sm cursor-pointer flex items-center"
                      onClick={() =>
                        item.hasChildren && toggleTopSubmenu(item.id)
                      }
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
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
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

            {/* Lang button */}
            <div className="flex items-center space-x-4">
              <button
                className="text-sm font-medium"
                onClick={() => setLanguage(language === "TH" ? "EN" : "TH")}
              >
                {language}
              </button>
              <AIRecommend /> 
              {/* search button **to be change, when click have to display as Search box */}
              <button className="p-2 text-gray-700">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>

              {/* User icon and dropdown */}
              <UserProfileForNavBar />
=======
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
						{isOpen ? <CloseIcon className="w-5" /> : <MenuIcon className="w-5" />}
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
										onClick={() => { handleNavigate(item.path) }}
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

							<button className="text-gray-700 cursor-pointer">
								<SearchIcon className="w-6 h-6 cursor-pointer" />
							</button>
>>>>>>> dev

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
        } lg:hidden transition duration-200 ease-in-out z-30 w-64 bg-white shadow-lg overflow-y-auto`}
        aria-hidden={!isOpen}
      >
        <div className="flex flex-col h-full">
          {/* Top navigation */}
          <div className="flex border-b border-gray-200">
            <SignedOut>
              <SignInButton
                mode="modal"
                appearance={{
                  elements: {
                    footer: { display: "none" },
                  },
                }}
              >
                <button className="  w-full h-full rounded-none shadow-none bg-black text-white flex-1 py-4 text-center text-md  font-medium border-r border-r-white hover:cursor-pointer hover:bg-gray-900">
                  Sign in
                </button>
              </SignInButton>

<<<<<<< HEAD
              <SignUpButton
                mode="modal"
                appearance={{
                  elements: {
                    footer: { display: "none" },
                  },
                }}
              >
                <button className=" w-full h-full rounded-none shadow-none bg-black text-white flex-1 py-4 border-l border-l-white text-center text-md  font-medium hover:cursor-pointer hover:bg-gray-900">
                  Register
                </button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <UserProfileForSideBar />
            </SignedIn>
          </div>
=======
			{/* Sidebar - visible when isOpen=true on mobile or small screens */}
			<div
				className={`fixed inset-y-0 left-0 transform ${
					isOpen ? "translate-x-0" : "-translate-x-full"
				} lg:hidden transition duration-200 ease-in-out z-100 w-74 bg-white shadow-lg overflow-y-auto pt-14`}  /* Added pt-14 for header space */
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
>>>>>>> dev

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
                      className={`w-4 h-4 transition-transform ${
                        expandedMenus[item.id] ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}
                </div>

<<<<<<< HEAD
                {/* Submenu */}
                {item.hasChildren && expandedMenus[item.id] && (
                  <div className="bg-gray-50 py-2 px-4 text-sm">
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
                              className="hover:text-red-600 cursor-pointer"
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
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/[70%] bg-opacity-50 z-20"
          onClick={toggleSidebar}
          aria-hidden="true"
        ></div>
      )}
    </div>
=======
					{/* Menu items */}
					<nav className="flex-1 overflow-y-auto mt-4">
						{menuItems.map((item) => (
							<div key={item.id} onClick={() =>{ handleNavigate(item.path), toggleSidebar()}}>
								<div
									className="py-3 px-4 text-sm flex justify-between items-center cursor-pointer hover:font-semibold"
								>
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
					</div>
				</div>
			</div>
		</div>
>>>>>>> dev
  );
}

export default ResponsiveNavigation;