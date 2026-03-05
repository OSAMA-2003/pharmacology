import React, { useState, useEffect, useCallback, useContext } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  BookOpen,
  Clock,
  PlayCircle,
  Award,
  TrendingUp,
  Calendar,
  ChevronLeft,
  CheckCircle,
  BarChart3,
  User,
} from "lucide-react";
import { mockGetUserCourses } from "../user/testUser";
import { AppContext } from "../../context/AppContext";

// ============================================================
// MyCourses Component — MOCK VERSION (No Backend)
// ============================================================
//
// TODO (Backend Developer):
//   1. This component now uses `userData` from `AppContext`.
//   2. Replace `mockGetUserCourses()` with a real API call. You can create a `CourseContext` for this.
//   3. Uncomment `navigate()` calls and import `useNavigate` from react-router-dom.
//   4. Remove the Developer Notice banner at the bottom.
// ============================================================

const MyCourses = () => {
  // TODO (Backend): Replace with useNavigate() from react-router-dom
  // const navigate = useNavigate();
  const { userData } = useContext(AppContext);

  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [stats, setStats] = useState({
    totalCourses: 0,
    inProgress: 0,
    completed: 0,
    totalProgress: 0,
    totalHours: 0,
  });

  // --- FRONTEND MOCK & BACKEND HOOK ---
  // TODO (Backend): Replace with getUserCourses() from CourseContext
  // This function currently uses mock data.
  // The backend endpoint should be something like GET /api/courses/my-courses
  const loadCourses = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await mockGetUserCourses();
      if (response.success) {
        setEnrolledCourses(response.courses);
      } else {
        toast.error("حدث خطأ في تحميل الدورات");
      }
    } catch {
      toast.error("حدث خطأ في تحميل الدورات");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const calculateStats = () => {
    const totalCourses = enrolledCourses.length;
    const completed = enrolledCourses.filter(
      (course) => course.progress === 100
    ).length;
    const inProgress = totalCourses - completed;
    const totalProgress =
      totalCourses > 0
        ? enrolledCourses.reduce((sum, course) => sum + (course.progress || 0), 0) /
          totalCourses
        : 0;

    const totalHours = enrolledCourses.reduce((sum, course) => {
      const hours = parseInt(course.totalDuration) || 10;
      return sum + hours;
    }, 0);

    setStats({
      totalCourses,
      inProgress,
      completed,
      totalProgress: Math.round(totalProgress),
      totalHours,
    });
  };

  useEffect(() => {
    if (enrolledCourses.length > 0) {
      calculateStats();
    }
  }, [enrolledCourses]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getProgressColor = (progress) => {
    if (progress < 30) return "from-red-500 to-orange-500";
    if (progress < 70) return "from-yellow-500 to-amber-500";
    return "from-green-500 to-emerald-500";
  };

  const getProgressTextColor = (progress) => {
    if (progress < 30) return "text-red-600";
    if (progress < 70) return "text-yellow-600";
    return "text-green-600";
  };

  const pageVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  // Mock navigation handler
  const handleNavigate = (path) => {
    // TODO (Backend): Replace with navigate(path) from react-router-dom
    toast.info(`📍 سيتم التنقل إلى: ${path}`, { autoClose: 2000 });
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-textSoft text-lg">جاري تحميل دوراتك...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={pageVariants}
      className="max-w-7xl mx-auto my-8 px-4 sm:px-6 text-textMain"
      dir="rtl"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          مرحباً {userData?.name || "زائرنا الكريم"} 👋
        </h1>
        <p className="text-textSoft text-lg">هذه هي دوراتك التدريبية</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <motion.div
          whileHover={{ y: -3, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}
          className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 border border-borderLight"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-textSoft">إجمالي الدورات</p>
              <p className="text-2xl sm:text-3xl font-bold mt-1 text-textMain">
                {stats.totalCourses}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <BookOpen className="text-blue-600" size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -3, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}
          className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 border border-borderLight"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-textSoft">قيد التنفيذ</p>
              <p className="text-2xl sm:text-3xl font-bold mt-1 text-yellow-600">
                {stats.inProgress}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-xl">
              <TrendingUp className="text-yellow-600" size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -3, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}
          className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 border border-borderLight"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-textSoft">المكتملة</p>
              <p className="text-2xl sm:text-3xl font-bold mt-1 text-green-600">
                {stats.completed}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <Award className="text-green-600" size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -3, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}
          className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 border border-borderLight"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-textSoft">التقدم العام</p>
              <p className="text-2xl sm:text-3xl font-bold mt-1 text-purple-600">
                {stats.totalProgress}%
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <BarChart3 className="text-purple-600" size={24} />
            </div>
          </div>
          {/* Overall progress bar */}
          <div className="mt-3 w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stats.totalProgress}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-gradient-to-r from-purple-500 to-violet-500 rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Courses Section */}
      {enrolledCourses.length === 0 ? (
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-lg p-12 text-center"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-lightBg rounded-full flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-textSoft" />
          </div>
          <h3 className="text-2xl font-bold text-textMain mb-2">
            لا توجد دورات مسجلة
          </h3>
          <p className="text-textSoft mb-6">
            ابدأ رحلة التعلم معنا واشترك في دوراتنا التدريبية
          </p>
          <button
            onClick={() => handleNavigate("/courses")}
            className="bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 px-8 rounded-xl hover:from-secondary hover:to-primary transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
          >
            تصفح الدورات
          </button>
        </motion.div>
      ) : (
        <>
          <motion.div variants={itemVariants} className="mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-primary">دوراتك</h2>
              <span className="text-textSoft bg-white px-4 py-1.5 rounded-full shadow-sm border border-borderLight text-sm">
                {enrolledCourses.length} دورة
              </span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course, index) => (
              <motion.div
                key={course._id}
                variants={itemVariants}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-borderLight hover:shadow-xl transition-all duration-300"
              >
                {/* Course Image */}
                <div className="relative h-48 overflow-hidden group">
                  <img
                    src={course.thumbnail}
                    alt={course.title_ar}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    {course.category}
                  </div>
                  {/* Completed badge */}
                  {course.progress === 100 && (
                    <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                      <CheckCircle size={14} />
                      مكتمل
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <div className="w-full bg-gray-700/60 h-2 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${course.progress || 0}%` }}
                        transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                        className={`h-full bg-gradient-to-r ${getProgressColor(
                          course.progress || 0
                        )} rounded-full`}
                      />
                    </div>
                  </div>
                </div>

                {/* Course Info */}
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2 leading-relaxed">
                    {course.title_ar}
                  </h3>

                  {/* Instructor */}
                  {course.instructor && (
                    <div className="flex items-center gap-2 mb-3 text-sm text-textSoft">
                      <User size={14} />
                      <span>{course.instructor}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-4 text-sm text-textSoft">
                    <div className="flex items-center gap-2">
                      <Clock size={14} />
                      <span>{course.totalDuration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen size={14} />
                      <span>{course.totalLessons} درس</span>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-textSoft">تقدمك</span>
                      <span className={`font-bold ${getProgressTextColor(course.progress || 0)}`}>
                        {course.progress || 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${course.progress || 0}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                        className={`h-full bg-gradient-to-r ${getProgressColor(
                          course.progress || 0
                        )} rounded-full`}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleNavigate(`/learn/${course._id}`)}
                      className="flex-1 bg-gradient-to-r from-primary to-secondary text-white font-bold py-2.5 rounded-xl hover:from-secondary hover:to-primary transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
                    >
                      {course.progress === 100 ? (
                        <>
                          <CheckCircle size={18} />
                          معاينة
                        </>
                      ) : (
                        <>
                          <PlayCircle size={18} />
                          {course.progress > 0 ? "استمر" : "ابدأ"}
                        </>
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCourse(course)}
                      className="px-4 border border-borderLight rounded-xl hover:bg-lightBg transition-colors flex items-center justify-center cursor-pointer"
                    >
                      <ChevronLeft size={18} />
                    </motion.button>
                  </div>

                  {/* Enrollment Date */}
                  {course.enrolledAt && (
                    <div className="mt-4 pt-4 border-t border-borderLight flex items-center gap-2 text-xs text-textSoft">
                      <Calendar size={12} />
                      <span>مسجل منذ {formatDate(course.enrolledAt)}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Course Detail Modal */}
      {selectedCourse && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
          onClick={() => setSelectedCourse(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            {/* Modal Image */}
            <div className="relative h-52 overflow-hidden">
              <img
                src={selectedCourse.thumbnail}
                alt={selectedCourse.title_ar}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 right-4 left-4">
                <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-bold">
                  {selectedCourse.category}
                </span>
                <h3 className="text-white font-bold text-xl mt-2 leading-relaxed">
                  {selectedCourse.title_ar}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/40 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Instructor */}
              {selectedCourse.instructor && (
                <div className="flex items-center gap-3 mb-4 bg-lightBg p-3 rounded-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {selectedCourse.instructor.charAt(selectedCourse.instructor.indexOf('.') + 2) || 'د'}
                  </div>
                  <div>
                    <p className="text-xs text-textSoft">المدرب</p>
                    <p className="font-bold text-textMain">{selectedCourse.instructor}</p>
                  </div>
                </div>
              )}

              {/* Description */}
              {selectedCourse.description_ar && (
                <p className="text-textSoft mb-4 leading-relaxed">
                  {selectedCourse.description_ar}
                </p>
              )}

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-blue-50 rounded-xl p-3 text-center">
                  <BookOpen className="text-blue-600 mx-auto mb-1" size={20} />
                  <p className="text-xs text-textSoft">الدروس</p>
                  <p className="font-bold text-textMain">{selectedCourse.totalLessons}</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-3 text-center">
                  <Clock className="text-purple-600 mx-auto mb-1" size={20} />
                  <p className="text-xs text-textSoft">المدة</p>
                  <p className="font-bold text-textMain">{selectedCourse.totalDuration}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-3 text-center">
                  <TrendingUp className="text-green-600 mx-auto mb-1" size={20} />
                  <p className="text-xs text-textSoft">التقدم</p>
                  <p className={`font-bold ${getProgressTextColor(selectedCourse.progress)}`}>
                    {selectedCourse.progress}%
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-4">
                <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${getProgressColor(selectedCourse.progress)} rounded-full transition-all duration-500`}
                    style={{ width: `${selectedCourse.progress}%` }}
                  />
                </div>
              </div>

              {/* Enrollment date */}
              {selectedCourse.enrolledAt && (
                <div className="flex items-center gap-2 text-xs text-textSoft mb-6">
                  <Calendar size={12} />
                  <span>تاريخ التسجيل: {formatDate(selectedCourse.enrolledAt)}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    handleNavigate(`/learn/${selectedCourse._id}`);
                    setSelectedCourse(null);
                  }}
                  className="flex-1 bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 rounded-xl hover:from-secondary hover:to-primary transition-all duration-300 flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  {selectedCourse.progress === 100 ? (
                    <>
                      <CheckCircle size={18} />
                      مراجعة الدورة
                    </>
                  ) : (
                    <>
                      <PlayCircle size={18} />
                      {selectedCourse.progress > 0 ? "متابعة التعلم" : "بدء الدورة"}
                    </>
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedCourse(null)}
                  className="px-6 bg-lightBg text-textSoft font-bold py-3 rounded-xl hover:bg-gray-200 transition-all duration-300 cursor-pointer"
                >
                  إغلاق
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Developer Notice */}
      <motion.div
        variants={itemVariants}
        className="mt-12 bg-amber-50 border-2 border-amber-200 rounded-2xl p-6"
      >
        <div className="flex items-start gap-3">
          <div className="bg-amber-100 p-2 rounded-lg mt-0.5">
            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="font-bold text-amber-800 text-lg mb-2">
              🛠️ ملاحظة للمطور — بيانات تجريبية
            </h4>
            <p className="text-amber-700 text-sm mb-3">
              هذه الصفحة تستخدم بيانات وهمية (Mock Data). عند ربط الباك إند، قم بالتعديلات التالية:
            </p>
            <ul className="text-amber-700 text-sm space-y-1.5 list-disc list-inside">
              <li><code className="bg-amber-100 px-1.5 py-0.5 rounded text-xs">mockGetUserCourses()</code> → <code className="bg-amber-100 px-1.5 py-0.5 rounded text-xs">GET /api/courses/enrolled</code></li>
              <li>Component now uses <code className="bg-amber-100 px-1.5 py-0.5 rounded text-xs">userData</code> from AppContext.</li>
              <li>Course thumbnails are placeholders — replace with real image URLs from backend</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MyCourses;
