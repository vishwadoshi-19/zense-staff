"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Calendar from "react-calendar";
import { format } from "date-fns";
import {
  Activity,
  Clock,
  Heart,
  Thermometer,
  Droplet,
  Settings as Lungs,
  Check,
  Plus,
} from "lucide-react";
import { TaskList } from "@/components/TaskList";
import { VitalsCard } from "@/components/VitalsCard";
import { AttendanceBar } from "@/components/AttendanceBar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function DailyTasks() {
  const { isAuthenticated, isLoading, userData } = useAuth();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Value>(new Date());
  const [tasks, setTasks] = useState([
    { id: 1, title: "Morning Medication", completed: false, time: "08:00 AM" },
    {
      id: 2,
      title: "Blood Pressure Check",
      completed: false,
      time: "09:00 AM",
    },
    { id: 3, title: "Physical Therapy", completed: false, time: "10:30 AM" },
    { id: 4, title: "Lunch Medication", completed: false, time: "01:00 PM" },
    { id: 5, title: "Evening Walk", completed: false, time: "05:00 PM" },
  ]);

  const [vitals, setVitals] = useState({
    bloodPressure: "120/80",
    heartRate: "72",
    temperature: "98.6",
    oxygenLevel: "98",
    bloodSugar: "110",
  });

  const [attendance, setAttendance] = useState({
    clockIn: "09:00 AM",
    clockOut: "05:00 PM",
    totalHours: 8,
  });

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/sign-in");
      } else if (userData?.status !== "registered") {
        router.push("/onboarding");
      }
    }
  }, [isAuthenticated, isLoading, router, userData]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Daily Tasks</h1>

      {/* Calendar Section */}
      <div className="mb-8">
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          className="w-full max-w-md mx-auto bg-white rounded-xl shadow-sm p-4"
        />
      </div>

      {/* Attendance Tracking */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Today&apos;s Attendance
        </h2>
        <AttendanceBar attendance={attendance} />
      </div>

      {/* Vitals Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Patient Vitals
          </h2>
          <button className="text-blue-500 hover:text-blue-600">
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <VitalsCard
            icon={Heart}
            title="Blood Pressure"
            value={vitals.bloodPressure}
            unit="mmHg"
          />
          <VitalsCard
            icon={Activity}
            title="Heart Rate"
            value={vitals.heartRate}
            unit="bpm"
          />
          <VitalsCard
            icon={Thermometer}
            title="Temperature"
            value={vitals.temperature}
            unit="°F"
          />
          <VitalsCard
            icon={Lungs}
            title="Oxygen Level"
            value={vitals.oxygenLevel}
            unit="%"
          />
          <VitalsCard
            icon={Droplet}
            title="Blood Sugar"
            value={vitals.bloodSugar}
            unit="mg/dL"
          />
        </div>
      </div>

      {/* Tasks Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Tasks</h2>
          <button className="text-blue-500 hover:text-blue-600">
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <TaskList
          tasks={tasks}
          onTaskToggle={(id) => {
            setTasks(
              tasks.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
              )
            );
          }}
        />
      </div>
    </div>
  );
}
