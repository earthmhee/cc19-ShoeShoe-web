import React, { useState } from "react";
import { Link } from "react-router";
import { SearchIcon, ShoeshoeLogo, ShoppingCartIcon, UserIcon } from "../icons";

function Navbar() {
  const [openSearch, setOpenSearch] = useState(false);
  const [openUser, setOpenUser] = useState(false);

  return (
    <nav className="flex items-center justify-between px-5 p-2 w-full shadow-lg fixed top-0 z-10 bg-white">
      <div className="flex items-center gap-10">

        <button className="px-6 py-3 transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none">
          <Link to="/" className="flex items-center">
            <ShoeshoeLogo  />
          </Link>
        </button>

        <div className="flex text-sm items-center gap-5">
          <Link to="/" className="relative overflow-hidden group hover:text-gray-600 transition">
            NEW ARRIVAL
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-gray-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>

          <Link to="/" className="relative overflow-hidden group hover:text-gray-600 transition">
            SHOP
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-gray-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>

          <Link to="/" className="relative overflow-hidden group hover:text-gray-600 transition">
            MEN
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-gray-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>

          <Link to="/" className="relative overflow-hidden group hover:text-gray-600 transition">
            WOMEN
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-gray-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>

          <Link to="/" className="relative overflow-hidden group hover:text-gray-600 transition ">
            SALE
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-gray-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </div>

      </div>

      <div className="flex items-center">
        <div className="flex items-center gap-5 mr-7">
          {/* Search Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setOpenSearch(!openSearch);
                setOpenUser(false);
              }}
              className="w-7 p-0 overflow-hidden"
            >
              <SearchIcon className="transform transition duration-300 hover:rotate-6" />

            </button>
            {openSearch && (
              <ul
                tabIndex={0}
                className="absolute mt-5 right-0 dropdown-content border bg-base-100 rounded-btn z-10 w-[380px] p-2 shadow-xs"
              >
                <label className="flex items-center w-full rounded-md px-3 ">
                  <SearchIcon className="absolute left-2 w-5 text-gray-600 " />
                  <input
                    type="text"
                    placeholder="WHAT ARE YOU LOOKING FOR?"
                    className=" pl-8 pr-2 py-2 w-full text-xs text-black outline-hidden placeholder-gray-500 border-b border-gray-600"
                  />
                </label>
              </ul>
            )}
          </div>

          {/* User Dropdown */}
          <div className="dropdown dropdown-center">
            <button
              onClick={() => { setOpenUser(!openUser); setOpenSearch(false); }}
              className="w-6 p-0 overflow-hidden"
            >
              <UserIcon className="transform transition duration-300 hover:rotate-6" />
            </button>
            {openUser && (
              <ul
                tabIndex={0}
                className="absolute border right-0 mt-5 dropdown-content menu bg-base-100 rounded-btn z-10 w-40 p-2 shadow-xs"
              >
                <li>
                  <Link to="/profile">MY ACCOUNT</Link>
                </li>
                <li>
                  <Link to="/">MY ORDER</Link>
                </li>
              </ul>
            )}
          </div>

          {/* Cart Button */}
          <button>
            <Link to="/" className="flex items-center">
              <ShoppingCartIcon className="w-6 mb-1 transform transition duration-300 hover:rotate-6" />
            </Link>
          </button>


        </div>
      </div>
    </nav>
  );
}

export default Navbar;
