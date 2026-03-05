/* eslint-disable no-unused-vars */
import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, UserPlus, LogIn, CheckCircle2 } from "lucide-react"; // إضافة الأيقونات الاحترافية

const Login = () => {
  const { token, login, register, loading: authLoading } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [state, setState] = useState("Login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // حركات Framer Motion
  const pageVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.3 },
    },
  };

  const formVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const nameFieldVariants = {
    hidden: { opacity: 0, height: 0, marginBottom: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      marginBottom: "1rem",
      transition: { duration: 0.4, ease: "easeInOut" },
    },
    exit: {
      opacity: 0,
      height: 0,
      marginBottom: 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // --- FRONTEND MOCK & BACKEND HOOK ---
    // The `login` function is now handled by AppContext.
    // The context will perform the mock logic.
    // TODO (Backend Developer): The real API call is inside `AppContext.js`.
    if (state === "Login") {
      await login(email, password);
    } else {
      // Use the new register function from context
      await register(name, email, password);
    }
  };

  useEffect(() => {
    // This effect redirects the user if they are already logged in.
    if (token) {
      const from = location.state?.from?.pathname || "/";
      navigate(from);
    }
  }, [token, navigate, location]);

  useEffect(() => {
    if (state === "Login") {
      // Clear name field when switching to login form
      setName("");
    }
  }, [state]);

  return (
    // استخدام الخلفية الداكنة الموحدة مع إضاءة خافتة
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="min-h-screen flex items-center justify-center pt-32 pb-16 px-4  relative overflow-hidden"
      dir="rtl"
    >
      {/* تأثيرات إضاءة في الخلفية */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-[#2d1b5a]/30 via-transparent to-transparent pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-[#13072e]/40 to-transparent pointer-events-none"></div>

      <motion.form
        key={state}
        onSubmit={onSubmitHandler}
        variants={formVariants}
        initial="hidden"
        animate="visible"
        // تصميم زجاجي (Glassmorphism) للكارت
        className="relative z-10 flex flex-col gap-5 p-8 w-full max-w-md border border-white/10 rounded-[2rem] text-gray-300 text-sm shadow-[0_0_40px_rgba(0,0,0,0.5)] bg-white/5 backdrop-blur-xl"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-4">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-[#8349c7] to-[#9b61db] text-white shadow-lg shadow-[#9b61db]/30 border border-white/20">
            {state === "Sign Up" ? <UserPlus size={32} /> : <LogIn size={32} />}
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            {state === "Sign Up" ? "إنشاء حساب جديد" : "تسجيل الدخول"}
          </h2>
          <p className="text-gray-400 text-base">
            {state === "Sign Up"
              ? "انضم إلينا وابدأ رحلة العناية بصحتك"
              : "مرحباً بعودتك! سجل دخولك الآن"}
          </p>
        </motion.div>

        {/* Name Field (Sign Up only) */}
        <AnimatePresence mode="wait">
          {state === "Sign Up" && (
            <motion.div
              key="name-field"
              variants={nameFieldVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full overflow-hidden"
            >
              <label className="block text-gray-300 font-medium mb-2 text-sm">
                الاسم الكامل
              </label>
              <div className="relative">
                <User size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  className="border border-white/10 bg-[#0a051d]/50 rounded-xl w-full pr-12 pl-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#9b61db] focus:ring-1 focus:ring-[#9b61db] transition-all"
                  type="text"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  required
                  placeholder="أدخل اسمك الكامل"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Email Field */}
        <motion.div variants={itemVariants} className="w-full">
          <label className="block text-gray-300 font-medium mb-2 text-sm">
            البريد الإلكتروني
          </label>
          <div className="relative">
            <Mail size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="border border-white/10 bg-[#0a051d]/50 rounded-xl w-full pr-12 pl-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#9b61db] focus:ring-1 focus:ring-[#9b61db] transition-all"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
              placeholder="example@email.com"
              dir="ltr"
            />
          </div>
        </motion.div>

        {/* Password Field */}
        <motion.div variants={itemVariants} className="w-full">
          <label className="block text-gray-300 font-medium mb-2 text-sm">
            كلمة المرور
          </label>
          <div className="relative">
            <Lock size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="border border-white/10 bg-[#0a051d]/50 rounded-xl w-full pr-12 pl-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#9b61db] focus:ring-1 focus:ring-[#9b61db] transition-all"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
              placeholder="••••••••"
              dir="ltr"
            />
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.button
          variants={itemVariants}
          type="submit"
          disabled={authLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-r from-[#8349c7] to-[#9b61db] text-white w-full py-4 rounded-xl text-lg font-bold hover:shadow-[0_0_20px_rgba(155,97,219,0.4)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed mt-4 border border-white/10"
        >
          {authLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              {state === "Sign Up" ? "جاري الإنشاء..." : "جاري تسجيل الدخول..."}
            </div>
          ) : state === "Sign Up" ? (
            "إنشاء حساب"
          ) : (
            "تسجيل الدخول"
          )}
        </motion.button>

        {/* Toggle State */}
        <motion.div variants={itemVariants} className="text-center mt-2">
          {state === "Sign Up" ? (
            <p className="text-gray-400">
              لديك حساب بالفعل؟{" "}
              <span
                onClick={() => setState("Login")}
                className="text-[#9b61db] font-bold cursor-pointer hover:text-white transition-colors"
              >
                سجل الدخول هنا
              </span>
            </p>
          ) : (
            <p className="text-gray-400">
              ليس لديك حساب؟{" "}
              <span
                onClick={() => setState("Sign Up")}
                className="text-[#9b61db] font-bold cursor-pointer hover:text-white transition-colors"
              >
                انشئ حساباً جديداً
              </span>
            </p>
          )}
        </motion.div>

        {/* Features Box */}
        <motion.div
          variants={itemVariants}
          className="mt-4 pt-6 border-t border-white/10"
        >
          <p className="text-gray-300 font-bold mb-4 text-center">مزايا حسابك:</p>
          <ul className="text-gray-400 text-sm space-y-3 px-2">
            {[
              "حجز وإدارة المواعيد بكل سهولة",
              "متابعة دوراتك التدريبية (الكورسات)",
              "تتبع طلبات المنتجات وإضافتها للمفضلة"
            ].map((feature, index) => (
              <li key={index} className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-[#9b61db]" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </motion.div>

      </motion.form>
    </motion.div>
  );
};

export default Login;