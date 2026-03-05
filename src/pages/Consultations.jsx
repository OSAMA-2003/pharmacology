/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarDays, Star, Search } from "lucide-react";
import { consultationsData } from "../components/data";
import AnimatedText from "../components/common/AnimatedContent";
import Card from "../components/common/Card";
import AppointmentModal from "../components/AppointmentModal";

const Consultations = () => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [consultations, setConsultations] = useState(consultationsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(consultationsData);

  useEffect(() => {
    if (searchTerm) {
      setFilteredData(
        consultations.filter(
          (item) =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.desc?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredData(consultations);
    }
  }, [searchTerm, consultations]);

  const cardHoverVariants = {
    hover: {
      y: -8,
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.25)",
      transition: { duration: 0.3 },
    },
  };

  const handleOpenModal = (item) => {
    const serviceForModal = {
      id: item.id,
      title: item.title,
      subtitle: `جلسة فيديو مباشرة بخصوص: ${item.title}`,
      fees: item.price.replace(/[^0-9]/g, ''),
      duration: "45", // Default duration
      features: [
        "جلسة فيديو مباشرة عبر الإنترنت",
        "تقييم شامل للحالة الصحية",
        "توصيات غذائية مخصصة",
        "خطة عمل واضحة ومحددة",
      ],
      description: item.desc,
    };
    setSelectedService(serviceForModal);
    setIsModalOpen(true);
  };

  return (
    <div className="mt-40 my-12 px-4 sm:px-6 lg:px-10" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-right">
          <AnimatedText delay={0.1}>
            <div className="text-xs md:text-sm text-secondary mb-3 flex items-center justify-start gap-1">
              <span className="text-secondary font-medium cursor-pointer" onClick={() => navigate("/")}>الرئيسية</span>
              <span>/</span>
              <span>الاستشارات</span>
            </div>
          </AnimatedText>

          <AnimatedText delay={0.2}>
            <h1 className="text-2xl md:text-4xl font-bold mb-4">
              الاستشارات في التغذيه الصحيحه ل :
            </h1>
          </AnimatedText>

          <AnimatedText delay={0.3}>
            <p className=" text-sm md:text-base leading-relaxed max-w-4xl">
              استشارة متخصصة مبنية على حالتك الصحية وأهدافك، بخطة عملية تناسب نمط حياتك وتضمن نتائج مستدامة.
              <br />
              مع متابعة علمية دقيقة للوصول لأفضل نسخة منك.
            </p>
          </AnimatedText>
        </div>

        <div className="mb-10 max-w-md">
          <AnimatedText delay={0.4}>
            <div className="relative">
              <Search
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="ابحث عن استشارة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-12 pl-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1e4b8f] focus:border-transparent text-right bg-gray-50/50"
              />
            </div>
          </AnimatedText>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredData.map((item) => (
            <motion.div
              key={item.id}
              variants={cardHoverVariants}
              whileHover="hover"
              className="relative"
            >
                   <AnimatedText key={item.id} delay={0.3 }>

              <Card
                item={item}
                Meta1Icon={CalendarDays}
                Meta2Icon={Star}
                buttonText="احجز الآن"
                gradientColor="from-[#1e4b8f]/90"
                onClick={() => handleOpenModal(item)}
              />
              </AnimatedText>
            </motion.div>
          ))}
        </div>

        {filteredData.length === 0 && (
          <AnimatedText delay={0.2}>
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">
                لم يتم العثور على استشارات تطابق بحثك.
              </p>
            </div>
          </AnimatedText>
        )}
      </div>

      <AppointmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        serviceInfo={selectedService} 
      />
    </div>
  );
};

export default Consultations;