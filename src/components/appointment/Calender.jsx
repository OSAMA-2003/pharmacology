/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { MONTHS_ARABIC, DAYS_ARABIC } from "../../constants/dates";
import { ArrowLeft, ArrowRight } from "lucide-react";

const Calendar = ({
  currentMonth,
  currentYear,
  selectedDate,
  bookedSlots = {},
  blockedSlots = {},
  onMonthChange,
  onDateSelect,
}) => {
  // Generate days for current month
  const generateMonthDays = () => {
    const days = [];
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const totalDays = lastDay.getDate();

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dateKey = date.toLocaleDateString("ar-EG", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const dateKeyISO = date.toISOString().split("T")[0];
      const isPast = date < new Date().setHours(0, 0, 0, 0);

      // Check if date has booked or blocked slots
      const bookedForDate = bookedSlots[dateKey] || [];
      const blockedForDate = blockedSlots[dateKey] || [];
      const isFullyBooked = bookedForDate.length + blockedForDate.length >= 24; // Assuming 24 slots per day

      days.push({
        date,
        dateKey,
        dateKeyISO,
        day,
        isPast,
        isFullyBooked,
        bookedCount: bookedForDate.length,
        blockedCount: blockedForDate.length,
      });
    }

    return days;
  };

  const monthDays = generateMonthDays();

  const getDayStatus = (day) => {
    if (!day) return "empty";
    if (day.isPast) return "past";
    if (day.isFullyBooked) return "fullyBooked";
    if (selectedDate === day.dateKey) return "selected";
    return "available";
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
      {/* Calendar Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">اختر تاريخ الحجز</h2>

        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onMonthChange("prev")}
            className="bg-gray-100 text-gray-600 p-3 rounded-xl hover:bg-[#9b61db] hover:text-white transition-colors"
          >
            <ArrowRight size={20} />
          </motion.button>

          <span className="text-lg font-bold text-gray-800 min-w-[150px] text-center">
            {MONTHS_ARABIC[currentMonth]} {currentYear}
          </span>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onMonthChange("next")}
            className="bg-gray-100 text-gray-600 p-3 rounded-xl hover:bg-[#9b61db] hover:text-white transition-colors"
          >
           <ArrowLeft size={20} />
          </motion.button>
        </div>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {DAYS_ARABIC.map((day, index) => (
          <div
            key={index}
            className="text-center font-bold text-gray-500 text-xs md:text-sm  py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {monthDays.map((day, index) => {
          const status = getDayStatus(day);

          if (!day) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          return (
            <motion.div
              key={day.dateKeyISO}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={status === "available" ? { scale: 1.05 } : {}}
              whileTap={status === "available" ? { scale: 0.95 } : {}}
              onClick={() =>
                status === "available" && onDateSelect(day.dateKey)
              }
              className={`aspect-square  flex-col items-center justify-center rounded-2xl transition-all duration-300 border-2 relative overflow-hidden ${
                status === "selected"
                  ? "bg-gradient-to-br from-[#9b61db] to-[#8349c7] text-white border-transparent shadow-lg"
                  : status === "past"
                  ? "bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed"
                  : status === "fullyBooked"
                  ? "bg-red-50 text-red-400 border-red-100 cursor-not-allowed line-through"
                  : "bg-white text-gray-700 border-gray-200 hover:border-[#9b61db] hover:text-[#9b61db] hover:bg-purple-50 cursor-pointer"
              }`}
            >
              {/* Blur overlay for fully booked dates */}
              {status === "fullyBooked" && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-300/60 to-gray-400/40 backdrop-blur-[1px]"></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-70">
                    <svg
                      className="w-10 h-10 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </>
              )}

              {/* Day number */}
              <p
                className={`text-xl font-bold relative z-10 ${
                  status === "fullyBooked" ? "opacity-50" : ""
                }`}
              >
                {day.day}
              </p>

            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md bg-gradient-to-br from-[#9b61db] to-[#8349c7]"></div>
            <span className="text-sm text-gray-600">اليوم المحدد</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md bg-white border-2 border-gray-200"></div>
            <span className="text-sm text-gray-600">يوم متاح</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md bg-red-50 border-2 border-red-100 line-through"></div>
            <span className="text-sm text-gray-600">محجوز بالكامل</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md bg-gray-50 border-2 border-gray-100"></div>
            <span className="text-sm text-gray-600">يوم فائت</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
