/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, CalendarDays, Mail, Award, ArrowRight } from "lucide-react";
import { coursesData } from "../../components/data"; 
import AnimatedText from "../../components/common/AnimatedContent";
import AppointmentModal from "../../components/AppointmentModal";
import Button from "../../components/common/Button";
import Testimonials from "../../components/home/Testimonials";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    // جلب البيانات بناءً على المعرف
    const foundCourse = coursesData.find((c) => String(c.id || c._id) === id);
    if (foundCourse) setCourse(foundCourse);
    window.scrollTo(0, 0);
  }, [id]);

  if (!course) return <div className="min-h-screen bg-[#0a051d] flex items-center justify-center text-white">جاري التحميل...</div>;

  // دالة لاختيار الأيقونة بناءً على الاسم القادم من البيانات
  const renderIcon = (iconName) => {
    switch (iconName) {
      case "heart": return <Heart size={20} className="text-white" />;
      case "calendar": return <CalendarDays size={20} className="text-white" />;
      case "mail": return <Mail size={20} className="text-white" />;
      case "award": return <Award size={20} className="text-white" />;
      default: return <Award size={20} className="text-white" />;
    }
  };

  const handleOpenModal = () => {
    if (!course) return;
    const serviceForModal = {
      id: course.id || course._id,
      title: `حجز : ${course.title}`,
      subtitle: "املأ البيانات لحجز موعدك لمناقشة تفاصيل الكورس",
      fees: String(course.price).replace(/[^0-9]/g, ''),
      duration: "30", // Default duration for a course consultation
      features: course.features?.map(f => f.text) || [
        "جلسة فيديو مباشرة عبر الإنترنت",
        "مناقشة محتوى الكورس",
        "الإجابة على استفساراتك",
      ],
      description: course.desc,
    };
    setSelectedService(serviceForModal);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen pt-42 pb-20 px-4 md:px-10 font-sans relative overflow-hidden" dir="rtl">
      
      {/* تأثير إضاءة خفيف في الخلفية كما في الصورة */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#2d1b5a]/30 to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* زر العودة */}
        <AnimatedText delay={0.1}>
          <button 
            onClick={() => navigate("/courses")}
            className="flex items-center gap-2 text-gray-400 font-medium mb-8 hover:text-white transition-all"
          >
            <ArrowRight size={20} />
            العودة للكورسات
          </button>
        </AnimatedText>

        {/* ================= القسم العلوي (Hero) ================= */}
        <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start mb-24">
          
          {/* Right: Course Content */}
          <div className="w-full lg:w-1/2 text-right text-white">
            <AnimatedText delay={0.1}>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                {course.title}
              </h1>
            </AnimatedText>

            <AnimatedText delay={0.2}>
              <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-6 opacity-90">
                {course.desc}
              </p>
            </AnimatedText>

            {/* التاجات (Tags) */}
            <AnimatedText delay={0.3}>
              <div className="flex flex-wrap gap-3 mb-8">
                {course.tags?.map((tag, index) => (
                  <span key={index} className="bg-white/5 border border-white/20 text-gray-300 px-4 py-1.5 rounded-full text-sm font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </AnimatedText>

            <AnimatedText delay={0.4}>
              <div className="mb-8">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl md:text-5xl font-extrabold">{course.price}</span>
                  <span className="text-2xl font-bold">جنيه</span>
                </div>
                <p className="text-gray-400 text-sm">
                  {course.note || "بعد الاشتراك سيتم إرسال رابط الكورس على بريدك الإلكتروني."}
                </p>
              </div>
            </AnimatedText>

            {/* زر الاشتراك */}
            <AnimatedText delay={0.5}>
              <Button className=" w-full text-xl " onClick={handleOpenModal}>
                اشترك الآن
              </Button  >
            </AnimatedText>
          </div>

          {/* Left: Course Image */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-1/2"
          >
            <div className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              <img 
                src={course.image} 
                alt={course.title} 
                className="w-full aspect-video md:aspect-[4/3] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a051d]/60 to-transparent"></div>
            </div>
          </motion.div>
        </div>

        {/* ================= قسم كيف يعمل الكورس (Timeline) ================= */}
        <div className="mb-20">
          <AnimatedText delay={0.3}>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-right">
              كيف يعمل الكورس؟
            </h2>
          </AnimatedText>

          <AnimatedText delay={0.4}>
            <div className="border border-white/20 rounded-2xl p-8 md:p-12 relative bg-white/5 backdrop-blur-sm">
              {/* الخط الأفقي الواصل بين الدوائر (يظهر في الشاشات الكبيرة) */}
              <div className="hidden md:block absolute top-[40%] left-16 right-16 h-1 bg-white/30 -translate-y-1/2 rounded-full"></div>
              
              <div className="flex flex-col md:flex-row justify-between relative z-10 gap-8 md:gap-0">
                {course.timeline?.map((step, index) => (
                  <div key={index} className="flex flex-col items-center text-center relative group">
                    {/* الدائرة التي تحتوي على الرقم */}
                    <div className="w-10 h-10 rounded-full gradient-secondary border-2 border-white flex items-center justify-center  font-bold text-white mb-4 shadow-[0_0_15px_rgba(255,255,255,0.2)] group-hover:scale-110 transition-transform">
                      {index + 1}
                    </div>
                    {/* نص الخطوة */}
                    <div className="bg-white/10 border border-white/20 text-white rounded-full px-5 py-2 text-sm font-medium shadow-md">
                      {step}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedText>
        </div>

        {/* ================= قسم مميزات الكورس ================= */}
        <div>
          <AnimatedText delay={0.5}>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-right">
              مميزات الكورس
            </h2>
          </AnimatedText>

          <AnimatedText delay={0.6}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {course.features?.map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="border border-white/20 bg-white/5 hover:bg-white/10 rounded-2xl p-5 flex items-center justify-between gap-4 transition-colors cursor-default"
                >
                  <span className="text-white font-medium text-lg text-right w-full">
                    {feature.text}
                  </span>
                  <div className="p-2 bg-white/10 rounded-lg">
                    {renderIcon(feature.iconName)}
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatedText>
        </div>


       

      </div>

    <div dir="ltr" >
         <AnimatedText delay={0.7}>
            <Testimonials/>
        </AnimatedText>
    </div>

      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        serviceInfo={selectedService}
      />
      
    </div>
  );
};

export default CourseDetails;