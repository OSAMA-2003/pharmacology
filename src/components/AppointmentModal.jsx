/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  X,
  Video,
  CheckCircle2,
  Clock,
  Calendar as CalendarIcon,
  Check,
  Mail,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import TimeSlots from "./appointment/TimeSlots";
import Calendar from "./appointment/Calender";
import AppointmentForm from "./appointment/AppointmentForm";
import Button from "./common/Button";

// Components (تأكد من مسارات هذه المكونات لديك، ويجب أن يتم تمرير البيانات إليها كـ props بدلاً من Fetching بداخلها)
// import AppointmentForm from "../../components/appointment/AppointmentForm";


// Mock Data للأوقات (للتجربة)
const mockBookedSlotsData = {
  "الجمعة، 27 فبراير 2026": ["10:00 ص", "11:30 ص", "03:00 م"],
};
const mockBlockedSlotsData = {
  "الجمعة، 27 فبراير 2026": ["02:00 م"],
};

const AppointmentModal = ({ isOpen, onClose, serviceInfo }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // الحالة العامة للمودال (Calendar & Time & Form)
  const [state, setState] = useState({
    selectedDate: "",
    selectedTime: "",
    currentMonth: new Date().getMonth(),
    currentYear: new Date().getFullYear(),
    bookedSlots: mockBookedSlotsData,
    blockedSlots: mockBlockedSlotsData,
    // Form Data
    formData: {
      name: "",
      email: "",
      phone: "",
      goals: "",
    },
  });

  // إعادة التعيين عند الفتح/الإغلاق ومنع التمرير
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setState((prev) => ({
        ...prev,
        selectedDate: "",
        selectedTime: "",
        formData: { name: "", email: "", phone: "", goals: "" },
      }));
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !serviceInfo) return null;

  // دوال التقويم والأوقات
  const handleDateSelect = (dateKey) => {
    setState((prev) => ({ ...prev, selectedDate: dateKey, selectedTime: "" }));
  };

  const handleTimeSelect = (time) => {
    if (!state.selectedDate) {
      toast.error("يرجى اختيار التاريخ أولاً");
      return;
    }
    setState((prev) => ({ ...prev, selectedTime: time }));
  };

  const handleMonthChange = (direction) => {
    setState((prev) => {
      let newMonth = prev.currentMonth;
      let newYear = prev.currentYear;
      if (direction === "next") {
        if (newMonth === 11) { newMonth = 0; newYear += 1; } else { newMonth += 1; }
      } else {
        if (newMonth === 0) { newMonth = 11; newYear -= 1; } else { newMonth -= 1; }
      }
      return { ...prev, currentMonth: newMonth, currentYear: newYear, selectedTime: "" };
    });
  };

  // دوال التنقل بين الخطوات
  const handleNext = () => {
    if (step === 2 && (!state.selectedDate || !state.selectedTime)) {
      toast.error("الرجاء اختيار التاريخ والوقت");
      return;
    }
    if (step === 3 && (!state.formData.name || !state.formData.email || !state.formData.phone)) {
      toast.error("الرجاء إكمال البيانات الشخصية المطلوبة");
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handleBack = () => setStep((prev) => prev - 1);

  const handleSubmit = () => {
    setLoading(true);
    // محاكاة طلب API لإرسال البيانات (Form + Date + Time)
    setTimeout(() => {
      setLoading(false);
      setStep(5); // الانتقال لشاشة النجاح
    }, 1500);
  };

  const stepsList = ["تفاصيل الخدمة", "اختر الموعد", "معلوماتك", "التأكيد"];

  const renderStepper = () => (
    <div className="flex items-center justify-between w-full max-w-2xl mx-auto mb-8 bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100">
      {stepsList.map((s, index) => {
        const stepNum = index + 1;
        const isActive = step === stepNum;
        const isCompleted = step > stepNum;

        return (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center gap-2 relative z-10">
              <div
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  isCompleted
                    ? "bg-[#2d1b5a] text-white"
                    : isActive
                    ? "bg-[#2d1b5a] text-white ring-4 ring-[#2d1b5a]/20"
                    : "bg-gray-100 text-gray-400 border border-gray-200"
                }`}
              >
                
                {isCompleted ? <Check size={16} /> : stepNum}
              </div>
              <span
                className={`text-xs md:text-sm font-medium hidden sm:block ${
                  isActive || isCompleted ? "text-[#2d1b5a]" : "text-gray-400"
                }`}
              >
                {s}
              </span>
            </div>
            {index < stepsList.length - 1 && (
              <div
                className={`flex-1 h-[2px] rounded-full mx-2 md:mx-4 ${
                  isCompleted ? "bg-[#2d1b5a]" : "bg-gray-200"
                }`}
              ></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 font-sans" dir="rtl">
        {/* خلفية معتمة للمودال (بدون ثيم داكن، التصميم فاتح كما في الصورة) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={step === 5 ? onClose : undefined} // الإغلاق بالخلفية مسموح فقط في شاشة النجاح
          className="absolute inset-0 bg-[#2d1b5a]/40 backdrop-blur-sm"
        ></motion.div>

        {/* جسم النافذة (أبيض وفاتح) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative w-full max-w-5xl max-h-[95vh] overflow-y-auto bg-[#f8f9fa] rounded-3xl shadow-2xl flex flex-col"
        >
          {step < 5 && (
            <>
              {/* Header */}
              <div className="bg-white p-5 md:p-6 rounded-t-3xl flex justify-between items-center shadow-sm z-10 sticky top-0">
                <div className="flex items-center gap-4">
                  <div className="bg-[#2d1b5a] text-white p-3 rounded-xl shadow-md">
                    <Video size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                      {serviceInfo.title}
                    </h2>
                    <p className="text-gray-500 text-sm hidden sm:block">{serviceInfo.category}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-4 md:p-8 flex-grow">
                {renderStepper()}

                <div className="flex flex-col lg:flex-row gap-6">
                  {/* === Left Content Area (Dynamic Steps) === */}
                  <div className="w-full lg:w-2/3">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* ---------------- STEP 1: Details ---------------- */}
                        {step === 1 && (
                          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">تفاصيل الخدمة</h3>
                            
                            <div className="mb-8">
                              <p className="font-bold text-gray-800 mb-4">ما يشمله:</p>
                              <ul className="space-y-3">
                                {serviceInfo.features?.map((feat, i) => (
                                  <li key={i} className="flex items-center gap-3 text-gray-600">
                                    <CheckCircle2 size={20} className="text-green-500" />
                                    <span>{feat}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                              <div className="bg-[#fdf8ef] p-6 rounded-2xl text-center border border-[#f5e6b3]">
                                <p className="text-gray-500 text-sm mb-1">السعر</p>
                                <p className="text-3xl font-extrabold text-[#2d1b5a]">{serviceInfo.fees} جنية</p>
                              </div>
                              <div className="bg-[#eef2fc] p-6 rounded-2xl text-center border border-[#dbe4ff] flex flex-col items-center justify-center">
                                <Clock size={24} className="text-[#2d1b5a] mb-2" />
                                <p className="text-gray-500 text-sm mb-1">مدة الجلسة</p>
                                <p className="text-2xl font-bold text-gray-900">{serviceInfo.duration}</p>
                              </div>
                            </div>

                            <div className="bg-[#eafaf1] p-6 rounded-2xl border border-[#bbf7d0]">
                              <p className="font-bold text-gray-800 mb-1 text-center">الأنسب لك</p>
                              <p className="text-gray-600 text-center text-sm">{serviceInfo.description}</p>
                            </div>
                          </div>
                        )}

                        {/* ---------------- STEP 2: Calendar & TimeSlots ---------------- */}
                        {step === 2 && (
                          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">اختر الموعد والوقت</h3>
                            
                            {/* استدعاء مكون التقويم الخاص بك */}
                            <div className="mb-8">
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

                            {/* استدعاء مكون الأوقات الخاص بك */}
                            {state.selectedDate && (
                              <div className="border-t border-gray-100 pt-6">
                                <TimeSlots
                                  selectedDate={state.selectedDate}
                                  selectedTime={state.selectedTime}
                                  bookedSlots={state.bookedSlots[state.selectedDate] || []}
                                  blockedSlots={state.blockedSlots[state.selectedDate] || []}
                                  onTimeSelect={handleTimeSelect}
                                />
                              </div>
                            )}
                          </div>
                        )}

                        {/* ---------------- STEP 3: Personal Info (Form) ---------------- */}
                        {step === 3 && (
                          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">معلوماتك الشخصية</h3>
                            
                            {/* إذا كان AppointmentForm مكوناً جاهزاً يقبل props ويعيد data، 
                                يمكنك استخدامه، أو استخدام هذا الـ Form المدمج للسهولة */}
                            <div className="space-y-5">
                              <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">الاسم الكامل *</label>
                                <input 
                                  type="text" 
                                  placeholder="أدخل اسمك الكامل"
                                  value={state.formData.name}
                                  onChange={(e) => setState(prev => ({...prev, formData: {...prev.formData, name: e.target.value}}))}
                                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2d1b5a]/50 outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">البريد الإلكتروني *</label>
                                <input 
                                  type="email" 
                                  placeholder="example@email.com"
                                  value={state.formData.email}
                                  onChange={(e) => setState(prev => ({...prev, formData: {...prev.formData, email: e.target.value}}))}
                                  dir="ltr"
                                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2d1b5a]/50 outline-none text-right"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">رقم الجوال *</label>
                                <input 
                                  type="tel" 
                                  placeholder="+20 1XX XXX XXXX"
                                  value={state.formData.phone}
                                  onChange={(e) => setState(prev => ({...prev, formData: {...prev.formData, phone: e.target.value}}))}
                                  dir="ltr"
                                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2d1b5a]/50 outline-none text-right"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">أهدافك الصحية (اختياري)</label>
                                <textarea 
                                  rows="3"
                                  placeholder="أخبرنا عن أهدافك الصحية أو أي معلومات إضافية..."
                                  value={state.formData.goals}
                                  onChange={(e) => setState(prev => ({...prev, formData: {...prev.formData, goals: e.target.value}}))}
                                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2d1b5a]/50 outline-none resize-none"
                                ></textarea>
                              </div>

                              <div className="bg-[#fffbeb] border border-[#fde68a] p-4 rounded-xl flex items-center gap-3 mt-4">
                                <CheckCircle2 className="text-[#f59e0b] shrink-0" size={20} />
                                <p className="text-sm text-gray-700">سيتم إرسال تأكيد الحجز ورابط الجلسة إلى بريدك الإلكتروني.</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* ---------------- STEP 4: Confirmation ---------------- */}
                        {step === 4 && (
                          <div className="bg-white p-6 md:p-8  rounded-3xl shadow-sm border border-gray-100 text-center">
                            <div className="w-20 h-20 bg-[#2d1b5a] rounded-3xl mx-auto flex items-center justify-center text-white mb-4 shadow-lg rotate-3">
                              <Check size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">تأكيد الحجز</h3>
                            <p className="text-gray-500 mb-8">راجع تفاصيل حجزك قبل التأكيد</p>
                            
                            <div className="bg-[#f8f9fa] rounded-2xl p-6 text-right mb-4 border border-gray-100 flex items-center justify-between">
                              <div>
                                <p className="font-bold text-gray-900 text-lg mb-1">{serviceInfo.title}</p>
                                <p className="text-gray-500 text-sm">{serviceInfo.duration} - جلسة صوت/فيديو</p>
                              </div>
                              <div className="bg-[#2d1b5a] text-white p-3 rounded-xl"><Video size={24}/></div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                               <div className="bg-[#fef2f2] rounded-2xl p-5 text-right border border-[#fee2e2]">
                                  <p className="text-sm text-gray-500 mb-2 flex items-center gap-2"><Clock size={16}/> الوقت</p>
                                  <p className="font-bold text-gray-900 text-lg">{state.selectedTime || "لم يحدد"}</p>
                               </div>
                               <div className="bg-[#ecfdf5] rounded-2xl p-5 text-right border border-[#d1fae5]">
                                  <p className="text-sm text-gray-500 mb-2 flex items-center gap-2"><CalendarIcon size={16}/> التاريخ</p>
                                  <p className="font-bold text-gray-900 text-lg">{state.selectedDate || "لم يحدد"}</p>
                               </div>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-6 text-right border border-gray-100 mb-6">
                              <div className="grid grid-cols-2 gap-y-4 text-sm">
                                <div><p className="text-gray-500">الاسم</p><p className="font-bold">{state.formData.name || "---"}</p></div>
                                <div><p className="text-gray-500">رقم الجوال</p><p className="font-bold" dir="ltr">{state.formData.phone || "---"}</p></div>
                                <div className="col-span-2"><p className="text-gray-500">البريد الإلكتروني</p><p className="font-bold">{state.formData.email || "---"}</p></div>
                              </div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* === Right Sidebar: Booking Summary (Sticky) === */}
                  <div className="w-full lg:w-1/3">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 lg:sticky lg:top-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-6 text-center">ملخص الحجز</h3>
                      
                      <div className="space-y-4 mb-8">
                        <div className="flex items-center gap-3 text-gray-600">
                          <Video size={18} className="text-gray-400" />
                          <span className="text-sm font-medium">{serviceInfo.title}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600">
                          <Clock size={18} className="text-gray-400" />
                          <span className="text-sm font-medium">{serviceInfo.duration}</span>
                        </div>
                        {state.selectedDate && (
                          <div className="flex items-center gap-3 text-gray-600">
                            <CalendarIcon size={18} className="text-[#2d1b5a]" />
                            <span className="text-sm font-bold text-[#2d1b5a]">{state.selectedDate}</span>
                          </div>
                        )}
                        {state.selectedTime && (
                          <div className="flex items-center gap-3 text-gray-600">
                            <Clock size={18} className="text-[#2d1b5a]" />
                            <span className="text-sm font-bold text-[#2d1b5a]">{state.selectedTime}</span>
                          </div>
                        )}
                      </div>

                      <div className="border-t border-gray-100 pt-6 mb-8">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-500">السعر</span>
                          <span className="font-bold text-gray-900">{serviceInfo.fees} جنية</span>
                        </div>
                        <div className="flex justify-between items-center text-lg">
                          <span className="font-bold text-gray-900">المجموع</span>
                          <span className="font-extrabold text-[#2d1b5a] text-2xl">{serviceInfo.fees} جنية</span>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        {step > 1 && (
                          <button
                            onClick={handleBack}
                            className="w-1/4 py-4 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
                          >
                            <ArrowRight size={20} />
                          </button>
                        )}
                        <button
                          onClick={step === 4 ? handleSubmit : handleNext}
                          disabled={loading}
                          className="flex-1 py-4 rounded-xl font-bold text-white bg-[#2d1b5a] hover:bg-[#3f267a] shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                          {loading ? (
                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                          ) : step === 4 ? (
                            "تأكيد الحجز"
                          ) : (
                            <>التالي <ArrowLeft size={20} /></>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ================= STEP 5: Success Popup ================= */}
          {step === 5 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-4 md:p-8 text-center relative "
            >
              {/* زخرفة خلفية */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="w-24 h-24 bg-green-500 rounded-full mx-auto flex items-center justify-center text-white mb-6 shadow-[0_0_30px_rgba(34,197,94,0.4)] relative z-10">
                <Check size={50} strokeWidth={3} />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 relative z-10">
                تم تأكيد الحجز بنجاح!
              </h2>
              <p className="text-gray-500 text-lg mb-10 relative z-10">شكراً لك {state.formData.name}</p>

              <div className="bg-[#f8f9fa] rounded-2xl p-6 border border-gray-100 max-w-md mx-auto mb-6 relative z-10 text-right">
                 <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                    <div>
                      <p className="text-gray-500 text-sm mb-1">موعد الجلسة</p>
                      <p className="font-bold text-gray-900">{state.selectedDate}</p>
                    </div>
                    <CalendarIcon className="text-[#2d1b5a]" size={24}/>
                 </div>
                 <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm mb-1">الوقت</p>
                      <p className="font-bold text-[#2d1b5a]">{state.selectedTime} <span className="text-xs text-gray-400 font-normal">(بتوقيت القاهرة)</span></p>
                    </div>
                    <Clock className="text-[#2d1b5a]" size={24}/>
                 </div>
              </div>

              <div className="bg-[#fff9e6] rounded-2xl p-6 border border-[#fde68a] max-w-md mx-auto mb-10 relative z-10 flex items-start gap-4 text-right">
                <div className="p-3 bg-[#f59e0b] text-white rounded-xl shrink-0"><Mail size={20}/></div>
                <div>
                  <p className="font-bold text-gray-800 mb-1">تم إرسال التأكيد إلى</p>
                  <p className="font-bold text-gray-900 mb-2" dir="ltr">{state.formData.email}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">ستصلك رسالة تأكيد تحتوي على رابط الجلسة وجميع التفاصيل المهمة.</p>
                </div>
              </div>

              <Button 
                onClick={onClose}
                className="w-full max-w-md mx-auto py-4 rounded-xl font-bold text-white bg-[#2d1b5a] hover:bg-[#3f267a] shadow-xl transition-all relative z-10 block"
              >
                العودة للصفحة الرئيسية
              </Button>
            </motion.div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AppointmentModal;