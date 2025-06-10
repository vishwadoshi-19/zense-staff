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
  TreesIcon as Lungs,
  Check,
  Plus,
  Smile,
  Utensils,
  CalendarIcon,
  ChevronDown,
  AlertCircle,
} from "lucide-react";
import { TaskList } from "@/components/TaskList";
import { AttendanceBar } from "@/components/AttendanceBar";
import { useAuth } from "@/context/AuthContext";
import { fetchDailyTasks, saveDailyTasks } from "@/lib/firebase/firestore";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/common/LoadingScreen";
import { useUser } from "@/context/UserContext";

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
  const { ongoingJob, isLoading: userLoading } = useUser();

  // const today = new Date();
  // const jobConditions = ongoingJob?.startDate && ongoingJob?.endDate 
  //   ? (today >= new Date(ongoingJob.startDate) && today <= new Date(ongoingJob.endDate))
  //   : false;

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
    return <LoadingScreen />;
  }

  if (
    noData &&
    selectedDate instanceof Date &&
    selectedDate.toDateString() !== new Date().toDateString()
  ) {
    console.log(selectedDate, new Date());
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-3xl font-bold text-gray-900 mb-8"
        >
          Daily Tasks
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mb-8"
        >
          <div
            className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-shadow duration-200"
            onClick={toggleCalendar}
          >
            <div className="flex items-center">
              <CalendarIcon className="w-5 h-5 mr-2 text-teal-700" />
              <span className="font-medium">{formattedDate}</span>
            </div>
            <ChevronDown
              className={`w-5 h-5 transition-transform duration-200 ${
                showCalendar ? "rotate-180" : ""
              }`}
            />
          </div>

          {showCalendar && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-2"
            >
              <Calendar
                onChange={handleDateChange}
                value={selectedDate}
                maxDate={new Date()} // Prevent selecting future dates
                className="w-full max-w-md mx-auto bg-white rounded-xl shadow-sm p-4"
              />
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-8 flex flex-col items-center justify-center text-center"
        >
          <AlertCircle className="w-16 h-16 text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            No Data Available
          </h2>
          <p className="text-gray-500 max-w-md">
            There is no recorded information for this date. Please select
            another date or add new entries.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex justify-between items-center mb-8"
      >
        <div className="flex flex-col"><h1 className="text-3xl font-bold text-gray-900">Daily Tasks</h1>
        {ongoingJob && <div>For : <span>{ongoingJob?.patientInfo?.name}</span></div>}</div>

        {/* Clock in button */}
        {selectedDate instanceof Date &&
        selectedDate.toDateString() === new Date().toDateString() ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clockedIn ? handleClockOut : handleClockIn}
            className={`px-6 py-3 rounded-full font-medium shadow-sm transition-all duration-200 ${
              clockedIn
                ? "bg-red-100 text-red-700 hover:bg-red-200"
                : "bg-green-100 text-green-700 hover:bg-green-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {clockedIn ? "Clock Out" : "Clock In"}
            </div>
          </motion.button>
        ) : (
          <></>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mb-8"
      >
        <div
          className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-shadow duration-200"
          onClick={toggleCalendar}
        >
          <div className="flex items-center">
            <CalendarIcon className="w-5 h-5 mr-2 text-teal-700" />
            <span className="font-medium">{formattedDate}</span>
          </div>
          <ChevronDown
            className={`w-5 h-5 transition-transform duration-200 ${
              showCalendar ? "rotate-180" : ""
            }`}
          />
        </div>

        {showCalendar && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-2"
          >
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              maxDate={new Date()} // Prevent selecting future dates
              className="w-full max-w-md mx-auto bg-white rounded-xl shadow-sm p-4"
            />
          </motion.div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          {/* Attendance Tracking */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="border-b border-gray-100 px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Today&apos;s Attendance
              </h2>
            </div>
            <div className="p-6">
              <AttendanceBar
                attendance={{
                  ...attendance,
                  totalHours: attendance.totalHours.toString(),
                }}
              />

              <div className="mt-6">
                <div
                  className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors"
                  onClick={() => setShowClockHistory((prev) => !prev)}
                >
                  <h3 className="text-lg font-medium text-gray-800 flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-teal-700" />
                    Clock In/Out History
                  </h3>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                      showClockHistory ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {showClockHistory && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-3 space-y-2 pl-9"
                  >
                    {attendance.clockIn.length > 0 ? (
                      attendance.clockIn.map((clockInTime, index) => (
                        <div
                          key={index}
                          className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex justify-between"
                        >
                          <div>
                            <span className="font-medium text-teal-700">
                              In:
                            </span>{" "}
                            <span className="text-gray-700">{clockInTime}</span>
                          </div>
                          <div>
                            <span className="font-medium text-red-500">
                              Out:
                            </span>{" "}
                            <span className="text-gray-700">
                              {attendance.clockOut[index] || "Active"}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm italic">
                        No clock in/out records for today
                      </p>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.section>

          {/* Tasks Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="border-b border-gray-100 px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
            </div>
            <div className="p-6">
              {tasks.length > 0 ? (
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
              ) : (
                <div className="text-center py-8">
                  <Check className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No tasks scheduled for today</p>
                </div>
              )}
            </div>
          </motion.section>

          {/* Diet Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="border-b border-gray-100 px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-900">Diet</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {
                    key: "breakfast",
                    icon: <Utensils className="w-5 h-5 mb-2" />,
                  },
                  { key: "lunch", icon: <Utensils className="w-5 h-5 mb-2" /> },
                  {
                    key: "snacks",
                    icon: <Utensils className="w-5 h-5 mb-2" />,
                  },
                  {
                    key: "dinner",
                    icon: <Utensils className="w-5 h-5 mb-2" />,
                  },
                ].map((meal) => (
                  <motion.button
                    key={meal.key}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`p-4 border rounded-lg shadow-sm transition-all duration-200 flex flex-col items-center justify-center ${
                      diet[meal.key as keyof typeof diet]
                        ? "bg-teal-700 text-white border-teal-700"
                        : "bg-gray-50 text-gray-900 border-gray-300 hover:bg-teal-50 hover:border-teal-300"
                    }`}
                    onClick={() =>
                      handleDietClick(meal.key as keyof typeof diet)
                    }
                  >
                    {diet[meal.key as keyof typeof diet] ? (
                      <div className="text-white mb-2">
                        <Check className="w-5 h-5" />
                      </div>
                    ) : (
                      meal.icon
                    )}
                    <span className="text-lg font-medium">
                      {meal.key.charAt(0).toUpperCase() + meal.key.slice(1)}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.section>
        </div>

        <div className="space-y-8">
          {/* Vitals Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Patient Vitals
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-teal-700 hover:text-teal-600 flex items-center gap-1 px-3 py-1 rounded-full hover:bg-teal-50 transition-colors"
                onClick={() => setShowVitalsInput(!showVitalsInput)}
              >
                <Plus className="w-5 h-5" />
                <span>Add Vitals</span>
              </motion.button>
            </div>

            <div className="p-6">
              {showVitalsInput && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-6 border border-teal-100 rounded-lg p-6 bg-teal-50"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        <div className="flex items-center gap-2 mb-1">
                          <Heart className="w-4 h-4 text-teal-700" />
                          Blood Pressure (mmHg)
                        </div>
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
                        className="block w-full p-3 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        <div className="flex items-center gap-2 mb-1">
                          <Activity className="w-4 h-4 text-teal-700" />
                          Heart Rate (bpm)
                        </div>
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
                        className="block w-full p-3 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        <div className="flex items-center gap-2 mb-1">
                          <Thermometer className="w-4 h-4 text-teal-700" />
                          Temperature (°F)
                        </div>
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
                        className="block w-full p-3 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        <div className="flex items-center gap-2 mb-1">
                          <Lungs className="w-4 h-4 text-teal-700" />
                          Oxygen Level (%)
                        </div>
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
                        className="block w-full p-3 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        <div className="flex items-center gap-2 mb-1">
                          <Droplet className="w-4 h-4 text-teal-700" />
                          Blood Sugar (mg/dL)
                        </div>
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
                        className="block w-full p-3 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 bg-white"
                      />
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
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
                    className="mt-6 px-6 py-3 bg-teal-700 text-white rounded-lg hover:bg-teal-600 transition-all shadow-sm w-full md:w-auto"
                  >
                    Save Vitals
                  </motion.button>
                </motion.div>
              )}

              <div>
                <div
                  className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors"
                  onClick={() => setShowVitalsHistory((prev) => !prev)}
                >
                  <h3 className="text-lg font-medium text-gray-800 flex items-center">
                    <Activity className="w-4 h-4 mr-2 text-teal-700" />
                    Vitals History
                  </h3>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                      showVitalsHistory ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {showVitalsHistory && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-3 space-y-3"
                  >
                    {vitalsHistory.length > 0 ? (
                      vitalsHistory.map((vital, index) => (
                        <div
                          key={index}
                          className="p-4 bg-gray-50 rounded-lg border border-gray-100"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-teal-700">
                              {vital.time}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                            <div className="flex items-center gap-1">
                              <Heart className="w-3 h-3 text-red-500" />
                              <span className="text-gray-700">
                                BP: {vital.bloodPressure}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Activity className="w-3 h-3 text-blue-500" />
                              <span className="text-gray-700">
                                HR: {vital.heartRate}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Thermometer className="w-3 h-3 text-orange-500" />
                              <span className="text-gray-700">
                                Temp: {vital.temperature}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Lungs className="w-3 h-3 text-teal-500" />
                              <span className="text-gray-700">
                                O2: {vital.oxygenLevel}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Droplet className="w-3 h-3 text-purple-500" />
                              <span className="text-gray-700">
                                Sugar: {vital.bloodSugar}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm italic p-3">
                        No vitals recorded today
                      </p>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.section>

          {/* Activity Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="border-b border-gray-100 px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-900">Activity</h2>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
                <input
                  type="text"
                  value={newActivity}
                  onChange={(e) => setNewActivity(e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg w-full md:w-auto flex-grow focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Add new activity"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newActivity.trim()) {
                      handleAddActivity();
                    }
                  }}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-teal-700 text-white rounded-lg hover:bg-teal-600 transition-all shadow-sm w-full md:w-auto flex items-center justify-center gap-2"
                  onClick={handleAddActivity}
                >
                  <Plus className="w-4 h-4" />
                  Add Activity
                </motion.button>
              </div>

              {activities.length > 0 ? (
                <div className="space-y-2">
                  {activities.map((activity, index) => (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      key={index}
                      className="p-4 bg-gray-50 border border-gray-100 rounded-lg shadow-sm flex items-center gap-3"
                    >
                      <div className="bg-teal-100 p-2 rounded-full">
                        <Activity className="w-4 h-4 text-teal-700" />
                      </div>
                      <span>{activity}</span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No activities recorded today</p>
                </div>
              )}
            </div>
          </motion.section>

          {/* Mood Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="border-b border-gray-100 px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-900">Mood</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                {moods.map((mood) => (
                  <motion.button
                    key={mood.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-4 border rounded-lg flex flex-col items-center justify-center transition-all duration-200 shadow-sm ${
                      selectedMood === mood.name
                        ? "bg-teal-700 text-white border-teal-700"
                        : "bg-gray-50 text-gray-900 border-gray-300 hover:bg-teal-50 hover:border-teal-300"
                    }`}
                    onClick={() => {
                      handleMoodSelect(mood.name);
                      setMoodHistory((prev) => [
                        ...prev,
                        {
                          time: format(new Date(), "hh:mm a"),
                          mood: mood.name,
                        },
                      ]);
                    }}
                  >
                    <span className="text-3xl mb-2">{mood.emoji}</span>
                    <span className="text-sm font-medium">{mood.name}</span>
                  </motion.button>
                ))}
              </div>

              <div>
                <div
                  className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors"
                  onClick={() => setShowMoodHistory((prev) => !prev)}
                >
                  <h3 className="text-lg font-medium text-gray-800 flex items-center">
                    <Smile className="w-4 h-4 mr-2 text-teal-700" />
                    Mood History
                  </h3>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                      showMoodHistory ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {showMoodHistory && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-3 space-y-2"
                  >
                    {moodHistory.length > 0 ? (
                      moodHistory.map((mood, index) => (
                        <div
                          key={index}
                          className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex justify-between items-center"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">
                              {moods.find((m) => m.name === mood.mood)?.emoji ||
                                "😐"}
                            </span>
                            <span className="font-medium">{mood.mood}</span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {mood.time}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm italic p-3">
                        No mood entries recorded today
                      </p>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
