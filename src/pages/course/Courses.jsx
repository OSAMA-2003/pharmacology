/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { motion } from "framer-motion";
import {
  Search,
  Clock,
  Monitor,
  CalendarDays,
  BookOpen
} from "lucide-react";
import { coursesData } from "../../components/data"; 
import AnimatedText from "../../components/common/AnimatedContent";
import Card from "../../components/common/Card";

const Courses = () => {
  const navigate = useNavigate();
  const { token } = useContext(AppContext);

  const [courses, setCourses] = useState(coursesData);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const cardHoverVariants = {
    hover: {
      y: -8,
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
      transition: { duration: 0.3 },
    },
  };

  // استخراج التصنيفات المتاحة إذا كانت موجودة في البيانات
  const uniqueCategories = [...new Set(courses.map((course) => course.category).filter(Boolean))];

  const applyFilters = () => {
    let filtered = [...courses];
    
    // 1. فلترة البحث (تم تعديل الحقول لتتطابق مع الـ Data الجديدة title و desc)
    if (searchTerm) {
      filtered = filtered.filter(
        (course) =>
          (course.title && course.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (course.desc && course.desc.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // 2. فلترة التصنيف
    if (selectedCategory !== "all") {
      filtered = filtered.filter((course) => course.category === selectedCategory);
    }
    
    setFilteredCourses(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [courses, searchTerm, selectedCategory, sortBy]);

  const formatPrice = (price) => new Intl.NumberFormat("ar-EG").format(price);

  return (
    // تم تحويل الخلفية للون الداكن لتطابق باقي الموقع
    <div className="pt-42 pb-20 px-4 sm:px-6 lg:px-10 min-h-screen " dir="rtl">
      <div className="max-w-7xl mx-auto">
        
        {/* === Header Section === */}
        <div className="mb-12 text-right text-white">
          <AnimatedText delay={0.1}>
             <div className="text-xs md:text-sm text-secondary mb-3 flex items-center justify-start gap-1">
              <span className="text-secondary  font-medium cursor-pointer" onClick={() => navigate("/")}>الرئيسية</span>
              
              <span>/</span>
              <span>الكورسات</span>
            </div>
          </AnimatedText>
          <AnimatedText delay={0.2}>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              كورسات علمية معتمدة في التغذية العلاجية
            </h1>
          </AnimatedText>
          <AnimatedText delay={0.3}>
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-4xl opacity-90">
              برامج تعليمية متكاملة يقدمها د. أحمد الخطيب لطلاب العلم والمهتمين بالتغذية السريرية وعلم الأدوية.
            </p>
          </AnimatedText>
        </div>

        {/* === Search and Filters Bar === */}
        <AnimatedText delay={0.4}>
          <div className="mb-12 max-w-md">
            <div className="relative">
              <Search
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="ابحث عن كورس..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                // تم تعديل تصميم حقل البحث ليناسب الخلفية الداكنة
                className="w-full pr-12 pl-4 py-4 border border-white/10 rounded-xl focus:ring-2 focus:ring-[#9b61db] focus:border-transparent text-right bg-white/5 text-white placeholder-gray-400 outline-none shadow-lg backdrop-blur-sm transition-all"
              />
            </div>
          </div>
        </AnimatedText>

        {/* === Courses Grid === */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-white/5 rounded-2xl border border-white/10">
              <BookOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-xl font-medium">لا توجد دورات مطابقة لبحثك حالياً.</p>
            </div>
          ) : (
            filteredCourses.map((course, index) => (
              <motion.div
                key={course._id || course.id}
                variants={cardHoverVariants}
                whileHover="hover"
                className="w-full flex justify-center"
              >
                <AnimatedText delay={0.3 + (index * 0.1)}>
                  <Card
                    item={{
                      image: course.image,
                      title: course.title,
                      desc: course.desc,
                      price: `${formatPrice(course.discountPrice || course.price)} ج.م`,
                      meta1: course.meta1 || "12 ساعة",
                      meta2: `${course.meta2 }`,
                    }}
                    Meta1Icon={Clock}
                    Meta2Icon={Monitor}
                    ButtonIcon={CalendarDays}
                    buttonText="أحجز الكورس الآن"
                    to={`/courses/${course._id || course.id}`}
                  />
                </AnimatedText>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;