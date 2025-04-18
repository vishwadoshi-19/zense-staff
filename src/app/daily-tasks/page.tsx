/* eslint-disable react-hooks/exhaustive-deps */
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
import { Navigation } from "@/components/Navigation";

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

interface Task {
  id: number;
  title: string;
  completed: boolean;
  time: string;
}

export default function DailyTasks() {
  const { isAuthenticated, isLoading, userData, user } = useAuth();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Value>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [clockedIn, setClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<Date | null>(null);
  const [clockOutTime, setClockOutTime] = useState<Date | null>(null);

  const [tasks, setTasks] = useState<Task[]>([]);
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
  const [showVitalsInput, setShowVitalsInput] = useState(false);
  const [attendance, setAttendance] = useState<{
    clockIn: string[];
    clockOut: string[];
    totalHours: string;
  }>({
    clockIn: [],
    clockOut: [],
    totalHours: "",
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
  const [showClockHistory, setShowClockHistory] = useState(false);
  const [showVitalsHistory, setShowVitalsHistory] = useState(false);
  const [showMoodHistory, setShowMoodHistory] = useState(false);
  const [noData, setNoData] = useState(false);

  //pushing sample data
  // useEffect(() => {
  //   pushSampleDailyTasks(user?.uid || "", format(new Date(), "yyyy-MM-dd"));
  //   console.log("Sample data pushed");
  // });

  const handleClockIn = () => {
    setClockedIn(true);
    const date = new Date();
    setClockInTime(date);
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    console.log("clock in time : ", formattedTime);
    setAttendance((prev) => ({
      ...prev,
      clockIn: [...prev.clockIn, formattedTime],
    }));
  };

  const handleClockOut = () => {
    setClockedIn(false);
    const date = new Date();
    setClockOutTime(date);
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    console.log("clock out time : ", formattedTime);
    setAttendance((prev) => ({
      ...prev,
      clockOut: [...prev.clockOut, formattedTime],
    }));
  };

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
            totalHours: data?.totalHours || "",
          });
          console.log("attendance fetched : ", attendance);
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
          setClockedIn(data?.isClockedIn || false);
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
      handleAutosave("isClockedIn", clockedIn);
      console.log("Autosaving Is clocked in ? : ", clockedIn);
    }
  }, [clockedIn, loading]);

  useEffect(() => {
    if (!loading) {
      handleAutosave("clockInTimes", attendance.clockIn);
      handleAutosave("clockOutTimes", attendance.clockOut);
      const calculateTotalHours = () => {
        const totalMinutes = attendance.clockIn.reduce(
          (total, clockInTime, index) => {
            console.log("clock in time : ", clockInTime);
            const clockOutTime = attendance.clockOut[index];
            if (clockOutTime) {
              const today = format(new Date(), "yyyy-MM-dd");
              const clockInDate = new Date(
                Date.parse(`${today} ${clockInTime}`)
              );
              console.log("clock in date : ", clockInDate);
              const clockOutDate = new Date(
                Date.parse(`${today} ${clockOutTime}`)
              );
              console.log("clock out date : ", clockOutDate);
              const diffInMinutes =
                (clockOutDate.getTime() - clockInDate.getTime()) / 60000;
              console.log("diff in minutes : ", diffInMinutes);
              return total + diffInMinutes;
            }
            console.log("total : ", total);
            return total;
          },
          0
        );

        const hours = Math.floor(totalMinutes / 60);
        console.log("hours : ", hours);
        const minutes = totalMinutes % 60;
        console.log("minutes : ", minutes);
        return `${hours}:${minutes.toString().padStart(2, "0")}`;
      };

      console.log(
        "total hoursssssssssssssssssssssssssssssss : ",
        calculateTotalHours()
      );

      handleAutosave("totalHours", calculateTotalHours());
      console.log("Autosaving clock-in and clock-out:", attendance);
    }
  }, [attendance, loading]);

  useEffect(() => {
    if (!loading) {
      handleAutosave("tasks", tasks);
      console.log("Autosaving tasks:", tasks);
    }
  }, [tasks, loading]);

  // useEffect(() => {
  //   if (!loading) {
  //     handleAutosave("vitals", vitals);
  //     console.log("Autosaving vitals:", vitals);
  //   }
  // }, [vitals, loading]);

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
    if (!loading) {
      handleAutosave("vitalsHistory", vitalsHistory);
      console.log("Autosaving vitalsHistory:", vitalsHistory);
    }
  }, [vitalsHistory, loading]);

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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 pl-3">Daily Tasks</h1>

        {/* Clock in button */}

        {selectedDate instanceof Date &&
        selectedDate.toDateString() === new Date().toDateString() ? (
          <button
            onClick={clockedIn ? handleClockOut : handleClockIn}
            className={`px-6 py-2 rounded-full font-medium ${
              clockedIn
                ? "bg-red-100 text-red-700 hover:bg-red-200"
                : "bg-green-100 text-green-700 hover:bg-green-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {clockedIn ? "Clock Out" : "Clock In"}
            </div>
          </button>
        ) : (
          <></>
        )}
      </div>

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
        <h2 className="text-xl font-semibold text-gray-900 mb-4 pl-3">
          Today&apos;s Attendance
        </h2>
        <AttendanceBar
          attendance={{
            ...attendance,
            totalHours: attendance.totalHours.toString(),
          }}
        />
        <div className="mt-4"></div>
        <div className="bg-white p-4 pb-1.5 rounded-lg shadow-md">
          <h3
            className="text-lg font-medium text-gray-800 mb-2 flex items-center justify-between cursor-pointer"
            onClick={() => setShowClockHistory((prev) => !prev)}
          >
            Clock In/Out History
            <ChevronDown
              className={`w-5 h-5 transition-transform ${
                showClockHistory ? "rotate-180" : ""
              }`}
            />
          </h3>
          {showClockHistory && (
            <ul className="list-disc pl-5 space-y-2">
              {attendance.clockIn.map((clockInTime, index) => (
                <li
                  key={index}
                  className="p-2 bg-gray-50 rounded-md border border-gray-200"
                >
                  <span className="font-semibold text-gray-700">Clock In:</span>{" "}
                  {clockInTime}{" "}
                  <span className="font-semibold text-gray-700">
                    - Clock Out:
                  </span>{" "}
                  {attendance.clockOut[index] || "N/A"}
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Vitals Section */}
        <div className="my-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 pl-3">
              Patient Vitals
            </h2>
            <button
              className="text-teal-700 hover:text-teal-600 flex items-center gap-1"
              onClick={() => setShowVitalsInput(!showVitalsInput)}
            >
              <Plus className="w-5 h-5" />
              <span>Add Vitals</span>
            </button>
          </div>
          {showVitalsInput && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Blood Pressure (mmHg)
                  </label>
                  <input
                    type="text"
                    placeholder="120/80"
                    value={vitals.bloodPressure}
                    onChange={(e) =>
                      setVitals((prev) => ({
                        ...prev,
                        bloodPressure: e.target.value,
                      }))
                    }
                    className="block w-full p-3 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Heart Rate (bpm)
                  </label>
                  <input
                    type="text"
                    placeholder="75"
                    value={vitals.heartRate}
                    onChange={(e) =>
                      setVitals((prev) => ({
                        ...prev,
                        heartRate: e.target.value,
                      }))
                    }
                    className="block w-full p-3 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Temperature (°F)
                  </label>
                  <input
                    type="text"
                    placeholder="98.6"
                    value={vitals.temperature}
                    onChange={(e) =>
                      setVitals((prev) => ({
                        ...prev,
                        temperature: e.target.value,
                      }))
                    }
                    className="block w-full p-3 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Oxygen Level (%)
                  </label>
                  <input
                    type="text"
                    placeholder="98"
                    value={vitals.oxygenLevel}
                    onChange={(e) =>
                      setVitals((prev) => ({
                        ...prev,
                        oxygenLevel: e.target.value,
                      }))
                    }
                    className="block w-full p-3 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Blood Sugar (mg/dL)
                  </label>
                  <input
                    type="text"
                    placeholder="90"
                    value={vitals.bloodSugar}
                    onChange={(e) =>
                      setVitals((prev) => ({
                        ...prev,
                        bloodSugar: e.target.value,
                      }))
                    }
                    className="block w-full p-3 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  // Save vitals to history
                  setShowVitalsInput(false);
                  const timestamp = format(new Date(), "hh:mm a");
                  setVitalsHistory((prev) => [
                    ...prev,
                    { time: timestamp, ...vitals },
                  ]);
                  setVitals({
                    bloodPressure: "",
                    heartRate: "",
                    temperature: "",
                    oxygenLevel: "",
                    bloodSugar: "",
                  });
                }}
                className="mt-6 px-6 py-3 bg-teal-700 text-white rounded-lg hover:bg-teal-600 transition"
              >
                Save Vitals
              </button>
            </div>
          )}
        </div>

        {/* Vitals History */}
        <div className="mb-8">
          <div className="bg-white p-4 pb-1.5 rounded-lg shadow-md">
            <h2
              className="text-lg font-medium text-gray-900 mb-4 flex items-center justify-between cursor-pointer"
              onClick={() => setShowVitalsHistory((prev) => !prev)}
            >
              Vitals History
              <ChevronDown
                className={`w-5 h-5 transition-transform ${
                  showVitalsHistory ? "rotate-180" : ""
                }`}
              />
            </h2>
            {showVitalsHistory && (
              <div>
                <ul className="space-y-4">
                  {vitalsHistory.map((vital, index) => (
                    <li
                      key={index}
                      className="p-4 bg-gray-50 rounded-md border border-gray-200"
                    >
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Time:</span>{" "}
                        {vital.time}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">BP:</span>{" "}
                        {vital.bloodPressure}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">HR:</span>{" "}
                        {vital.heartRate}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Temp:</span>{" "}
                        {vital.temperature}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">O2:</span>{" "}
                        {vital.oxygenLevel}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Sugar:</span>{" "}
                        {vital.bloodSugar}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Tasks Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl pl-3 font-semibold text-gray-900">Tasks</h2>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <TaskList
              tasks={tasks}
              onTaskToggle={(id) => {
                setTasks((prevTasks) =>
                  prevTasks.map((task) =>
                    task.id === id
                      ? { ...task, completed: !task.completed }
                      : task
                  )
                );
              }}
            />
          </div>
        </div>

        {/* Diet Section */}
        <div className="mb-8">
          <h2 className="text-xl pl-3 font-semibold text-gray-900 mb-4">
            Diet
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["breakfast", "lunch", "snacks", "dinner"].map((meal) => (
              <button
                key={meal}
                className={`p-4 border rounded-lg shadow-sm transition-all duration-200 transform hover:scale-105 ${
                  diet[meal as keyof typeof diet]
                    ? "bg-teal-700 text-white border-teal-700"
                    : "bg-gray-50 text-gray-900 border-gray-300 hover:bg-teal-100 hover:border-teal-500"
                }`}
                onClick={() => handleDietClick(meal as keyof typeof diet)}
              >
                <span className="text-lg font-medium">
                  {meal.charAt(0).toUpperCase() + meal.slice(1)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Activity Section */}
        <div className="mb-8">
          <h2 className="text-xl pl-3 font-semibold text-gray-900 mb-4">
            Activity
          </h2>
          <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
            <input
              type="text"
              value={newActivity}
              onChange={(e) => setNewActivity(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg w-full md:w-auto flex-grow focus:ring-teal-500 focus:border-teal-500"
              placeholder="Add new activity"
            />
            <button
              className="px-6 py-3 bg-teal-700 text-white rounded-lg hover:bg-teal-600 transition-all"
              onClick={handleAddActivity}
            >
              Add Activity
            </button>
          </div>
          {activities.length > 0 ? (
            <ul className="space-y-2">
              {activities.map((activity, index) => (
                <li
                  key={index}
                  className="p-3 bg-gray-50 border border-gray-200 rounded-lg shadow-sm"
                >
                  {activity}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No activities added yet.</p>
          )}
        </div>

        {/* Mood Section */}
        <div className="mb-8">
          <h2 className="text-xl pl-3 font-semibold text-gray-900 mb-4">
            Mood
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {moods.map((mood) => (
              <button
                key={mood.name}
                className={`p-4 border rounded-lg flex flex-col items-center justify-center transition-all duration-200 transform hover:scale-105 shadow-sm ${
                  selectedMood === mood.name
                    ? "bg-teal-700 text-white border-teal-700"
                    : "bg-gray-50 text-gray-900 border-gray-300 hover:bg-teal-100 hover:border-teal-500"
                }`}
                onClick={() => {
                  handleMoodSelect(mood.name);
                  setMoodHistory((prev) => [
                    ...prev,
                    { time: format(new Date(), "hh:mm a"), mood: mood.name },
                  ]);
                }}
              >
                <span className="text-4xl mb-2">{mood.emoji}</span>
                <span className="text-sm font-medium">{mood.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Mood History */}
        <div className="mb-8">
          <div className="bg-white p-4 pb-1.5 rounded-lg shadow-md">
            <h2
              className="text-lg font-medium text-gray-900 mb-4 flex items-center justify-between cursor-pointer"
              onClick={() => setShowMoodHistory((prev) => !prev)}
            >
              Mood History
              <ChevronDown
                className={`w-5 h-5 transition-transform ${
                  showMoodHistory ? "rotate-180" : ""
                }`}
              />
            </h2>
            {showMoodHistory && (
              <ul className="space-y-4">
                {moodHistory.map((mood, index) => (
                  <li
                    key={index}
                    className="p-4 bg-gray-50 rounded-md border border-gray-200 shadow-sm"
                  >
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Time:</span> {mood.time}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Mood:</span> {mood.mood}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      <Navigation />
    </div>
  );
}
