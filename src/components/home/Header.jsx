import React, { useState, useEffect } from "react";
import { FaInstagram, FaFacebookF, FaYoutube, FaTiktok } from "react-icons/fa";
import { FaCalendarDays, FaChevronRight, FaChevronLeft } from "react-icons/fa6";
import img1 from '../../assets/header-1.png';
import img2 from "../../assets/header-2.jpg";
import img3 from "../../assets/header-3.jpg";
import img4 from "../../assets/header-4.jpg";
import Button from "../common/Button";

// نحتفظ بالبيانات الأصلية خارج المكون لتحديد ترتيب النقاط الثابت
const initialData = [
  {
    id: 1,
    image: img1,
    title: "ما بين الدواء والغذاء قصة.. سأحكيها لك.",
    des: "استشارات متخصصة ودورات معتمدة في التغذية السريرية وعلم الأدوية من نخبة الخبراء في المجال.",
  },
  {
    id: 2,
    image: img2,
    title: "صحتك تبدأ من غذائك",
    des: "برامج غذائية مصممة خصيصاً لتناسب احتياجاتك الصحية وأهدافك الشخصية بخطوات علمية مدروسة.",
  },
  {
    id: 3,
    image: img3,
    title: "الرعاية المتكاملة لحياتك",
    des: "نقدم لك استشارات شاملة تجمع بين الطب الحديث وأسلوب الحياة الصحي لضمان أفضل النتائج.",
  },
  {
    id: 4,
    image: img4,
    title: "خطتك الدوائية بأمان",
    des: "تقييم شامل لأدويتك ومكملاتك الغذائية لتجنب التفاعلات الضارة وتحقيق أقصى استفادة.",
  },
];

const Header = () => {
  const [items, setItems] = useState(initialData);

  const handleNext = () => {
    setItems((prevItems) => [...prevItems.slice(1), prevItems[0]]);
  };

  const handlePrev = () => {
    setItems((prevItems) => [
      prevItems[prevItems.length - 1],
      ...prevItems.slice(0, prevItems.length - 1),
    ]);
  };

  useEffect(() => {
    const autoPlayInterval = setInterval(() => {
      setItems((prevItems) => [...prevItems.slice(1), prevItems[0]]);
    }, 10000);

    return () => clearInterval(autoPlayInterval);
  }, []);

  const handleItemClick = (index) => {
    if (index === 1) return;

    setItems((prevItems) => {
      if (index === 0) {
        return [
          prevItems[prevItems.length - 1],
          ...prevItems.slice(0, prevItems.length - 1),
        ];
      }
      const shifts = index - 1;
      return [...prevItems.slice(shifts), ...prevItems.slice(0, shifts)];
    });
  };

  const handleDotClick = (targetId) => {
    // 1. نبحث عن موقع العنصر المطلوب داخل المصفوفة الحالية
    const currentIndex = items.findIndex((item) => item.id === targetId);
    
    // 2. إذا كان هو المعروض حالياً (العنصر الثاني / index 1)، لا تفعل شيئاً
    if (currentIndex === 1) return;

    // 3. نحسب عدد الإزاحات المطلوبة لجعل العنصر الهدف في الـ index 1
    setItems((prevItems) => {
      // نحتاج لعمل Shift بمقدار (currentIndex - 1)
      let shifts = currentIndex - 1;
      
      // إذا كان العنصر هو الأخير (index 0)، نحتاج لعمل إزاحة للخلف
      if (shifts < 0) shifts = prevItems.length + shifts;

      return [...prevItems.slice(shifts), ...prevItems.slice(0, shifts)];
    });
  };

  return (
    <header className="relative w-full h-screen overflow-hidden bg-gray-900 text-white" dir="rtl">
      {/* Social Media Sidebar */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-6 border-r border-gray-400/50 pr-6 hidden md:flex">
        <a href="#" className="text-xl hover:text-blue-400 transition-colors"><FaFacebookF /></a>
        <a href="#" className="text-xl hover:text-pink-400 transition-colors"><FaInstagram /></a>
        <a href="#" className="text-xl hover:text-red-600 transition-colors"><FaYoutube /></a>
        <a href="#" className="text-xl hover:text-black transition-colors"><FaTiktok /></a>
      </div>

      {/* Carousel Container */}
      <div className="absolute inset-0 w-full h-full">
        {items.map((item, index) => (
          <div
            key={item.id}
            onClick={() => handleItemClick(index)}
            className={`carousel-item shadow-2xl bg-center bg-cover w-full h-full transition-all duration-700 ease-in-out ${
              index !== 1 ? "cursor-pointer hover:brightness-110" : ""
            }`}
            style={{
              backgroundImage: `linear-gradient(to left, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 100%), url(${item.image})`,
            }}
          >
            {/* Content Area */}
            <div className="carousel-content absolute top-1/2 right-[5%] md:right-[10%] w-[90%] md:w-full max-w-[600px] -translate-y-1/2 text-right ">
              <h1 className="pointer-events-none text-4xl md:text-6xl font-bold leading-tight mb-4 md:mb-6 text-white drop-shadow-lg pointer-events-auto">
                {item.title}
              </h1>
              <p className= "pointer-events-none text-base md:text-xl text-gray-200 mb-6 md:mb-8 leading-relaxed pointer-events-auto">
                {item.des}
              </p>
               <Button to={'/consultations'} className="cursor-pointer" >
              ابدأ رحلتك الصحيه الان
              </Button>

             
            </div>

            
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl">
        <Button
          onClick={handlePrev}
          className="w-10 h-10 flex items-center justify-center bg-white text-black rounded-full hover:scale-110 transition-transform"
        >
          <FaChevronRight />
        </Button>
        <div className="flex gap-2">
          {/* هنا نقوم بعمل loop على البيانات الثابتة (initialData) للحفاظ على ترتيب النقاط */}
          {initialData.map((dataItem) => {
            // التحقق مما إذا كان هذا الـ ID هو المعروض حالياً (أي الموجود في items[1])
            const isActive = items[1]?.id === dataItem.id;

            return (
              <span
                key={dataItem.id}
                onClick={() => handleDotClick(dataItem.id)}
                className={`h-2 rounded-full transition-all duration-500 cursor-pointer hover:bg-white ${
                  isActive ? "w-6 bg-white" : "w-2 bg-white/50"
                }`}
              ></span>
            );
          })}
        </div>
        <Button
          onClick={handleNext}
          className="w-10 h-10 flex items-center justify-center bg-white text-black rounded-full hover:scale-110 transition-transform"
        >
          <FaChevronLeft />
        </Button>
      </div>

      {/* CSS for Carousel Logic */}
      <style dangerouslySetInnerHTML={{__html: `
        .carousel-item {
          position: absolute;
          width: 260px;
          height: 200px;
          border-radius: 16px;
          display: inline-block;
          top: 60%;
          box-shadow: 0 10px 20px rgba(0,0,0,0.3);
        }

        /* Active full-screen slides */
        .carousel-item:nth-child(1),
        .carousel-item:nth-child(2) {
          top: 0;
          left: 0;
          transform: translate(0, 0);
          border-radius: 0;
          width: 100%;
          height: 100%;
          box-shadow: none;
        }

        /* Thumbnails positioned on the bottom left */
        .carousel-item:nth-child(3) { left: 5%; }
        .carousel-item:nth-child(4) { left: calc(5% + 280px); }
        .carousel-item:nth-child(5) { left: calc(5% + 560px); }
        .carousel-item:nth-child(n + 6) { left: calc(5% + 840px); opacity: 0; }

        @media (max-width: 768px) {
          .carousel-item:nth-child(n + 3) {
            display: none !important;
          }
        }

        .carousel-content { display: none; }
        .carousel-item:nth-child(2) .carousel-content { display: block; }

        @keyframes fadeInRtl {
          from { opacity: 0; transform: translateY(30px); filter: blur(5px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }

        .carousel-item:nth-child(2) .carousel-content h1 { opacity: 0; animation: fadeInRtl 0.6s ease-out 0.4s 1 forwards; }
        .carousel-item:nth-child(2) .carousel-content p { opacity: 0; animation: fadeInRtl 0.6s ease-out 0.6s 1 forwards; }
        .carousel-item:nth-child(2) .carousel-content button { opacity: 0; animation: fadeInRtl 0.6s ease-out 0.8s 1 forwards; }
      `}} />
    </header>
  );
};

export default Header;