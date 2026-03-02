import React from "react";
import { FaInstagram, FaTiktok, FaYoutube, FaFacebook, FaWhatsapp, FaPhone } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer
      dir="rtl"
      className="py-12 px-6 md:px-20 text-white"
      style={{ background: "linear-gradient(90deg, #3A1F66 0%, #1D014B 100%)" }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-right">

        {/* About Section */}
        <div className="flex flex-col items-center md:items-start">
          <img
            src={assets.logoWhite}
            alt="Logo"
            className="w-42 md:w-72 mb-5 mx-auto md:mx-0"
          />

          <p className="text-gray-300 leading-loose text-sm md:text-base">
            الصحة مش دواء بس... الصحة أسلوب حياة. نساعدك تبني حياة صحية مستدامة من خلال التغذية العلاجية والطب الشمولي.
          </p>
        </div>

        {/* Quick Links Section */}
        <div className="flex flex-col items-center">
          <h3 className="text-xl font-bold mb-6">روابط سريعه</h3>

          <ul className="space-y-4 text-gray-300 text-sm md:text-base">
            <li>
              <a href="#" className="hover:text-white transition duration-300">
                الرئيسية
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition duration-300">
                من انا
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition duration-300">
                الاستشارات
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition duration-300">
                المقالات
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition duration-300">
                المنتجات
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="flex flex-col items-center md:items-start text-center md:text-right">
          <h3 className="text-xl font-bold mb-6">الصفح الرئيسية</h3>

          {/* Social Icons */}
          <div className="flex items-center justify-center md:justify-start gap-3 mb-8">
            <a
              href="#"
              aria-label="WhatsApp"
              className="flex items-center justify-center w-11 h-11 border border-white rounded-xl hover:bg-white hover:text-[#3A1F66] transition duration-300"
            >
              <FaWhatsapp className="text-xl" />
            </a>

            <a
              href="#"
              aria-label="Facebook"
              className="flex items-center justify-center w-11 h-11 border border-white rounded-xl hover:bg-white hover:text-[#3A1F66] transition duration-300"
            >
              <FaFacebook className="text-xl" />
            </a>

            <a
              href="#"
              aria-label="YouTube"
              className="flex items-center justify-center w-11 h-11 border border-white rounded-xl hover:bg-white hover:text-[#3A1F66] transition duration-300"
            >
              <FaYoutube className="text-xl" />
            </a>

            <a
              href="#"
              aria-label="TikTok"
              className="flex items-center justify-center w-11 h-11 border border-white rounded-xl hover:bg-white hover:text-[#3A1F66] transition duration-300"
            >
              <FaTiktok className="text-xl" />
            </a>

            <a
              href="#"
              aria-label="Instagram"
              className="flex items-center justify-center w-11 h-11 border border-white rounded-xl hover:bg-white hover:text-[#3A1F66] transition duration-300"
            >
              <FaInstagram className="text-xl" />
            </a>
          </div>

          {/* Contact Details */}
          <div className="space-y-4 text-gray-300 text-sm md:text-base w-full">
            <p className="flex items-center justify-center md:justify-start gap-3">
              <FaPhone className="text-lg transform scale-x-[-1]" />
              <span dir="ltr">01510201020</span>
            </p>

            <p className="flex items-center justify-center md:justify-start gap-3">
              <FaWhatsapp className="text-lg" />
              <span dir="ltr">info@dr-ahmed.com</span>
            </p>
          </div>
        </div>
      </div>

      <hr className="mt-12 mb-6 border-gray-400 opacity-30" />

      <p className="text-center text-gray-300 text-sm">
        © 2024 شركة نقل الأثاث وتنظيفه - جميع الحقوق محفوظة.
      </p>
    </footer>
  );
};

export default Footer;