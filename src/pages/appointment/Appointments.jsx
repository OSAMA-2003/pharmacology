/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { CheckCircle, Clock, Video, ArrowLeft } from "lucide-react"; // أيقونات التصميم

// Components (تأكد من مسارات هذه المكونات لديك)
import AppointmentForm from "../../components/appointment/AppointmentForm";
import TimeSlots from "../../components/appointment/TimeSlots";
import Calendar from "../../components/appointment/Calender";

// ==========================================
// 1. البيانات الوهمية (Mock Data) كبديل للباك إند
// ==========================================
const mockServiceInfo = {
  _id: "s1",
  title: "استشارة أونلاين",
  category: "استشارات طبية",
  fees: 150,
  duration: "45 دقيقة",
  description: "من يبحث عن استشارة سريعة وفعالة من المنزل للحصول على توجيهات غذائية أو دوائية.",
  features: [
    "جلسة فيديو مباشرة عبر الإنترنت",
    "تقييم شامل للحالة الصحية",
    "توصيات غذائية مخصصة",
    "خطة عمل واضحة ومحددة",
    "متابعة عبر الرسائل لمدة أسبوع"
  ],
  available: true
};

const mockBookedSlotsData = {
  // يمكنك تغيير هذا التاريخ ليتطابق مع يوم في الشهر الحالي لاختبار ظهور الأوقات المحجوزة
  "الجمعة، 27 فبراير 2026": ["10:00 ص", "11:30 ص", "03:00 م"],
};

const mockBlockedSlotsData = {
  "الجمعة، 27 فبراير 2026": ["02:00 م"],
};

// ==========================================
// 2. المكون الأساسي
// ==========================================
const Appointments = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  // الحالة العامة للصفحة
  const [state, setState] = useState({
    serviceInfo: null,
    selectedDate: "",
    selectedTime: "",
    showForm: false,
    loading: true,
    bookedSlots: {},
    blockedSlots: {},
    currentMonth: new Date().getMonth(),
    currentYear: new Date().getFullYear(),
    selectedDayIndex: null,
    slotsError: null,
  });

  // ❌ تم إيقاف استدعاء الـ API (MedicalContext, AppContext, appointmentApi)
  // ✅ استخدام البيانات الوهمية بدلاً منها
  useEffect(() => {
    const fetchData = async () => {
      setState((prev) => ({ ...prev, loading: true, slotsError: null }));

      // محاكاة تأخير التحميل (Network Delay Simulation)
      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          serviceInfo: mockServiceInfo,
          bookedSlots: mockBookedSlotsData,
          blockedSlots: mockBlockedSlotsData,
          loading: false,
          slotsError: null,
        }));
      }, 500); 
    };

    fetchData();
  }, [serviceId]);

  // اختيار التاريخ
  const handleDateSelect = (dateKey) => {
    setState((prev) => ({
      ...prev,
      selectedDate: dateKey,
      selectedTime: "",
    }));
  };

  // اختيار الوقت (مع إيقاف الـ API للتحقق من الموعد)
  const handleTimeSelect = async (time) => {
    if (!state.selectedDate) {
      toast.error("يرجى اختيار التاريخ أولاً");
      return;
    }

    // ✅ تم إيقاف الـ API، والاعتماد على الـ State مباشرة
    setState((prev) => ({
      ...prev,
      selectedTime: time,
    }));
  };

  // تأكيد الحجز والانتقال للنموذج
  const handleConfirmBooking = () => {
    if (!state.selectedDate || !state.selectedTime) {
      toast.error("يرجى اختيار التاريخ والوقت أولاً");
      return;
    }

    if (!state.serviceInfo?.available) {
      toast.error("هذه الخدمة غير متاحة للحجز حالياً");
      return;
    }

    setState((prev) => ({
      ...prev,
      showForm: true,
    }));

    // النزول التلقائي لنموذج الحجز
    setTimeout(() => {
      document.getElementById("appointment-form")?.scrollIntoView({
        behavior: "smooth",
      });
    }, 300);
  };

  // التنقل بين الأشهر
  const handleMonthChange = (direction) => {
    setState((prev) => {
      let newMonth = prev.currentMonth;
      let newYear = prev.currentYear;

      if (direction === "next") {
        if (newMonth === 11) {
          newMonth = 0;
          newYear += 1;
        } else {
          newMonth += 1;
        }
      } else {
        if (newMonth === 0) {
          newMonth = 11;
          newYear -= 1;
        } else {
          newMonth -= 1;
        }
      }

      return {
        ...prev,
        currentMonth: newMonth,
        currentYear: newYear,
        selectedDayIndex: null,
        selectedTime: "",
      };
    });
  };

  // شاشة التحميل
  if (state.loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#3a5b8c] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-500 text-lg">جاري تحميل الخدمة...</p>
        </div>
      </div>
    );
  }

  // شاشة الخطأ لو لم يتم العثور على خدمة
  if (!state.serviceInfo) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">الخدمة غير متاحة</h3>
          <p className="text-gray-500">عذراً، لم نتمكن من العثور على هذه الخدمة</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 py-12"
      dir="rtl"
    >
      {/* ======================================================== */}
      {/* ====== 1. Service Details & Summary Layout (الجديد) ====== */}
      {/* ======================================================== */}
      <div className="flex flex-col lg:flex-row gap-6 mb-12 items-start">
        
        {/* === الجانب الأيمن: تفاصيل الخدمة === */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full lg:w-2/3 bg-[#f0f1f5] rounded-[2rem] p-6 md:p-8 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">تفاصيل الخدمة</h2>
          </div>

          {/* قائمة المميزات */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4">ما يشمله:</h3>
            <ul className="space-y-3">
              {state.serviceInfo.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3 text-gray-700 font-medium text-sm md:text-base">
                  <CheckCircle className="text-green-500 w-5 h-5 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* كروت السعر والمدة */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-[#fdf8ef] rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
              <span className="text-gray-500 text-sm mb-1 font-medium">السعر</span>
              <span className="text-[#1e4b8f] text-2xl font-bold">{state.serviceInfo.fees} جنية</span>
            </div>
            <div className="bg-[#eef2fc] rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
              <Clock className="text-[#1e4b8f] w-6 h-6 mb-2" />
              <span className="text-gray-500 text-sm mb-1 font-medium">مدة الجلسة</span>
              <span className="text-gray-900 text-xl font-bold">{state.serviceInfo.duration}</span>
            </div>
          </div>

          {/* صندوق الأنسب لـ */}
          <div className="bg-[#eafaf1] rounded-2xl p-6 shadow-sm">
            <h3 className="text-gray-800 font-bold mb-2">الأنسب لـ:</h3>
            <p className="text-gray-600 text-sm leading-relaxed font-medium">
              {state.serviceInfo.description}
            </p>
          </div>
        </motion.div>

        {/* === الجانب الأيسر: ملخص الحجز الثابت (Sticky) === */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full lg:w-1/3 bg-[#f0f1f5] rounded-[2rem] p-6 shadow-sm lg:sticky lg:top-28"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">ملخص الحجز</h2>

          <div className="flex flex-col gap-4 mb-8 border-b border-gray-200 pb-6">
            <div className="flex justify-between items-center text-gray-700">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-sm">{state.serviceInfo.title}</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-gray-700">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-sm">{state.serviceInfo.duration}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-500 text-sm font-medium">السعر</span>
            <span className="font-bold text-gray-900">{state.serviceInfo.fees} جنية</span>
          </div>
          <div className="flex justify-between items-center mb-8">
            <span className="text-gray-900 font-bold">المجموع</span>
            <span className="font-bold text-[#1e4b8f] text-xl">{state.serviceInfo.fees} جنية</span>
          </div>

          <button
            onClick={() => document.getElementById('calendar-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full bg-[#2f66f6] hover:bg-[#1c4fd6] text-white py-3.5 rounded-xl font-bold transition-colors flex justify-center items-center gap-2 shadow-md hover:shadow-lg"
          >
            <span>التالي</span>
            <ArrowLeft className="w-5 h-5" />
          </button>
        </motion.div>
      </div>

      {/* ======================================================== */}
      {/* ====== 2. Calendar & TimeSlots (مكوناتك الأصلية) ====== */}
      {/* ======================================================== */}
      <div id="calendar-section">
        {!state.showForm ? (
          <>
            {/* التقويم */}
            <div className="mt-12">
              <Calendar
                currentMonth={state.currentMonth}
                currentYear={state.currentYear}
                selectedDate={state.selectedDate}
                bookedSlots={state.bookedSlots}
                blockedSlots={state.blockedSlots}
                onMonthChange={handleMonthChange}
                onDateSelect={handleDateSelect}
              />
            </div>

            {/* الأوقات المتاحة */}
            {state.selectedDate && (
              <div className="mt-8">
                <TimeSlots
                  selectedDate={state.selectedDate}
                  selectedTime={state.selectedTime}
                  bookedSlots={state.bookedSlots[state.selectedDate] || []}
                  blockedSlots={state.blockedSlots[state.selectedDate] || []}
                  onTimeSelect={handleTimeSelect}
                />
              </div>
            )}

            {/* زر التأكيد */}
            {state.selectedDate && state.selectedTime && (
              <div className="mt-8 text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleConfirmBooking}
                  className="bg-gradient-to-r from-[#1e4b8f] to-[#3a5b8c] text-white text-lg font-bold px-12 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  تأكيد الحجز والمتابعة →
                </motion.button>
              </div>
            )}
          </>
        ) : (
          /* ======================================================== */
          /* =================== 3. Appointment Form ================= */
          /* ======================================================== */
          <div id="appointment-form" className="mt-12">
            <AppointmentForm
              selectedDate={`${state.selectedDate} - ${state.selectedTime}`}
              selectedCategory={state.serviceInfo.category}
              serviceId={state.serviceInfo._id}
              serviceFees={state.serviceInfo.fees}
              serviceInfo={state.serviceInfo}
            />
          </div>
        )}
      </div>

    </motion.div>
  );
};

export default Appointments;