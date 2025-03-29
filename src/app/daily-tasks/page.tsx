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
import {
  fetchDailyTasks,
  pushSampleDailyTasks,
  saveDailyTasks,
} from "@/lib/firebase/firestore";
import { useRouter } from "next/navigation";
import { da } from "date-fns/locale";

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
  const { isAuthenticated, isLoading, userData, user } = useAuth();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Value>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  const [tasks, setTasks] = useState([]);
  type Vitals = {
    bloodPressure: string;
    heartRate: string;
    temperature: string;
    oxygenLevel: string;
    bloodSugar: string;
  };

  const [vitals, setVitals] = useState<Vitals>({
    bloodPressure: "",
    heartRate: "",
    temperature: "",
    oxygenLevel: "",
    bloodSugar: "",
  });
  const [attendance, setAttendance] = useState({
    clockIn: [],
    clockOut: [],
    totalHours: 0,
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
  type Mood = {
    time: string;
    mood: string;
  };

  const [moodHistory, setMoodHistory] = useState<Mood[]>([]);
  type Vital = {
    time: string;
    bloodPressure: string;
    heartRate: string;
    temperature: string;
    oxygenLevel: string;
    bloodSugar: string;
  };

  const [vitalsHistory, setVitalsHistory] = useState<Vital[]>([]);
  const [loading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false);

  //pushing sample data
  // useEffect(() => {
  //   pushSampleDailyTasks(user?.uid || "", format(new Date(), "yyyy-MM-dd"));
  //   console.log("Sample data pushed");
  // });

  useEffect(() => {
    const fetchData = async () => {
      if (user?.uid) {
        console.log("Fetching data for user:", user.uid);
        const formattedDate =
          selectedDate instanceof Date
            ? format(selectedDate, "yyyy-MM-dd")
            : "";
        console.log("Formatted date:", formattedDate);
        const result = await fetchDailyTasks(user.uid, formattedDate);
        console.log("Fetched data:", result);
        if (result.success) {
          const data = result.data;
          setTasks(data?.tasks || []);
          setVitals(data?.vitals || []);
          setAttendance({
            clockIn: data?.clockInTimes || [],
            clockOut: data?.clockOutTimes || [],
            totalHours: data?.totalHours || 0,
          });
          setDiet(
            data?.diet || {
              breakfast: false,
              lunch: false,
              snacks: false,
              dinner: false,
            }
          );
          setActivities(data?.activities || []);
          setMoodHistory(data?.moodHistory || []);
          setVitalsHistory(data?.vitalsHistory || []);
          setNoData(false);
        } else {
          setNoData(true);
        }
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedDate, userData, user?.uid]);

  const handleAutosave = async (field: string, value: any) => {
    if (user?.uid) {
      const formattedDate =
        selectedDate instanceof Date ? format(selectedDate, "yyyy-MM-dd") : "";
      try {
        await saveDailyTasks(user.uid, formattedDate, { [field]: value });
        console.log(`Autosaved ${field}:`, value);
      } catch (error) {
        console.error(`Failed to autosave ${field}:`, error);
      }
    }
  };

  useEffect(() => {
    if (!loading) {
      handleAutosave("tasks", tasks);
      console.log("Autosaving tasks:", tasks);
    }
  }, [tasks, loading]);

  useEffect(() => {
    if (!loading) {
      handleAutosave("vitals", vitals);
      console.log("Autosaving vitals:", vitals);
    }
  }, [vitals, loading]);

  useEffect(() => {
    if (!loading) {
      handleAutosave("diet", diet);
      console.log("Autosaving diet:", diet);
    }
  }, [diet, loading]);

  useEffect(() => {
    if (!loading) {
      handleAutosave("activities", activities);
      console.log("Autosaving activities:", activities);
    }
  }, [activities, loading]);

  useEffect(() => {
    if (!loading) {
      handleAutosave("moodHistory", moodHistory);
      console.log("Autosaving moodHistory:", moodHistory);
    }
  }, [moodHistory, loading]);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/sign-in");
      } else if (userData?.status === "unregistered") {
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

  if (loading) {
    return <div>Loading...</div>;
  }

  // console.log(
  //   "dates 1:......",
  //   selectedDate instanceof Date && selectedDate.toDateString
  // );

  // console.log("dates 2:......", new Date().toDateString());

  // console.log(
  //   selectedDate instanceof Date &&
  //     selectedDate.toDateString === new Date().toDateString()
  // );

  if (
    noData &&
    selectedDate instanceof Date &&
    selectedDate.toDateString() !== new Date().toDateString()
  ) {
    console.log(selectedDate, new Date());
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
        <div>No data available</div>
      </div>
    );
  }

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
        <div className="mt-4"></div>
        <h3 className="text-md font-medium text-gray-800 mb-2">
          Clock In/Out History
        </h3>
        <ul className="list-disc pl-5">
          {attendance.clockIn.map((clockInTime, index) => (
            <li key={index}>
              Clock In: {clockInTime} - Clock Out:{" "}
              {attendance.clockOut[index] || "N/A"}
            </li>
          ))}
        </ul>
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
            onChange={(newValue) =>
              setVitals((prev) => ({ ...prev, bloodPressure: newValue }))
            }
          />
          <VitalsCard
            icon={Activity}
            title="Heart Rate"
            value={vitals.heartRate}
            unit="bpm"
            onChange={(newValue) =>
              setVitals((prev) => ({ ...prev, heartRate: newValue }))
            }
          />
          <VitalsCard
            icon={Thermometer}
            title="Temperature"
            value={vitals.temperature}
            unit="°F"
            onChange={(newValue) =>
              setVitals((prev) => ({ ...prev, temperature: newValue }))
            }
          />
          <VitalsCard
            icon={Lungs}
            title="Oxygen Level"
            value={vitals.oxygenLevel}
            unit="%"
            onChange={(newValue) =>
              setVitals((prev) => ({ ...prev, oxygenLevel: newValue }))
            }
          />
          <VitalsCard
            icon={Droplet}
            title="Blood Sugar"
            value={vitals.bloodSugar}
            unit="mg/dL"
            onChange={(newValue) =>
              setVitals((prev) => ({ ...prev, bloodSugar: newValue }))
            }
          />
        </div>
      </div>

      {/* Vitals History */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Vitals History
        </h2>
        <ul className="list-disc pl-5">
          {vitalsHistory.map((vital, index) => (
            <li key={index}>
              {vital.time} - BP: {vital.bloodPressure}, HR: {vital.heartRate},
              Temp: {vital.temperature}
            </li>
          ))}
        </ul>
      </div>

      {/* Tasks Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Tasks</h2>
          <button className="text-teal-700 hover:text-teal-600">
            <Plus className="w-5 h-5" />
          </button>
        </div>
        {/* <TaskList
          tasks={tasks}
          onTaskToggle={(id) => {
            setTasks(
              tasks.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
              )
            );
          }}
        /> */}
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
              onClick={() => {
                handleMoodSelect(mood.name);
                setMoodHistory((prev) => [
                  ...prev,
                  { time: format(new Date(), "hh:mm a"), mood: mood.name },
                ]);
              }}
            >
              <span className="mr-6 text-3xl">{mood.emoji}</span>
              {mood.name}
            </button>
          ))}
        </div>
      </div>

      {/* Mood History */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Mood History
        </h2>
        <ul className="list-disc pl-5">
          {moodHistory.map((mood, index) => (
            <li key={index}>
              {mood.time} - {mood.mood}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
