import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import {
  mockGetUserAppointments,
  mockCancelAppointment,
  mockInitiatePayment,
  mockVerifyPayment
} from "./testUser";

// ============================================================
// MyAppointments Component
//
// TODO (Backend Developer):
// - Replace mock imports with real API calls:
//   import { appointmentApi } from "../../api/appointment.api";
//   import { paymentApi } from "../../api/payment.api";
// - Replace mock token with real context:
//   const { token } = useContext(AppContext);
// - Replace loadAppointments() to call appointmentApi.getUserAppointments()
// - Replace handlePayment() to call paymentApi.initiatePayment()
// - Replace verifyPayment() to call paymentApi.verifyPayment()
// - Replace handleCancelAppointment() to call appointmentApi.cancelAppointment()
// ============================================================

const MyAppointments = () => {
  const { token } = useContext(AppContext);
  // ---- END MOCK ----

  const [state, setState] = useState({
    appointments: [],
    loading: false,
    paymentLoading: null,
    showCancelModal: false,
    selectedAppointmentId: null,
  });

  // Load appointments
  const loadAppointments = async () => {
    if (!token) return;

    setState((prev) => ({ ...prev, loading: true }));
    try {
      // TODO (Backend): Replace with: const response = await appointmentApi.getUserAppointments();
      const response = await mockGetUserAppointments();

      if (response.success) {
        setState((prev) => ({ ...prev, appointments: response.appointments }));
      } else {
        toast.error("حدث خطأ في تحميل المواعيد");
      }
    } catch (error) {
      console.error("Error loading appointments:", error);
      toast.error("حدث خطأ في تحميل المواعيد");
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  // Handle payment
  const handlePayment = async (appointmentId) => {
    setState((prev) => ({ ...prev, paymentLoading: appointmentId }));

    try {
      // TODO (Backend): Replace with: const response = await paymentApi.initiatePayment(appointmentId);
      const response = await mockInitiatePayment(appointmentId);

      if (!response.success) {
        toast.error(response.message || "فشل بدء عملية الدفع");
        setState((prev) => ({ ...prev, paymentLoading: null }));
        return;
      }

      // MOCK: Instead of opening a real popup, simulate payment success
      // TODO (Backend): Uncomment the real popup logic below and remove mock simulation
      /*
      const newWindow = window.open(
        response.paymentUrl,
        "PaymobPayment",
        "width=600,height=700,scrollbars=yes"
      );

      if (!newWindow) {
        toast.error("يرجى السماح بالنوافذ المنبثقة للمتابعة");
        setState((prev) => ({ ...prev, paymentLoading: null }));
        return;
      }

      toast.info("جاري فتح نافذة الدفع...");

      const checkInterval = setInterval(async () => {
        if (newWindow.closed) {
          clearInterval(checkInterval);
          await verifyPayment(appointmentId);
          setState((prev) => ({
            ...prev,
            paymentLoading: null,
          }));
        }
      }, 1000);
      */

      // MOCK: Simulate payment process
      toast.info("جاري معالجة الدفع (محاكاة)...");
      await verifyPayment(appointmentId);
      setState((prev) => ({ ...prev, paymentLoading: null }));
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("حدث خطأ أثناء الدفع");
      setState((prev) => ({ ...prev, paymentLoading: null }));
    }
  };

  // Verify payment
  const verifyPayment = async (appointmentId) => {
    try {
      // TODO (Backend): Replace with: const response = await paymentApi.verifyPayment(appointmentId);
      const response = await mockVerifyPayment(appointmentId);

      if (response.paid) {
        toast.success("تم الدفع بنجاح! ✅");
        // Update local state to reflect payment
        setState((prev) => ({
          ...prev,
          appointments: prev.appointments.map((appt) =>
            appt._id === appointmentId ? { ...appt, paid: true } : appt
          ),
        }));
      }
    } catch (error) {
      console.error("Verification error:", error);
    }
  };

  // Cancel appointment
  const handleCancelAppointment = async () => {
    if (!state.selectedAppointmentId) return;

    try {
      // TODO (Backend): Replace with: const response = await appointmentApi.cancelAppointment(state.selectedAppointmentId);
      const response = await mockCancelAppointment(state.selectedAppointmentId);

      if (response.success) {
        toast.success("تم إلغاء الموعد بنجاح");
        // Update local state to reflect cancellation
        setState((prev) => ({
          ...prev,
          showCancelModal: false,
          selectedAppointmentId: null,
          appointments: prev.appointments.map((appt) =>
            appt._id === prev.selectedAppointmentId
              ? { ...appt, status: "cancelled" }
              : appt
          ),
        }));
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Cancel error:", error);
      toast.error("حدث خطأ أثناء الإلغاء");
    }
  };

  useEffect(() => {
    loadAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        badge: "bg-yellow-500",
        text: "قيد الانتظار",
        icon: "⏳",
      },
      confirmed: {
        bg: "bg-green-50",
        border: "border-green-200",
        badge: "bg-green-500",
        text: "مؤكد",
        icon: "✅",
      },
      cancelled: {
        bg: "bg-red-50",
        border: "border-red-200",
        badge: "bg-red-500",
        text: "ملغي",
        icon: "❌",
      },
      completed: {
        bg: "bg-blue-50",
        border: "border-blue-200",
        badge: "bg-blue-500",
        text: "مكتمل",
        icon: "🎯",
      },
    };
    return configs[status] || configs.pending;
  };

  // Format date and time for display
  const formatDateTime = (dateStr, timeStr) => {
    if (!dateStr) return "غير محدد";
    if (!timeStr) return dateStr;
    return `${dateStr} - ${timeStr}`;
  };

  if (!token) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-[60vh] flex items-center justify-center"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="bg-[#9b61db]/10 p-6 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center"
          >
            <svg
              className="w-12 h-12 text-[#9b61db]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </motion.div>
          <p className="text-white text-lg font-medium">
            يرجى تسجيل الدخول لعرض مواعيدك
          </p>
        </div>
      </motion.div>
    );
  }

  if (state.loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-[60vh] flex items-center justify-center"
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-16 w-16 border-4 border-[#9b61db] border-t-transparent mx-auto mb-4"
          ></motion.div>
          <p className="text-gray-400 text-lg">جاري تحميل المواعيد...</p>
        </div>
      </motion.div>
    );
  }

  if (state.appointments.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-[60vh] flex items-center justify-center"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="bg-white/5 p-6 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center"
          >
            <svg
              className="w-12 h-12 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </motion.div>
          <p className="text-white text-lg font-medium mb-2">
            لا توجد مواعيد حتى الآن
          </p>
          <p className="text-gray-400">ابدأ بحجز موعدك الأول معنا</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen pt-42 pb-16 px-4 relative overflow-hidden" dir="rtl">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-[#2d1b5a]/30 via-transparent to-transparent pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-[#13072e]/40 to-transparent pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto relative z-10"
      >
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold  mb-2">
          مواعيدي
        </h2>
        <p className=" text-lg">
          إدارة ومتابعة جميع مواعيدك الطبية
        </p>
        <div className="flex justify-center gap-4 mt-4 flex-wrap">
          {["pending", "confirmed", "completed", "cancelled"].map((status) => {
            const config = getStatusConfig(status);
            const count = state.appointments.filter((a) => a.status === status).length;
            return (
              <motion.div
                key={status}
                whileHover={{ scale: 1.05 }}
                className={`${config.bg} ${config.border} border px-4 py-2 rounded-full flex items-center gap-2`}
              >
                <span>{config.icon}</span>
                <span className="text-sm font-semibold text-textMain">{config.text}</span>
                <span className={`${config.badge} text-white text-xs px-2 py-0.5 rounded-full font-bold`}>{count}</span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Appointments grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {state.appointments.map((appt, index) => {
          const statusConfig = getStatusConfig(appt.status);

          return (
            <motion.div
              key={appt._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{
                y: -5,
                boxShadow: "0 15px 40px rgba(0, 0, 0, 0.1)",
              }}
              className={`border-2 ${statusConfig.border} ${statusConfig.bg} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-textMain mb-1">
                    {appt.serviceId?.title || appt.category || "غير محدد"}
                  </h3>
                  <p className="text-sm text-textSoft">
                    {appt.doctorName || "الدكتور الخطيب"}
                  </p>
                </div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`${statusConfig.badge} text-white px-4 py-2 rounded-full shadow-md flex items-center gap-2`}
                >
                  <span>{statusConfig.icon}</span>
                  <span className="font-semibold text-sm">
                    {statusConfig.text}
                  </span>
                </motion.div>
              </div>

              {/* Date & Time */}
              <div className="bg-white/5 rounded-xl p-4 mb-4 border border-white/5">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="bg-[#9b61db]/10 p-3 rounded-lg"
                    >
                      <svg
                        className="w-6 h-6 text-[#9b61db]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </motion.div>
                    <div>
                      <p className="text-xs font-medium">
                        التاريخ
                      </p>
                      <p className="font-bold text-lg">
                        {formatDateTime(appt.date, appt.time)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Amount & Payment Status */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1 bg-white/5 rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-2">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="bg-green-500/10 p-2 rounded-lg"
                    >
                      <svg
                        className="w-5 h-5 text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </motion.div>
                    <div>
                      <p className="text-xs  font-medium">
                        المبلغ
                      </p>
                      <p className=" font-bold text-lg">
                        {appt.amount} جنيه
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 bg-white/5 rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{
                        scale: appt.paid ? [1, 1.1, 1] : 1,
                      }}
                      transition={{
                        repeat: appt.paid ? Infinity : 0,
                        duration: 2,
                      }}
                      className={`${
                        appt.paid ? "bg-green-100" : "bg-orange-100"
                      } p-2 rounded-lg`}
                    >
                      <svg
                        className={`w-5 h-5 ${
                          appt.paid ? "text-green-600" : "text-orange-600"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                    </motion.div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium">الدفع</p>
                      <p
                        className={`font-bold text-lg ${
                          appt.paid ? "text-green-400" : "text-orange-400"
                        }`}
                      >
                        {appt.paid ? "مدفوع ✓" : "غير مدفوع"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {!appt.paid && appt.status !== "cancelled" && (
                <div className="space-y-3 pt-6 border-t border-white/10">
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePayment(appt._id)}
                      disabled={state.paymentLoading === appt._id}
                      className="flex-1 bg-gradient-to-r from-[#8349c7] to-[#9b61db] text-white py-3 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(155,97,219,0.4)] transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {state.paymentLoading === appt._id ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                          <span>جاري المعالجة...</span>
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                            />
                          </svg>
                          <span>الدفع الآن</span>
                        </>
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setState((prev) => ({
                          ...prev,
                          selectedAppointmentId: appt._id,
                          showCancelModal: true,
                        }));
                      }}
                      disabled={state.paymentLoading === appt._id}
                      className="px-6 bg-white border-2 border-red-500 text-red-500 py-3 rounded-xl font-bold hover:bg-red-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      إلغاء
                    </motion.button>
                  </div>
                </div>
              )}

              {/* Paid badge */}
              {appt.paid && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="pt-6 border-t border-white/10"
                >
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl text-center font-bold flex items-center justify-center gap-2">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    تم الدفع بنجاح
                  </div>
                </motion.div>
              )}

              {/* Cancelled badge */}
              {appt.status === "cancelled" && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="pt-6 border-t border-white/10"
                >
                  <div className="bg-gradient-to-r from-red-400 to-red-500 text-white py-3 rounded-xl text-center font-bold flex items-center justify-center gap-2">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    تم إلغاء هذا الموعد
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Developer Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-10 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5"
        dir="ltr"
      >
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <h5 className="font-bold text-amber-300 text-sm">Developer Notice — Mock Data in Use</h5>
            <p className="text-amber-400 text-xs mt-1">
              This page uses mock data from <code className="bg-amber-100 px-1 rounded">src/mockData.ts</code>.
              Replace mock functions with real API calls when the backend is ready.
              See TODO comments in the code for integration points:
            </p>
            <ul className="text-amber-400 text-xs mt-2 list-disc list-inside space-y-1">
              <li><code className="bg-amber-100 px-1 rounded">mockGetUserAppointments()</code> → <code className="bg-amber-100 px-1 rounded">appointmentApi.getUserAppointments()</code></li>
              <li><code className="bg-amber-100 px-1 rounded">mockCancelAppointment()</code> → <code className="bg-amber-100 px-1 rounded">appointmentApi.cancelAppointment()</code></li>
              <li><code className="bg-amber-100 px-1 rounded">mockInitiatePayment()</code> → <code className="bg-amber-100 px-1 rounded">paymentApi.initiatePayment()</code></li>
              <li><code className="bg-amber-100 px-1 rounded">mockVerifyPayment()</code> → <code className="bg-amber-100 px-1 rounded">paymentApi.verifyPayment()</code></li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Cancel Modal */}
      <AnimatePresence>
        {state.showCancelModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
            onClick={() =>
              setState((prev) => ({ ...prev, showCancelModal: false }))
            }
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 w-full max-w-md text-center shadow-2xl"
              dir="rtl"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </motion.div>
              <h3 className="text-2xl font-bold text-textMain mb-3">
                إلغاء الموعد
              </h3>
              <p className="text-textSoft mb-6">
                هل أنت متأكد من رغبتك في إلغاء هذا الموعد؟ لا يمكن التراجع عن
                هذا الإجراء.
              </p>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    setState((prev) => ({ ...prev, showCancelModal: false }))
                  }
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all duration-300 cursor-pointer"
                >
                  تراجع
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCancelAppointment}
                  className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all duration-300 cursor-pointer"
                >
                  نعم، إلغاء الموعد
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default MyAppointments;
