import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarDays, BookOpen, Clock, ArrowRight, PlayCircle } from "lucide-react";
import { assets } from "../../assets/assets";
import { blogsData } from "../../components/data";
import AnimatedText from "../../components/common/AnimatedContent";
import CTA from "../../components/home/CTA";

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    // البحث عن المقال بناءً على الـ ID
    const foundBlog = blogsData.find((b) => String(b.id) === id || b._id === id);
    if (foundBlog) {
      setBlog(foundBlog);
    }
    window.scrollTo(0, 0);
  }, [id]);

  if (!blog) return <div className="min-h-screen flex items-center justify-center text-white">جاري التحميل...</div>;

  return (
    <>
    <div className="mt-40 my-12 px-4 sm:px-6 lg:px-6 min-h-screen" dir="rtl">
      <div className="max-w-7xl mx-auto">
        
        <AnimatedText delay={0.1}>
          <button 
            onClick={() => navigate("/blogs")}
            className="flex items-center gap-2 text-white   font-medium mb-8 hover:gap-3 transition-all"
          >
            <ArrowRight size={20} />
            العودة للمقالات
          </button>
        </AnimatedText>

        {/* === رأس المقال (Header) === */}
        <div className="text-right mb-10">
          <AnimatedText delay={0.2}>
            <h1 className="text-3xl md:text-4xl  mb-6 leading-tight">
              {blog.title }
            </h1>
          </AnimatedText>
          
          <AnimatedText delay={0.3}>
            <div className="flex items-center gap-6 text-textSoft text-sm md:text-base">
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-textSoft" />
                <span>تاريخ النشر: {blog.meta1 || "10 يناير 2025"}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                   <img src={assets.profile} alt="د. أحمد الخطيب" className="w-full h-full object-cover" />
                </div>
                <span>بواسطة د. أحمد الخطيب</span>
              </div>
            </div>
          </AnimatedText>
        </div>

        {/* === الصورة الرئيسية (Hero Image) === */}
        <AnimatedText delay={0.4}>
          <div className="w-full h-[400px] md:h-[600px] rounded-3xl overflow-hidden mb-12 shadow-2xl">
            <img 
              src={blog.image || assets.header1} 
              alt={blog.title} 
              className="w-full h-full object-cover object-top"
            />
          </div>
        </AnimatedText>

        {/* === محتوى المقال (Content) === */}
        <div className="prose prose-lg max-w-none text-right mb-20">
          <AnimatedText delay={0.5}>
            <p className=" text-lg md:text-xl leading-[2] mb-8">
               {blog.desc}
               تعد مقاومة الإنسولين من أكثر المشكلات الصحية انتشاراً في العصر الحديث، وهي سبب رئيسي في زيادة الوزن وصعوبة فقدانه. في هذا المقال سنتعرف على كيفية حدوثها، وتأثيرها على الجسم، وأهم الخطوات الغذائية التي تساعد على تحسين حساسية الإنسولين.
            </p>
            <p className=" text-lg md:text-xl leading-[2] mb-8">
               فهم العلاقة بين الإنسولين وتخزين الدهون هو الخطوة الأولى نحو استعادة توازن الجسم. عندما يفقد الجسم قدرته على الاستجابة بفعالية للإنسولين، يبدأ البنكرياس في إفراز كميات أكبر، مما يؤدي إلى تراكم الدهون خاصة في منطقة البطن.
            </p>
          </AnimatedText>
        </div>

        {/* === قسم الخاتمة مع فيديو اليوتيوب === */}
<AnimatedText delay={0.6}>
  <div className="bg-white/50 rounded-[2.5rem] p-6 md:p-10 flex flex-col md:flex-row gap-10 items-center border border-gray-100 mb-20">
   

    {/* نص الخاتمة */}
    <div className="w-full md:w-1/2 text-right">
      <h3 className="text-2xl font-bold gradient-text mb-4 flex items-center gap-2 justify-start">
        <PlayCircle className="text-[#2c135e]" size={28} />
        خاتمة المقال
      </h3>
      <p className="text-gray-700 text-lg leading-relaxed">
        شاهد هذا الفيديو من قناة **د. أحمد الخطيب** الرسمية للحصول على شرح مفصل وعملي حول هذا الموضوع.
      </p>
    </div>

 {/* فيديو اليوتيوب */}
    <div className="w-full md:w-1/2 aspect-video rounded-2xl overflow-hidden shadow-lg border-4 border-white">
      {blog.youtubeId ? (
        <iframe
          key={blog.id}
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${blog.youtubeId}`}
          title={blog.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
          الفيديو غير متوفر حالياً
        </div>
      )}
    </div>

  </div>
</AnimatedText>

      
       
      </div>
      
    </div>

     <AnimatedText delay={0.5}>

          <CTA/>
        </AnimatedText>

  </>

   
  );
};

export default BlogDetails;