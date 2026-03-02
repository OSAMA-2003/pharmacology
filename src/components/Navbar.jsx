import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { ChevronDown } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  // Active style matching the blue pill in the image
  const navLinkStyle = ({ isActive }) =>
    isActive
      ? "bg-[#3a5b8c] text-white px-5 py-1.5 rounded-xl transition-colors font-medium text-sm md:text-base"
      : "text-gray-800 hover:text-[#3a5b8c] px-3 py-1.5 transition-colors font-medium text-sm md:text-base";

  return (
    <div className="absolute top-6 left-0 right-0 z-50 px-4 md:px-10 flex justify-center w-full" dir="rtl">
      {/* Main white pill-shaped container */}
      <div className="w-full max-w-7xl flex items-center justify-between bg-white shadow-md rounded-2xl px-6 py-3">
        
        {/* === Logo === */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            دكتور أحمد
          </h1>
        </div>

        {/* === Desktop Navigation === */}
        <ul className="hidden lg:flex items-center gap-1 xl:gap-4">
          <NavLink to="/" className={navLinkStyle}>
            الصفحة الرئيسة
          </NavLink>
          <NavLink to="/about" className={navLinkStyle}>
            من أنا
          </NavLink>
          <NavLink to="/consultation" className={navLinkStyle}>
            استشارة
          </NavLink>
          <NavLink to="/blogs" className={navLinkStyle}>
            مقالاتي
          </NavLink>
          <NavLink to="/courses" className={navLinkStyle}>
            كورساتنا
          </NavLink>
          <NavLink to="/products" className={navLinkStyle}>
            منتجاتنا
          </NavLink>
        </ul>

        {/* === Right Section (Language + Static Login Button + Menu) === */}
        <div className="flex items-center gap-3 md:gap-4">
          
          {/* Language Selector */}
          <div className="hidden md:flex items-center gap-2 border border-gray-300 rounded-xl px-3 py-1.5 cursor-pointer hover:bg-gray-50 transition">
            <span className="text-sm font-semibold text-gray-800">AR</span>
            <ChevronDown size={16} className="text-gray-600" />
            <span className="text-lg leading-none">🇪🇬</span>
          </div>

          {/* Static Login Button */}
          <button
            onClick={() => navigate("/login")}
            className="bg-[#3a5b8c] text-white px-6 py-1.5 md:px-8 md:py-2 rounded-xl text-sm md:text-base font-medium hover:bg-[#2b4469] transition shadow-sm"
          >
            دخول
          </button>

          {/* === Mobile Menu Icon === */}
          <img
            src={assets.menu_icon}
            alt="Menu Icon"
            className="w-7 lg:hidden cursor-pointer ml-2"
            onClick={() => setShowMenu(!showMenu)}
          />
        </div>
      </div>

      {/* === Mobile Menu === */}
      {showMenu && (
        <div className="fixed top-0 right-0 bottom-0 w-full lg:hidden bg-white z-50 overflow-auto transition-all shadow-2xl">
          <div className="flex items-center justify-between px-6 py-6 border-b border-gray-100">
            <h1 className="text-xl font-bold text-gray-900">
              دكتور أحمد
            </h1>
            <img
              className="w-8 cursor-pointer p-1 bg-gray-100 rounded-full"
              onClick={() => setShowMenu(false)}
              src={assets.cross_icon}
              alt="Close"
            />
          </div>

          <ul className="flex flex-col gap-4 mt-8 px-6 text-lg font-medium text-gray-800">
            <NavLink onClick={() => setShowMenu(false)} to="/">
              <p className="px-4 py-3 rounded-xl hover:bg-blue-50 hover:text-[#3a5b8c] transition">
                الصفحة الرئيسة
              </p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/about">
              <p className="px-4 py-3 rounded-xl hover:bg-blue-50 hover:text-[#3a5b8c] transition">
                من أنا
              </p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/consultation">
              <p className="px-4 py-3 rounded-xl hover:bg-blue-50 hover:text-[#3a5b8c] transition">
                استشارة
              </p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/blogs">
              <p className="px-4 py-3 rounded-xl hover:bg-blue-50 hover:text-[#3a5b8c] transition">
                مقالاتي
              </p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/courses">
              <p className="px-4 py-3 rounded-xl hover:bg-blue-50 hover:text-[#3a5b8c] transition">
                كورساتنا
              </p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/products">
              <p className="px-4 py-3 rounded-xl hover:bg-blue-50 hover:text-[#3a5b8c] transition">
                منتجاتنا
              </p>
            </NavLink>
            
            <button
              onClick={() => {
                setShowMenu(false);
                navigate("/login");
              }}
              className="mt-4 bg-[#3a5b8c] text-white px-8 py-3 rounded-xl font-medium w-full hover:bg-[#2b4469] transition"
            >
              دخول
            </button>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;