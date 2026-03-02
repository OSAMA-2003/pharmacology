/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { motion } from "framer-motion";
import { ShoppingCart, Search, Star, Package } from "lucide-react";
import { toast } from "react-toastify";

// Components
import { productsData } from "../../components/data"; 
import AnimatedText from "../../components/common/AnimatedContent";
import Card from "../../components/common/Card";

const ProductsPage = () => {
  const navigate = useNavigate();
  const { token } = useContext(AppContext);

  const [products] = useState(productsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(productsData);

  useEffect(() => {
    if (searchTerm) {
      setFilteredData(
        products.filter((item) =>
          item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredData(products);
    }
  }, [searchTerm, products]);

  const handleProductClick = (id) => {
    navigate(`/products/${id}`);
  };

  const formatPrice = (price) => new Intl.NumberFormat("ar-EG").format(price);

  const cardHoverVariants = {
    hover: {
      y: -8,
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="mt-40 my-12 px-4 sm:px-6 lg:px-10 min-h-screen" dir="rtl">
      <div className="max-w-7xl mx-auto">
        
        {/* === Header Section === */}
        <div className="mb-10 text-right">
          <AnimatedText delay={0.1}>
            <div className="text-xs md:text-sm text-gray-400 mb-3 flex items-center justify-start gap-1">
              <span className=" cursor-pointer" onClick={() => navigate("/")}>الرئيسية</span>
              <span>/</span>
              <span className="text-secondary " >المنتجات</span>
            </div>
          </AnimatedText>
          
          <AnimatedText delay={0.2}>
            <h1 className="text-2xl md:text-4xl font-bold  mb-4">
              منتجات مختارة لدعم رحلتك الصحية :
            </h1>
          </AnimatedText>
          
          <AnimatedText delay={0.3}>
            <p className="text-sm md:text-base leading-relaxed max-w-4xl">
              مجموعة من المنتجات الغذائية والمكملات المختارة بعناية لدعم خطتك العلاجية.
            </p>
          </AnimatedText>
        </div>

        {/* Search Bar */}
        <div className="mb-10 max-w-md">
          <AnimatedText delay={0.4}>
            <div className="relative">
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="ابحث عن منتج..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-12 pl-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1e4b8f] text-right bg-gray-50/50 outline-none"
              />
            </div>
          </AnimatedText>
        </div>

        {/* === Products Grid === */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-6">
          {filteredData.map((product) => (
            <motion.div
              key={product._id || product.id}
              variants={cardHoverVariants}
              whileHover="hover"
              className="flex justify-center"
            >
                  <AnimatedText key={product._id || product.id} delay={0.3 }>
              <Card
                  item={{
                  id: product._id || product.id,
                  image: product.image || product.thumbnail, 
                  title: product.title,
                  desc: product.desc,
                  price: `${product.price} ج.م`  ,
                  meta1: product.meta1 || "منتج صحي",
                  meta2: product.meta2 || "4.5",
                }}
                Meta1Icon={Package}
                Meta2Icon={Star}
                ButtonIcon={ShoppingCart}
                buttonText="عرض المنتج"
                gradientColor="from-[#1e4b8f]/20"
                onClick={() => handleProductClick(product._id || product.id)}
                to={`/products/${product._id || product.id}`}
              />
              </AnimatedText>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredData.length === 0 && (
          <div className="text-center py-20">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800">لا توجد منتجات مطابقة لبحثك</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;