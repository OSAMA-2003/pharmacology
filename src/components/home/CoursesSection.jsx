// CoursesSection.jsx
import React from "react";
import { FiClock, FiCalendar, FiMonitor } from "react-icons/fi";
import { coursesData } from "../data";
import Carousel from "../common/Carousel";
import AnimatedText from "../common/AnimatedContent"; // استيراد المكون
import { Link } from "react-router-dom";

const CoursesSection = () => {
  return (
    <section className="py-16 px-4 md:px-10" dir="rtl">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
          <div className="text-right">
            
            {/* تحريك العنوان الرئيسي */}
            <AnimatedText delay={0.1}>
              <h1 className="text-3xl md:text-4xl font-bold ">
                الكورسات
              </h1>
            </AnimatedText>

            {/* تحريك الوصف */}
            <AnimatedText delay={0.2}>
              <p className=" text-lg font-medium my-6">
                نشاركك أحدث الكورسات والنصائح الطبية والغذائية الموثوقة ..
              </p>
            </AnimatedText>

           

            {/* تحريك رابط المشاهدة */}
            <AnimatedText delay={0.4}>
              <Link to={'/courses'} 
              
                className="text-[#cad5e4] font-bold text-lg hover:underline mb-1 inline-block"
              >
                مشاهدة كل الكورسات
              </Link>
            </AnimatedText>
          </div>
        </div>

        {/* تحريك الكاروسيل بالكامل عند ظهوره */}
        <AnimatedText delay={0.6}>
          <Carousel 
            data={coursesData}
            Meta1Icon={FiClock}
            Meta2Icon={FiMonitor}
            ButtonIcon={FiCalendar}
            buttonText="اشترك الآن" 
            gradientColor="from-[#1e4b8f]" // قمت بتعديل اللون ليتماشى مع هوية الكورسات
          />
        </AnimatedText>
        
      </div>
    </section>
  );
};

export default CoursesSection;