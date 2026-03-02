import React from "react";
import { FiClock, FiCalendar, FiMonitor } from "react-icons/fi";
import { consultationsData } from "../data";
import Carousel from "../common/Carousel";
import AnimatedText from "../common/AnimatedContent";
import { Link } from "react-router-dom";

// 1. استيراد المكون الجديد (تأكد من صحة المسار)

const ConsultationsSection = () => {
  return (
    <section className="py-16 px-4 md:px-10" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
          <div className="text-right">
            
            {/* 2. تغليف العناصر بالمكون مع زيادة الـ delay تدريجياً */}
            
            <AnimatedText delay={0.1}>
               <h2 className="text-3xl md:text-4xl font-bold"> الاستشارات</h2>
            </AnimatedText>

            <AnimatedText delay={0.2}>
              <p className="text-lg font-medium my-6">
                نشاركك أحدث الاستشارات والنصائح الطبية والغذائية الموثوقة ..
              </p>
            </AnimatedText>

            

            <AnimatedText delay={0.3}>
              {/* أضفنا inline-block للرابط لضمان عمل حركة التحويل بشكل صحيح */}
              <Link to="/consultations" className="text-[#cad5e4] font-bold text-lg hover:underline inline-block">
                مشاهدة كل الاستشارات
              </Link>
            </AnimatedText>
          </div>
        </div>

        {/* يمكنك أيضاً تطبيق الأنيميشن على الكاروسيل بالكامل إذا أردت */}
        <AnimatedText delay={0.4}>
          <Carousel
            data={consultationsData}
            Meta1Icon={FiClock}
            Meta2Icon={FiMonitor}
            ButtonIcon={FiCalendar}
            buttonText="أحجز موعدك"
            gradientColor="from-[#3a4417]"
            to={'/consultations/:id'}
          />
        </AnimatedText>
        
      </div>
    </section>
  );
};

export default ConsultationsSection;