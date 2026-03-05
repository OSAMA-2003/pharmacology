import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

const TimeSlots = ({ selectedDate, selectedTime, bookedSlots = [], blockedSlots = [], onTimeSelect }) => {
  // Mock time slots for a day
  const generateTimeSlots = () => {
    const slots = [];
    const hours = [9, 10, 11, 12, 14, 15, 16, 17]; // Example hours, skipping lunch break
    hours.forEach(hour => {
        slots.push(`${hour.toString().padStart(2, '0')}:00`);
        slots.push(`${hour.toString().padStart(2, '0')}:30`);
    });
    return slots;
  };

  const allSlots = generateTimeSlots();

  const getSlotStatus = (time) => {
    if (selectedTime === time) return 'selected';
    if (bookedSlots.includes(time)) return 'booked';
    if (blockedSlots.includes(time)) return 'blocked';
    return 'available';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Clock size={20} className="text-gray-500" />
        الأوقات المتاحة
      </h3>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-3 sm:grid-cols-4 gap-3"
      >
        {allSlots.map((time) => {
          const status = getSlotStatus(time);
          return (
            <motion.button
              key={time}
              variants={itemVariants}
              whileHover={status === 'available' ? { scale: 1.05, y: -2 } : {}}
              whileTap={status === 'available' ? { scale: 0.95 } : {}}
              onClick={() => status === 'available' && onTimeSelect(time)}
              disabled={status !== 'available'}
              className={`p-3 rounded-xl text-center font-bold transition-all duration-200 border-2
                ${status === 'selected'
                  ? 'bg-gradient-to-br from-[#9b61db] to-[#8349c7] text-white border-transparent shadow-lg'
                  : status === 'available'
                  ? 'bg-white text-gray-700 border-gray-200 hover:border-[#9b61db] hover:text-[#9b61db]'
                  : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through'
                }
              `}
            >
              {time}
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
};

export default TimeSlots;