/* eslint-disable no-unused-vars */
import React, { useContext, useState, useEffect } from "react";
import { authApi } from "../../api/auth.api";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { AppContext } from "../../context/AppContext";
import { Mail, Lock, User, UserPlus, LogIn, CheckCircle2 } from "lucide-react"; // تم استيراد أيقونات lucide-react

const Login = () => {
  const { setToken } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [state, setState] = useState({
    formType: "Sign Up",
    email: "",
    password: "",
    name: "",
    loading: false,
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, loading: true }));

    try {
      let response;

      if (state.formType === "Sign Up") {
        response = await authApi.register({
          name: state.name,
          email: state.email,
          password: state.password,
        });

        if (response.success) {
          localStorage.setItem("token", response.token);
          localStorage.setItem("user", JSON.stringify(response.user));
          setToken(response.token);
          toast.success("🎉 تم إنشاء الحساب بنجاح");

          navigate(from, { replace: true });
        } else {
          toast.error(response.message);
        }
      } else {
        response = await authApi.login({
          email: state.email,
          password: state.password,
        });

        if (response.success) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          setToken(response.data.token);
          toast.success("✅ تم تسجيل الدخول بنجاح");

          navigate(from, { replace: true });
        } else {
          toast.error(response.message);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  // مسح حقل الاسم عند التبديل إلى تسجيل الدخول
  useEffect(() => {
    if (state.formType === "Login") {
      setState((prev) => ({ ...prev, name: "" }));
    }
  }, [state.formType]);

  return (
    // الخلفية الداكنة المتماشية مع التصميم
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="min-h-screen flex items-center justify-center pt-32 pb-16 px-4 font-sans relative overflow-hidden"
      dir="rtl"
    >
     
      <motion.form
        key={state.formType}
        onSubmit={handleSubmit}
        variants={formVariants}
        initial="hidden"
        animate="visible"
        // تصميم زجاجي (Glassmorphism)
        className="relative z-10 flex flex-col gap-5 p-8 sm:p-10 w-full max-w-md border border-white/10 rounded-[2.5rem] shadow-[0_0_40px_rgba(0,0,0,0.5)] bg-white/5 backdrop-blur-xl"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-4">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-[#8349c7] to-[#9b61db] text-white shadow-lg border border-white/20">
            {state.formType === "Sign Up" ? <UserPlus size={32} /> : <LogIn size={32} />}
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            {state.formType === "Sign Up" ? "إنشاء حساب جديد" : "تسجيل الدخول"}
          </h2>
          <p className="text-gray-400 text-sm">
            {state.formType === "Sign Up"
              ? "انضم إلينا وابدأ رحلة العناية بصحتك"
              : "مرحباً بعودتك! سجل دخولك الآن"}
          </p>
        </motion.div>

        {/* Name Field (Sign Up only) */}
        <AnimatePresence mode="wait">
          {state.formType === "Sign Up" && (
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
                <User size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  className="border border-white/10 bg-[#0a051d]/50 rounded-xl w-full pr-12 pl-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#9b61db] focus:ring-1 focus:ring-[#9b61db] transition-all"
                  type="text"
                  value={state.name}
                  onChange={(e) =>
                    setState((prev) => ({ ...prev, name: e.target.value }))
                  }
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
            <Mail size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              className="border border-white/10 bg-[#0a051d]/50 rounded-xl w-full pr-12 pl-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#9b61db] focus:ring-1 focus:ring-[#9b61db] transition-all"
              type="email"
              value={state.email}
              onChange={(e) =>
                setState((prev) => ({ ...prev, email: e.target.value }))
              }
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
            <Lock size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              className="border border-white/10 bg-[#0a051d]/50 rounded-xl w-full pr-12 pl-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#9b61db] focus:ring-1 focus:ring-[#9b61db] transition-all"
              type="password"
              value={state.password}
              onChange={(e) =>
                setState((prev) => ({ ...prev, password: e.target.value }))
              }
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
          disabled={state.loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-r from-[#8349c7] to-[#9b61db] border border-white/10 text-white w-full py-4 rounded-xl text-lg font-bold hover:shadow-[0_0_20px_rgba(155,97,219,0.4)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
        >
          {state.loading ? (
            <div className="flex items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              {state.formType === "Sign Up"
                ? "جاري الإنشاء..."
                : "جاري تسجيل الدخول..."}
            </div>
          ) : state.formType === "Sign Up" ? (
            "إنشاء حساب"
          ) : (
            "تسجيل الدخول"
          )}
        </motion.button>

        {/* Toggle between Sign Up/Login */}
        <motion.div variants={itemVariants} className="text-center mt-2">
          {state.formType === "Sign Up" ? (
            <p className="text-gray-400">
              لديك حساب بالفعل؟{" "}
              <span
                onClick={() =>
                  setState((prev) => ({ ...prev, formType: "Login" }))
                }
                className="text-[#9b61db] font-bold cursor-pointer hover:text-white transition-colors"
              >
                سجل الدخول هنا
              </span>
            </p>
          ) : (
            <p className="text-gray-400">
              ليس لديك حساب؟{" "}
              <span
                onClick={() =>
                  setState((prev) => ({ ...prev, formType: "Sign Up" }))
                }
                className="text-[#9b61db] font-bold cursor-pointer hover:text-white transition-colors"
              >
                انشئ حساباً جديداً
              </span>
            </p>
          )}
        </motion.div>

        {/* Features Section */}
        <motion.div
          variants={itemVariants}
          className="mt-4 pt-6 border-t border-white/10"
        >
          <p className="text-gray-300 font-bold mb-4 text-center">مزايا التسجيل معنا:</p>
          <ul className="text-gray-400 text-sm space-y-3 px-2">
            {[
              "حجز استشارات فردية ومتابعتها",
              "شراء الدورات التدريبية المعتمدة",
              "طلب المكملات الغذائية بسهولة"
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