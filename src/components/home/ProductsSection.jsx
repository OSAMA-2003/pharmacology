import React from "react";
import { FiPackage, FiStar } from "react-icons/fi";
import { FaCartShopping } from "react-icons/fa6";
import { productsData } from "../data";
import Carousel from "../common/Carousel";
import AnimatedText from "../common/AnimatedContent"; // استيراد المكون
import { Link } from "react-router-dom";

const ProductsSection = () => {
    return (
        <section className="py-16 px-4 md:px-10" dir="rtl">
      <div className="max-w-7xl mx-auto">

                <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
                    <div className="text-start">
                        
                        {/* تحريك العنوان الفرعي */}
                        <AnimatedText delay={0.1}>
                            <h2 className="text-xl md:text-2xl font-semibold ">
                                عزز صحتك مع :
                            </h2>
                        </AnimatedText>

                        
                        {/* تحريك العنوان الرئيسي */}
                        <AnimatedText delay={0.2}>
                            <h3 className="text-3xl md:text-4xl font-bold my-4">
                                منتجاتنا الموصى بها
                            </h3>
                        </AnimatedText>

                        {/* تحريك الوصف */}
                        <AnimatedText delay={0.3}>
                            <p className="text-lg font-medium my-4">
                                نشاركك أحدث منتجاتنا الطبية والغذائية الموثوقة ..
                            </p>
                        </AnimatedText>


                        {/* تحريك رابط المتجر */}
                        <AnimatedText delay={0.4}>
                            <Link 
                                to={'/products'} 
                                className="text-[#cad5e4] font-bold text-lg hover:underline inline-block"
                            >
                                مشاهدة كل منتجاتنا
                            </Link>
                        </AnimatedText>
                    </div>
                </div>

                <AnimatedText delay={0.6}>
                    <Carousel
                        data={productsData}
                        Meta1Icon={FiPackage}
                        Meta2Icon={FiStar}
                        ButtonIcon={FaCartShopping}
                        buttonText="عرض المنتج"
                        gradientColor="from-[#4a3b2c]"
                        to={'/products/:id'}
                    />
                </AnimatedText>

            </div>
        </section>
    );
};

export default ProductsSection;