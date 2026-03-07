/* eslint-disable no-unused-vars */
import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, User, Heart, ArrowRight, Calendar, ChevronDown } from "lucide-react";

const Login = () => {
  const { token, login, register, loading: authLoading } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Unified state for multi-step form
  const [state, setState] = useState({
    formType: "Sign Up",
    step: 1, // 1, 2, or 3
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    gender: "أنثي",
    birthdate: "",
    height: "",
    weight: "",
    city: "",
    address: "",
    healthGoal: "",
  });

  // Framer Motion Variants
  const pageVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.3 } },
  };

  const stepVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, x: 20, transition: { duration: 0.3 } },
  };

  useEffect(() => {
    // Redirect if already logged in
    if (token) {
      const from = location.state?.from?.pathname || "/";
      navigate(from);
    }
  }, [token, navigate, location]);

  const handleNextStep = (e) => {
    e.preventDefault();
    if (state.formType === "Sign Up" && state.step < 3) {
      // Move to next step
      setState((prev) => ({ ...prev, step: prev.step + 1 }));
    } else {
      // Submit the final form
      onSubmitHandler();
    }
  };

  const onSubmitHandler = async () => {
    if (state.formType === "Login") {
      await login(state.email, state.password);
    } else {
      if (state.password !== state.confirmPassword) {
        toast.error("كلمات المرور غير متطابقة");
        return;
      }
      // Note: Make sure your `register` function in AppContext is updated 
      // to accept these new fields (gender, height, weight, etc.) if needed!
      await register(state.name, state.email, state.password);
    }
  };

  const toggleFormType = () => {
    setState((prev) => ({
      ...prev,
      formType: prev.formType === "Sign Up" ? "Login" : "Sign Up",
      step: 1, // Reset to step 1 when switching
    }));
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="min-h-screen flex items-center justify-center py-10 px-4 relative overflow-hidden "
      style={{ backgroundColor: "#1B113D" }} // Matches screenshot background
      dir="rtl"
    >
      {/* Subtle Background Glow */}

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 right-6 hidden md:flex items-center gap-2 text-white hover:text-gray-300 transition-colors z-20"
      >  
      <ArrowRight size={20} />
        <span>رجوع</span>
      
      </button>

      <motion.div
        key={state.formType + state.step}
        className="w-full max-w-[600px] z-10"
      >
        <div
          className="rounded-[24px] p-8 md:p-12 shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/5"
          style={{ backgroundColor: "#26174A" }} // Matches screenshot card
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-4 drop-shadow-sm">دكتور أحمد</h1>
            <h2 className="text-xl font-bold text-[#A564D3] mb-2">
              {state.formType === "Sign Up" ? "انشاء حساب جديد" : "تسجيل الدخول"}
            </h2>
            <p className="text-gray-300 text-sm">
              ابدأ رحلتك الصحية مع دكتور أحمد الخطيب
            </p>
          </div>

          {/* Progress Stepper (Only for Sign Up) */}
          {state.formType === "Sign Up" && (
            <div className="flex items-start justify-center w-full px-4 mb-10" dir="ltr">
              {/* Step 3 */}
              <div className="flex flex-col items-center flex-1">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${state.step >= 3 ? 'bg-[#9853D8] text-white shadow-lg shadow-[#9853D8]/30' : 'bg-[#1B113D] text-gray-400 border border-white/5'}`}>
                  <Heart size={20} />
                </div>
                <span className="text-xs text-gray-400 mt-3">تفاصيل حالتك</span>
              </div>

              <div className="w-16 md:w-20 h-[2px] mt-6 bg-gray-500/30"></div>

              {/* Step 2 */}
              <div className="flex flex-col items-center flex-1">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${state.step >= 2 ? 'bg-[#9853D8] text-white shadow-lg shadow-[#9853D8]/30' : 'bg-[#1B113D] text-gray-400 border border-white/5'}`}>
                  <User size={20} />
                </div>
                <span className="text-xs text-gray-400 mt-3">تفاصيل شخصيه</span>
              </div>

              <div className="w-16 md:w-20 h-[2px] mt-6 bg-gray-500/30"></div>

              {/* Step 1 */}
              <div className="flex flex-col items-center flex-1">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#9853D8] text-white shadow-lg shadow-[#9853D8]/30 border border-white/5">
                  <Lock size={20} />
                </div>
                <span className="text-xs text-gray-400 mt-3">تفاصيل الحساب</span>
              </div>
            </div>
          )}

          <form onSubmit={handleNextStep} className="flex flex-col gap-5">
            {/* --- SIGN UP FLOW --- */}
            {state.formType === "Sign Up" && (
              <>
                {/* STEP 1 */}
                {state.step === 1 && (
                  <AnimatePresence mode="wait">
                    <motion.div variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col gap-5">
                      <div className="flex items-center gap-2 text-[#A564D3] mb-2 border-b border-white/5 pb-3">
                        <Lock size={18} />
                        <span className="font-semibold">تفاصيل الحساب</span>
                      </div>
                      
                      <div className="text-right">
                        <label className="block text-white text-sm font-semibold mb-2">الإسم كامل</label>
                        <input
                          type="text"
                          required
                          value={state.name}
                          onChange={(e) => setState({ ...state, name: e.target.value })}
                          placeholder="ادخل اسمك كامل"
                          className="w-full bg-[#1B113D]/50 border border-[#443068] rounded-xl p-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#9853D8] transition-colors"
                        />
                      </div>
                      <div className="text-right">
                        <label className="block text-white text-sm font-semibold mb-2">البريد الإلكتروني</label>
                        <input
                          type="email"
                          required
                          value={state.email}
                          onChange={(e) => setState({ ...state, email: e.target.value })}
                          placeholder="ادخل بريدك الإلكتروني"
                          className="w-full bg-[#1B113D]/50 border border-[#443068] rounded-xl p-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#9853D8] text-right transition-colors"
                          dir="rtl"
                        />
                      </div>
                      <div className="text-right">
                        <label className="block text-white text-sm font-semibold mb-2">كلمه المرور</label>
                        <input
                          type="password"
                          required
                          value={state.password}
                          onChange={(e) => setState({ ...state, password: e.target.value })}
                          placeholder="ادخل كلمه المرور"
                          className="w-full bg-[#1B113D]/50 border border-[#443068] rounded-xl p-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#9853D8] text-right transition-colors"
                        />
                      </div>
                      <div className="text-right">
                        <label className="block text-white text-sm font-semibold mb-2">تأكيد كلمه المرور</label>
                        <input
                          type="password"
                          required
                          value={state.confirmPassword}
                          onChange={(e) => setState({ ...state, confirmPassword: e.target.value })}
                          placeholder="ادخل كلمه المرور"
                          className="w-full bg-[#1B113D]/50 border border-[#443068] rounded-xl p-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#9853D8] text-right transition-colors"
                        />
                      </div>
                    </motion.div>
                  </AnimatePresence>
                )}

                {/* STEP 2 */}
                {state.step === 2 && (
                  <AnimatePresence mode="wait">
                    <motion.div variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col gap-5">
                      <div className="flex items-center gap-2 text-[#A564D3] mb-2 border-b border-white/5 pb-3">
                        <User size={18} />
                        <span className="font-semibold">تفاصيل شخصيه</span>
                      </div>

                      <div className="flex gap-4 mb-2">
                        <button
                          type="button"
                          onClick={() => setState({ ...state, gender: "أنثي" })}
                          className={`flex-1 py-3.5 rounded-xl border flex items-center justify-center gap-2 transition-all ${state.gender === "أنثي" ? "bg-[#9853D8] border-[#9853D8] text-white" : "bg-[#1B113D]/50 border-[#443068] text-gray-300"}`}
                        >
                          <span className="text-lg">♀</span> أنثي
                        </button>
                        <button
                          type="button"
                          onClick={() => setState({ ...state, gender: "ذكر" })}
                          className={`flex-1 py-3.5 rounded-xl border flex items-center justify-center gap-2 transition-all ${state.gender === "ذكر" ? "bg-[#9853D8] border-[#9853D8] text-white" : "bg-[#1B113D]/50 border-[#443068] text-gray-300"}`}
                        >
                          <span className="text-lg">♂</span> ذكر
                        </button>
                      </div>

                      <div className="text-right" >
                        <label className="block text-white text-sm font-semibold mb-2">تاريخ الميلاد</label>
                        <div className="relative">
                          <input
                         
                            type="text"
                            onFocus={(e) => (e.target.type = "date")}
                            onBlur={(e) => { if (!e.target.value) e.target.type = "text" }}
                            required
                            value={state.birthdate}
                            onChange={(e) => setState({ ...state, birthdate: e.target.value })}
                            placeholder="ادخل تاريخ ميلادك"
                            className="w-full bg-[#1B113D]/50 border border-[#443068] rounded-xl p-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#9853D8] text-right transition-colors"
                          />
                        </div>
                      </div>

                      <div className="text-right">
                        <label className="block text-white text-sm font-semibold mb-2">الطول</label>
                        <div className="relative">
                          <input
                            type="number"
                            required
                            value={state.height}
                            onChange={(e) => setState({ ...state, height: e.target.value })}
                            placeholder="ادخل طولك بال Cm"
                            className="w-full bg-[#1B113D]/50 border border-[#443068] rounded-xl p-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#9853D8] pr-4 pl-10 transition-colors"
                          />
                        </div>
                      </div>
                           

                      <div className="text-right">
                        <label className="block text-white text-sm font-semibold mb-2">الوزن</label>
                        <div className="relative">
                          <input
                            type="number"
                            placeholder="KG"
                            required
                            value={state.weight}
                            onChange={(e) => setState({ ...state, weight: e.target.value })}
                            className="w-full bg-[#1B113D]/50 border border-[#443068] rounded-xl p-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#9853D8] pr-4 pl-10 transition-colors"
                          >
                           </input>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                )}

                {/* STEP 3 */}
                {state.step === 3 && (
                  <AnimatePresence mode="wait">
                    <motion.div variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col gap-5">
                      <div className="flex items-center gap-2 text-[#A564D3] mb-2 border-b border-white/5 pb-3">
                        <Heart size={18} />
                        <span className="font-semibold">تفاصيل حالتك</span>
                      </div>

                      <div className="text-right">
                        <label className="block text-white text-sm font-semibold mb-2">البلد</label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="مصر"
                            required
                            value={state.city}
                            onChange={(e) => setState({ ...state, city: e.target.value })}
                            className="w-full bg-[#1B113D]/50 border border-[#443068] rounded-xl p-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#9853D8] pr-4 pl-10 transition-colors"
                          ></input>
                        </div>
                      </div>

                      <div className="text-right">
                        <label className="block text-white text-sm font-semibold mb-2"> المدينة </label>
                        <div className="relative">
                          <input
                            type="text"
                              placeholder="القاهرة"
                            required
                            value={state.address}
                            onChange={(e) => setState({ ...state, address: e.target.value })}
                            className="w-full bg-[#1B113D]/50 border border-[#443068] rounded-xl p-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#9853D8] pr-4 pl-10 transition-colors"
                          >
                           </input>
                        </div>
                      </div>

                      <div className="text-right">
                        <label className="block text-white text-sm font-semibold mb-2">الهدف الصحي</label>
                        <div className="relative">
                          <input
                          type="text"
                          placeholder="تنظيم الغذاء"
                            required
                            value={state.healthGoal}
                            onChange={(e) => setState({ ...state, healthGoal: e.target.value })}
                            className="w-full bg-[#1B113D]/50 border border-[#443068] rounded-xl p-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#9853D8] pr-4 pl-10 transition-colors"
                          >
                            </input>
                        </div>
                      </div>

                      
                      <div className="text-right">
                        <label className="block text-white text-sm font-semibold mb-2"> هل تعاني من اي امراض ؟</label>
                        <div className="relative">
                          <input
                          type="text"
                          placeholder="لا / نعم,عندي مرض السكر"
                            required
                            value={state.healthGoal}
                            onChange={(e) => setState({ ...state, healthGoal: e.target.value })}
                            className="w-full bg-[#1B113D]/50 border border-[#443068] rounded-xl p-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#9853D8] pr-4 pl-10 transition-colors"
                          >
                            </input>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                )}
              </>
            )}

            {/* --- LOGIN FLOW --- */}
            {state.formType === "Login" && (
              <AnimatePresence mode="wait">
                <motion.div variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col gap-5">
                  <div className="text-right">
                    <label className="block text-white text-sm font-semibold mb-2">البريد الإلكتروني</label>
                    <input
                      type="email"
                      required
                      value={state.email}
                      onChange={(e) => setState({ ...state, email: e.target.value })}
                      placeholder="ادخل بريدك الإلكتروني"
                      className="w-full bg-[#1B113D]/50 border border-[#443068] rounded-xl p-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#9853D8] text-right transition-colors"
                      dir="rtl"
                    />
                  </div>
                  <div className="text-right">
                    <label className="block text-white text-sm font-semibold mb-2">كلمه المرور</label>
                    <input
                      type="password"
                      required
                      value={state.password}
                      onChange={(e) => setState({ ...state, password: e.target.value })}
                      placeholder="ادخل كلمه المرور"
                      className="w-full bg-[#1B113D]/50 border border-[#443068] rounded-xl p-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#9853D8] text-right transition-colors"
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            )}

            {/* Submit / Next Button */}
            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-[#A564D3] hover:bg-[#9250BF] text-white font-bold text-lg py-4 rounded-xl mt-6 transition-all duration-300 shadow-lg shadow-[#A564D3]/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {authLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              ) : state.formType === "Sign Up" && state.step < 3 ? (
                "التالى"
              ) : state.formType === "Sign Up" && state.step === 3 ? (
                "إنشاء حساب" 
              ) : (
                "تسجيل الدخول"
              )}
            </button>

            {/* Toggle Link */}
            <div className="text-center mt-6">
              <span className="text-gray-400 text-sm">
                {state.formType === "Sign Up" ? "بالفعل لديك حساب؟ " : "ليس لديك حساب؟ "}
                <button
                  type="button"
                  onClick={toggleFormType}
                  className="text-white hover:text-[#A564D3] transition-colors font-semibold"
                >
                  {state.formType === "Sign Up" ? "ادخل الآن" : "انشئ حساباً جديداً"}
                </button>
              </span>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Login;