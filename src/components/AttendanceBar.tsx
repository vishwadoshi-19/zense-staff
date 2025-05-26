"use client";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";

interface AttendanceProps {
  attendance: {
    clockIn: string[]; // Accept arrays
    clockOut: string[]; // Accept arrays
    totalHours: string;
  };
}

export const AttendanceBar = ({ attendance }: AttendanceProps) => {
  console.log(attendance.clockIn, attendance.clockOut);
  console.log("attendance", attendance);

  // Calculate percentage for progress bar
  const calculatePercentage = () => {
    const [hours, minutes] = attendance.totalHours.split(":").map(Number);
    const totalMinutes = (hours || 0) * 60 + (minutes || 0);
    const percentage = Math.min(
      100,
      Math.max(0, (totalMinutes / (12 * 60)) * 100)
    );
    return `${percentage}%`;
  };

  return (
    <div className="rounded-xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-teal-100 p-2 rounded-full">
            <Clock className="w-5 h-5 text-teal-700" />
          </div>
          <span className="font-medium text-gray-900">Shift Hours</span>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-lg font-semibold text-teal-700 bg-teal-50 px-3 py-1 rounded-full"
        >
          {attendance.totalHours || "0:00"} hours
        </motion.div>
      </div>
      <div className="space-y-3">
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: calculatePercentage() }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-teal-700 rounded-full"
          />
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>9:00 AM</span>
          <span>9:00 PM</span>
        </div>
      </div>
    </div>
  );
};
