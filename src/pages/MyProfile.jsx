/* eslint-disable no-unused-vars */
import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const MyProfile = () => {
  const { userData, updateUserProfile, loading: authLoading } = useContext(AppContext);

  const [state, setState] = useState({
    isEdit: false,
    formData: {
    name: "",
    phone: "",
    address: { line1: "", line2: "" },
    gender: "Male",
    dob: "",
    image: null,
    },
  });

  const pageVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
    exit: { opacity: 0 },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    if (userData) {
      setState((prev) => ({
        ...prev,
        formData: {
        name: userData.name || "",
        phone: userData.phone || "",
        address: userData.address || { line1: "", line2: "" },
        gender: userData.gender || "Male",
        dob: userData.dob || "",
        image: null,
        },
      }));
    }
  }, [userData]);

  const handleSave = async () => {
    const data = new FormData();
    data.append("name", state.formData.name);
    data.append("phone", state.formData.phone);
    data.append("address", JSON.stringify(state.formData.address));
    data.append("gender", state.formData.gender);
    data.append("dob", state.formData.dob);
    if (state.formData.image) data.append("image", state.formData.image);

    const result = await updateUserProfile(data);

    if (result) {
      toast.success("✅ تم تحديث الملف الشخصي بنجاح");
      setState((prev) => ({ ...prev, isEdit: false }));
    } else {
      toast.error("❌ فشل تحديث الملف الشخصي");
    }
  };

  const handleCancel = () => {
    if (userData) {
      setState((prev) => ({
        ...prev,
        isEdit: false,
        formData: {
          name: userData.name || "",
          phone: userData.phone || "",
          address: userData.address || { line1: "", line2: "" },
          gender: userData.gender || "Male",
          dob: userData.dob || "",
          image: null,
        },
      }));
    }
  };

  const handleInputChange = (field, value) => {
    setState((prev) => ({
      ...prev,
      formData: {
        ...prev.formData,
        [field]: value,
      },
    }));
  };

  const handleAddressChange = (field, value) => {
    setState((prev) => ({
      ...prev,
      formData: {
        ...prev.formData,
        address: {
          ...prev.formData.address,
          [field]: value,
        },
      },
    }));
  };

  if (!userData && authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-textSoft text-lg">جاري تحميل البيانات...</p>
        </motion.div>
      </div>
    );
  }

  if (!userData && !authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-center">
        <div>
          <h2 className="text-2xl font-bold text-primary mb-4">
            خطأ في تحميل البيانات
          </h2>
          <p className="text-textSoft">يرجى تسجيل الدخول مرة أخرى.</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 py-10 px-4"
      dir="rtl"
    >
      {/* Left Side - Profile Image & Basic Info */}
      <motion.div variants={itemVariants} className="md:w-1/3">
        <div className="sticky top-24 bg-white rounded-2xl shadow-lg p-6 border border-borderLight">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="relative">
              <motion.img
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-48 h-48 rounded-full object-cover border-4 border-primary/20 shadow-xl"
                src={
                  state.formData.image
                    ? URL.createObjectURL(state.formData.image)
                    : userData.image
                }
                alt="Profile"
              />
              {state.isEdit && (
                <motion.label
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  className="absolute bottom-2 right-2 bg-primary text-white p-2 rounded-full cursor-pointer shadow-lg"
                >
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
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleInputChange("image", e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />
                </motion.label>
              )}
            </div>

            {state.isEdit ? (
              <motion.input
                whileFocus={{ scale: 1.02 }}
                className="text-2xl font-bold text-center max-w-60 px-4 py-2 rounded-xl border border-borderLight focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 text-textMain"
                type="text"
                value={state.formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            ) : (
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="font-bold text-2xl text-primary text-center"
              >
                {state.formData.name}
              </motion.h2>
            )}

            <div className="w-full h-px bg-borderLight my-2"></div>

            <div className="w-full space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-textSoft font-medium">
                  البريد الإلكتروني:
                </span>
                <span className="text-primary font-semibold text-sm">
                  {userData.email}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-textSoft font-medium">العضو منذ:</span>
                <span className="text-secondary">
                  {new Date(userData.createdAt).toLocaleDateString("ar-SA")}
                </span>
              </div>
            </div>

            <div className="flex gap-3 w-full mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  state.isEdit
                    ? handleSave()
                    : setState((prev) => ({ ...prev, isEdit: true }))
                }
                disabled={authLoading}
                className={`flex-1 py-3 rounded-xl font-bold text-lg transition-all duration-300 ${
                  state.isEdit
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-emerald-600 hover:to-green-500"
                    : "bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary"
                } text-white shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer`}
              >
                {authLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  جاري الحفظ...
                </div>
                ) : state.isEdit ? (
                "حفظ التغييرات"
              ) : (
                "تعديل الملف الشخصي"
              )}
              </motion.button>

              {state.isEdit && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCancel}
                  disabled={authLoading}
                  className="py-3 px-5 rounded-xl font-bold text-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all duration-300 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                  إلغاء
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Detailed Information */}
      <motion.div variants={itemVariants} className="md:w-2/3">
        <div className="rounded-2xl shadow-lg p-8 border border-borderLight">
          <motion.h3
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-2xl font-bold text-primary mb-6 pb-4 border-b border-borderLight"
          >
            المعلومات الشخصية
          </motion.h3>

          <div className="space-y-8">
            {/* Contact Information */}
            <motion.div
              variants={itemVariants}
              className="rounded-xl p-6 text-black"
            >
              <h4 className="text-xl font-bold text-secondary mb-4 flex items-center gap-2">
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
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                معلومات الاتصال
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-textSoft font-medium mb-2">
                    رقم الهاتف
                  </label>
                  {state.isEdit ? (
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      className="w-full border border-borderLight rounded-xl p-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 text-textMain"
                      type="tel"
                      value={state.formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder="أدخل رقم هاتفك"
                    />
                  ) : (
                    <p className="text-textMain font-semibold text-lg p-3 rounded-xl border border-borderLight">
                      {state.formData.phone || "غير محدد"}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-textSoft font-medium mb-2">
                    البريد الإلكتروني
                  </label>
                  <p className="text-textMain  font-semibold text-lg  p-3 rounded-xl border border-borderLight">
                    {userData.email}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Address Information */}
            <motion.div
              variants={itemVariants}
              className=" rounded-xl p-6"
            >
              <h4 className="text-xl font-bold text-secondary mb-4 flex items-center gap-2">
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
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                العنوان
              </h4>
              <div className="space-y-4">
                {state.isEdit ? (
                  <>
                    <div>
                      <label className="block text-textSoft font-medium mb-2">
                        العنوان الأساسي
                      </label>
                      <motion.input
                        whileFocus={{ scale: 1.02 }}
                        className="w-full bg-white border border-borderLight rounded-xl p-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 text-textMain"
                        type="text"
                        value={state.formData.address.line1}
                        onChange={(e) =>
                          handleAddressChange("line1", e.target.value)
                        }
                        placeholder="العنوان الأساسي"
                      />
                    </div>
                    <div>
                      <label className="block text-textSoft font-medium mb-2">
                        العنوان التفصيلي (اختياري)
                      </label>
                      <motion.input
                        whileFocus={{ scale: 1.02 }}
                        className="w-full bg-white border border-borderLight rounded-xl p-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 text-textMain"
                        type="text"
                        value={state.formData.address.line2}
                        onChange={(e) =>
                          handleAddressChange("line2", e.target.value)
                        }
                        placeholder="العنوان التفصيلي (اختياري)"
                      />
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <div>
                      <label className="block text-textSoft font-medium mb-1">
                        العنوان الأساسي
                      </label>
                      <p className="text-textMain font-semibold text-lg bg-white p-3 rounded-xl border border-borderLight">
                        {state.formData.address.line1 || "غير محدد"}
                      </p>
                    </div>
                    {state.formData.address.line2 && (
                      <div>
                        <label className="block text-textSoft font-medium mb-1">
                          العنوان التفصيلي
                        </label>
                        <p className="text-textSoft bg-white p-3 rounded-xl border border-borderLight">
                          {state.formData.address.line2}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Personal Information */}
            <motion.div
              variants={itemVariants}
              className=" rounded-xl p-6"
            >
              <h4 className="text-xl font-bold text-secondary mb-4 flex items-center gap-2">
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                المعلومات الشخصية
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-textSoft font-medium mb-2">
                    الجنس
                  </label>
                  {state.isEdit ? (
                    <motion.select
                      whileFocus={{ scale: 1.02 }}
                      className="w-full bg-white border border-borderLight rounded-xl p-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 text-textMain"
                      value={state.formData.gender}
                      onChange={(e) =>
                        handleInputChange("gender", e.target.value)
                      }
                    >
                      <option value="Male">ذكر</option>
                      <option value="Female">أنثى</option>
                    </motion.select>
                  ) : (
                    <p className="text-textMain font-semibold text-lg bg-white p-3 rounded-xl border border-borderLight">
                      {state.formData.gender === "Male" ? "ذكر" : "أنثى"}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-textSoft font-medium mb-2">
                    تاريخ الميلاد
                  </label>
                  {state.isEdit ? (
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      className="w-full bg-white border border-borderLight rounded-xl p-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 text-textMain"
                      type="date"
                      value={state.formData.dob}
                      onChange={(e) => handleInputChange("dob", e.target.value)}
                    />
                  ) : (
                    <p className="text-textMain font-semibold text-lg bg-white p-3 rounded-xl border border-borderLight">
                      {state.formData.dob
                        ? new Date(state.formData.dob).toLocaleDateString("ar-SA", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "غير محدد"}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Mock Data Notice for Developers */}
        <motion.div
          variants={itemVariants}
          className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-5"
          dir="ltr"
        >
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <h5 className="font-bold text-amber-800 text-sm">Developer Notice — Mock Data in Use</h5>
              <p className="text-amber-700 text-xs mt-1">
                This component is connected to <code className="bg-amber-100 px-1 rounded">AppContext</code>. 
                The actual API logic (currently mocked) is located in <code className="bg-amber-100 px-1 rounded">src/context/AppContext.jsx</code>.
                Please update the functions <code className="bg-amber-100 px-1 rounded">updateUserProfile</code> and <code className="bg-amber-100 px-1 rounded">loadUserProfileData</code> there.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default MyProfile;
