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
  Smile,
  Utensils,
  CalendarIcon,
  ChevronDown,
} from "lucide-react";
import { TaskList } from "@/components/TaskList";
import { VitalsCard } from "@/components/VitalsCard";
import { AttendanceBar } from "@/components/AttendanceBar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const moods = [
  { name: "Cheerful", emoji: "😊" },
  { name: "Calm", emoji: "😌" },
  { name: "Excited", emoji: "😃" },
  { name: "Tense", emoji: "😬" },
  { name: "Fearful", emoji: "😨" },
  { name: "Angry", emoji: "😠" },
];

export default function DailyTasks() {
  const { isAuthenticated, isLoading, userData } = useAuth();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Value>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

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

  const [diet, setDiet] = useState({
    breakfast: false,
    lunch: false,
    snacks: false,
    dinner: false,
  });

  const [activities, setActivities] = useState<string[]>([]);
  const [newActivity, setNewActivity] = useState("");

  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/sign-in");
      } else if (userData?.status !== "registered") {
        router.push("/onboarding");
      }
    }
  }, [isAuthenticated, isLoading, router, userData]);

  const handleDietClick = (meal: keyof typeof diet) => {
    setDiet((prevDiet) => ({ ...prevDiet, [meal]: !prevDiet[meal] }));
  };

  const handleAddActivity = () => {
    if (newActivity.trim()) {
      setActivities((prevActivities) => [...prevActivities, newActivity]);
      setNewActivity("");
    }
  };

  const handleDateChange = (date: Value) => {
    setSelectedDate(date);
    setShowCalendar(false); // Hide calendar after date selection
  };

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  // Format the selected date for display
  const formattedDate =
    selectedDate instanceof Date
      ? format(selectedDate, "EEEE, MMMM d, yyyy")
      : "Select a date";

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Daily Tasks</h1>

      <div className="mb-8">
        <div
          className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm cursor-pointer"
          onClick={toggleCalendar}
        >
          <div className="flex items-center">
            <CalendarIcon className="w-5 h-5 mr-2 text-teal-700" />
            <span>{formattedDate}</span>
          </div>
          <ChevronDown
            className={`w-5 h-5 transition-transform ${
              showCalendar ? "rotate-180" : ""
            }`}
          />
        </div>

        {showCalendar && (
          <div className="mt-2">
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              maxDate={new Date()} // Prevent selecting future dates
              className="w-full max-w-md mx-auto bg-white rounded-xl shadow-sm p-4"
            />
          </div>
        )}
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
          <button className="text-teal-700 hover:text-teal-600">
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
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Tasks</h2>
          <button className="text-teal-700 hover:text-teal-600">
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

      {/* Diet Section */}
      <div className="mb-8 ">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Diet</h2>
        <div className="grid grid-cols-2 gap-4">
          {["breakfast", "lunch", "snacks", "dinner"].map((meal) => (
            <button
              key={meal}
              className={`p-4 border rounded-lg ${
                diet[meal as keyof typeof diet]
                  ? "bg-teal-700 text-white"
                  : "bg-white text-gray-900"
              }`}
              onClick={() => handleDietClick(meal as keyof typeof diet)}
            >
              {meal.charAt(0).toUpperCase() + meal.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity</h2>
        <div className="mb-4">
          <input
            type="text"
            value={newActivity}
            onChange={(e) => setNewActivity(e.target.value)}
            className="p-3 border border-teal-700 rounded-lg w-full"
            placeholder="Add new activity"
          />
          <button
            className="mt-3 p-2 bg-teal-700 text-white rounded-lg"
            onClick={handleAddActivity}
          >
            Add Activity
          </button>
        </div>
        <ul className="list-disc pl-5">
          {activities.map((activity, index) => (
            <li key={index}>{activity}</li>
          ))}
        </ul>
      </div>

      {/* Mood Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Mood</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {moods.map((mood) => (
            <button
              key={mood.name}
              className={`p-4 border rounded-lg flex items-center justify-center ${
                selectedMood === mood.name
                  ? "bg-teal-700 text-white"
                  : "bg-white text-gray-900"
              }`}
              onClick={() => handleMoodSelect(mood.name)}
            >
              <span className="mr-6 text-3xl">{mood.emoji}</span>
              {mood.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
