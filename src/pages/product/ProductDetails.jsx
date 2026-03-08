/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { productsData } from "../../components/data"; 
import AnimatedText from "../../components/common/AnimatedContent";
import Testimonials from "../../components/home/Testimonials";
import { ArrowRight } from "lucide-react";
import Button from "../../components/common/Button";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    const foundProduct = productsData.find((p) => String(p.id || p._id) === id);
    if (foundProduct) setProduct(foundProduct);
  }, [id]);

  if (!product) return <div className="min-h-screen  flex items-center justify-center text-white">جاري التحميل...</div>;

  const tabs = [
    { id: "description", label: "الوصف" },
    { id: "dosage", label: "الجرعات" },
    { id: "ingredients", label: "المكونات" },
    { id: "warnings", label: "التحذيرات" },
  ];

  return (
    <div className="min-h-screen pt-32 md:pt-42 pb-20 px-4 md:px-10 font-sans" dir="rtl">
    
   
      <div className="max-w-7xl mx-auto">

        
         <AnimatedText delay={0.1}>
            <div className="text-xs md:text-sm text-gray-400 mb-5 flex items-center justify-start gap-1">
              <span className="  cursor-pointer" onClick={() => navigate("/")}>الرئيسية</span>
              <span>/</span>
              <span className="cursor-pointer" onClick={() => navigate("/products")}>المنتجات</span>
              <span>/</span>
              <span className="text-secondary" >{product.title}</span>
            </div>
          </AnimatedText>

\        <div className="flex flex-col-reverse md:flex-col lg:flex-row gap-12 items-center lg:items-start mb-20">
          
          {/* Right Section: Product Content */}
          <div className="w-full lg:w-1/2 text-right text-white">
            <AnimatedText delay={0.1}>
              <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                {product.title}
              </h1>
            </AnimatedText>

            <AnimatedText delay={0.2}>
              <p className="text-gray-300 text-lg leading-relaxed mb-8 opacity-90">
                {product.subtitle}
              </p>
            </AnimatedText>

            <AnimatedText delay={0.3}>
              <div className="mb-8">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-bold">{product.price}</span>
                  <span className="text-2xl font-bold">جنيه</span>
                </div>
                <p className="text-gray-400 text-sm tracking-wide">
                  Weekly Discount: {product.weeklyDiscount} | Monthly Discount: {product.monthlyDiscount}
                </p>
              </div>
            </AnimatedText>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Button className="flex-1 bg-white/70 text-[#11053b] border-2  border-[#2b185e] hover:bg-[#2b185e]  py-4 md:px-40 rounded-xl font-bold text-lg transition-all active:scale-95">
                اشتري الان
              </Button>

              

              <Link to="/consultations">
               <button className="flex-1 w-full bg-white hover:bg-gray-100 text-[#11053b] py-4 md:px-6 rounded-xl font-bold text-lg transition-all active:scale-95 shadow-lg">
                احجز استشاره
              </button>
              </Link>
            </div>

            {/* Dynamic Tabs System */}
            <div className="bg-white/10 rounded-xl p-1.5 flex flex-wrap mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3 px-2 rounded-lg font-bold transition-all text-sm md:text-base ${
                    activeTab === tab.id 
                    ? "bg-white text-[#11053b] shadow-md" 
                    : "text-gray-300 hover:text-[#11053b]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Dynamic Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="text-gray-300 leading-loose text-base md:text-lg text-right min-h-[120px]"
              >
                {activeTab === "description" && <p>{product.desc}</p>}
                {activeTab === "dosage" && <p>{product.dosage}</p>}
                {activeTab === "ingredients" && <p>{product.ingredients}</p>}
                {activeTab === "warnings" && <p className="text-red-400 font-medium">{product.warnings}</p>}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Left Section: Product Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full lg:w-1/2"
          >
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
              <img 
                src={product.image} 
                alt={product.title} 
                className="w-full aspect-[4/3] object-cover"
              />
              {/* تدرج لوني خفيف فوق الصورة لإعطاء طابع سينمائي */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#11053b]/40 to-transparent pointer-events-none"></div>
            </div>
          </motion.div>

        </div>

             
             

      </div>
      <div dir="ltr">
                 <Testimonials/>
             </div>
    </div>
  );
};

export default ProductDetails;