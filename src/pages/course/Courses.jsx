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
import { mockCoursesData } from "../../components/data"; 
import AnimatedText from "../../components/common/AnimatedContent";
// Import your Card component
import Card from "../../components/common/Card";

const Courses = () => {
  const navigate = useNavigate();
  const { token } = useContext(AppContext);

  const [courses, setCourses] = useState(mockCoursesData);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const cardHoverVariants = {
    hover: {
      y: -8,
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
      transition: { duration: 0.3 },
    },
  };

  const uniqueCategories = [...new Set(courses.map((course) => course.category))];

  const applyFilters = () => {
    let filtered = [...courses];
    if (searchTerm) {
      filtered = filtered.filter(
        (course) =>
          course.title_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description_ar.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
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
    <div className="mt-40 my-12 px-4 sm:px-6 lg:px-10" dir="rtl">
      <div className="max-w-7xl mx-auto">
        
        {/* === Header Section === */}
        <div className="mb-10 text-right">
          <AnimatedText delay={0.1}>
            <div className="text-xs md:text-sm text-gray-400 mb-3 flex items-center justify-start gap-1">
              <span className="text-secondary font-medium cursor-pointer" onClick={() => navigate("/")}>الرئيسية</span>
              <span>/</span>
              <span>الكورسات</span>
            </div>
          </AnimatedText>
          <AnimatedText delay={0.2}>
            <h1 className="text-2xl md:text-3xl font-bold mb-3">كورسات علمية معتمدة في التغذية العلاجية :</h1>
          </AnimatedText>
          <AnimatedText delay={0.3}>
            <p className=" text-sm md:text-base leading-relaxed max-w-4xl">
              برامج تعليمية متكاملة يقدمها د. أحمد الخطيب لطلاب العلم والمهتمين بالتغذية السريرية وعلم الأدوية.
            </p>
          </AnimatedText>
        </div>

        {/* === Search and Filters Bar === */}
        <AnimatedText delay={0.4}>
           <div className="mb-10 max-w-md">
          
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
                className="w-full pr-12 pl-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1e4b8f] focus:border-transparent text-right bg-gray-50/50"
              />
            </div>
        </div>
        </AnimatedText>

        {/* === Courses Grid === */}
        {/* === Courses Grid === */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {filteredCourses.length === 0 ? (
    <div className="col-span-full text-center py-20 text-gray-500">
      لا توجد دورات حالياً
    </div>
  ) : (
    filteredCourses.map((course) => (
      <motion.div
        key={course._id}
        variants={cardHoverVariants}
        whileHover="hover"
        className="w-full"
      >
        <AnimatedText key={course._id} delay={0.3 }>
        <Card
          item={{
            image: course.thumbnail,
            title: course.title_ar,
            desc: course.description_ar,
            price: `${formatPrice(course.discountPrice || course.price)} ج.م`,
            meta1: course.totalDuration,
            meta2: `${course.totalLessons} محاضرة`,
          }}
          Meta1Icon={Clock}
          Meta2Icon={Monitor}
          ButtonIcon={CalendarDays}
          buttonText="أحجز الكورس الآن"
          gradientColor="from-[#3a4417]"
          // No need for !static anymore because we fixed the Card component!
          onClick={() => navigate(`/course/${course.title_ar.replace(/\s+/g, "-").toLowerCase()}/${course._id}`)}
          
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