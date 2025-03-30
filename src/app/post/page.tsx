"use client";

import React, { useState } from "react";
import { db } from "@/lib/firebase/config";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";

interface Task {
  id: number;
  title: string;
  completed: boolean;
  time: string;
}

type District = "delhi" | "mumbai" | "bangalore";

const DISTRICTS: string[] = ["Delhi", "Mumbai", "Bangalore"];

const SUB_DISTRICTS: Record<District, string[]> = {
  delhi: [
    "Central Delhi",
    "East Delhi",
    "New Delhi",
    "North Delhi",
    "North East Delhi",
    "North West Delhi",
    "Shahdara",
    "South Delhi",
    "South East Delhi",
    "South West Delhi",
    "West Delhi",
  ],
  mumbai: [
    "Colaba",
    "Dadar",
    "Andheri",
    "Bandra",
    "Borivali",
    "Goregaon",
    "Juhu",
    "Kurla",
    "Mulund",
    "Powai",
    "Vikhroli",
  ],
  bangalore: [
    "Bangalore East",
    "Bangalore North",
    "Bangalore South",
    "Yelahanka",
    "KR Puram",
    "Jayanagar",
    "Rajajinagar",
    "BTM Layout",
    "Malleswaram",
    "Basavanagudi",
    "Whitefield",
    "Electronic City",
  ],
};

const Post = () => {
  const [jobForm, setJobForm] = useState({
    customerName: "",
    customerAge: "",
    description: "",
    district: "",
    subDistrict: "",
    pincode: "",
    requirements: "",
    JobType: "",
    startDate: "",
    endDate: "",
    staffId: "",
    status: "assigned",
  });

  const [taskForm, setTaskForm] = useState({
    userId: "",
    date: "",
    tasks: [] as Task[],
  });

  const handleJobChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setJobForm({ ...jobForm, [e.target.name]: e.target.value });
  };

  const handleTaskChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskForm({ ...taskForm, [e.target.name]: e.target.value });
  };

  const submitJobForm = async () => {
    console.log("Submitting job form:", jobForm);
    try {
      const jobData = {
        customerName: jobForm.customerName,
        customerAge: jobForm.customerAge,
        description: jobForm.description,
        district: jobForm.district,
        subDistrict: jobForm.subDistrict,
        pincode: jobForm.pincode,
        requirements: jobForm.requirements.split(","),
        JobType: jobForm.JobType,
        startDate: new Date(jobForm.startDate).toISOString(),
        endDate: new Date(jobForm.endDate).toISOString(),
        staffId: jobForm.staffId,
        status: jobForm.status,
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, "jobs"), jobData);
      console.log("Job added successfully:", jobData);
    } catch (error) {
      console.error("Error adding job:", error);
    }
  };

  const submitTaskForm = async () => {
    console.log("Submitting tasks:", taskForm.tasks);
    try {
      const datePath = taskForm.date; // Ensure date is provided in the correct format (e.g., YYYY-MM-DD)
      console.log("Date path:", datePath);
      const dailyTaskRef = doc(
        db,
        `users/${taskForm.userId}/daily-tasks`,
        datePath
      );
      console.log("Daily task reference:", dailyTaskRef);
      console.log("userid : ", taskForm.userId);
      await setDoc(dailyTaskRef, { tasks: taskForm.tasks });
      console.log("Tasks added successfully:", taskForm.tasks);
    } catch (error) {
      console.error("Error adding tasks:", error);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Post Jobs and Tasks
      </h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Post a Job</h2>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <input
            type="text"
            name="customerName"
            placeholder="Customer Name"
            value={jobForm.customerName}
            onChange={handleJobChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="number"
            name="customerAge"
            placeholder="Customer Age"
            value={jobForm.customerAge}
            onChange={handleJobChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={jobForm.description}
            onChange={handleJobChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <select
            name="district"
            value={jobForm.district}
            onChange={(e) =>
              setJobForm({
                ...jobForm,
                district: e.target.value,
                subDistrict: "",
              })
            }
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select District</option>
            {DISTRICTS.map((district) => (
              <option key={district} value={district.toLowerCase()}>
                {district}
              </option>
            ))}
          </select>
          <select
            name="subDistrict"
            value={jobForm.subDistrict}
            onChange={(e) =>
              setJobForm({ ...jobForm, subDistrict: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded"
            disabled={!jobForm.district}
          >
            <option value="">Select Sub-district</option>
            {jobForm.district &&
              SUB_DISTRICTS[jobForm.district as District]?.map(
                (subDistrict) => (
                  <option key={subDistrict} value={subDistrict}>
                    {subDistrict}
                  </option>
                )
              )}
          </select>
          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={jobForm.pincode}
            onChange={handleJobChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {/* <textarea
            name="description"
            placeholder="Job description"
            value={jobForm.description}
            onChange={handleJobChange}
            className="w-full p-2 border border-gray-300 rounded"
          /> */}
          <input
            type="text"
            name="requirements"
            placeholder="Requirements - comma separated"
            value={jobForm.requirements}
            onChange={handleJobChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="JobType"
            placeholder="Job Type"
            value={jobForm.JobType}
            onChange={handleJobChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="date"
            name="startDate"
            placeholder="Start Date"
            value={jobForm.startDate}
            onChange={handleJobChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="date"
            name="endDate"
            placeholder="End Date"
            value={jobForm.endDate}
            onChange={handleJobChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="staffId"
            placeholder="Staff ID"
            value={jobForm.staffId}
            onChange={handleJobChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <select
            name="status"
            value={jobForm.status}
            onChange={handleJobChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="assigned">Assigned</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
          <button
            onClick={submitJobForm}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Submit Job
          </button>
        </form>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Post a Task</h2>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <input
            type="text"
            name="userId"
            placeholder="User ID"
            value={taskForm.userId}
            onChange={handleTaskChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="date"
            name="date"
            placeholder="Date"
            value={taskForm.date}
            onChange={handleTaskChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {taskForm.tasks.map((task, index) => (
            <div key={task.id} className="space-y-2">
              <input
                type="text"
                placeholder="Task Title"
                value={task.title}
                onChange={(e) =>
                  setTaskForm((prev) => {
                    const updatedTasks = [...prev.tasks];
                    updatedTasks[index].title = e.target.value;
                    return { ...prev, tasks: updatedTasks };
                  })
                }
                className="w-full p-2 border border-gray-300 rounded"
              />
              <div className="flex items-center gap-2">
                <div>Completed</div>
                <input
                  type="checkbox"
                  placeholder="Completed"
                  checked={task.completed}
                  onChange={(e) =>
                    setTaskForm((prev) => {
                      const updatedTasks = [...prev.tasks];
                      updatedTasks[index].completed = e.target.checked;
                      return { ...prev, tasks: updatedTasks };
                    })
                  }
                />
              </div>
              <input
                type="time"
                value={task.time}
                onChange={(e) =>
                  setTaskForm((prev) => {
                    const updatedTasks = [...prev.tasks];
                    updatedTasks[index].time = e.target.value;
                    return { ...prev, tasks: updatedTasks };
                  })
                }
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setTaskForm((prev) => ({
                ...prev,
                tasks: [
                  ...prev.tasks,
                  { id: Date.now(), title: "", completed: false, time: "" },
                ],
              }))
            }
            className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
          >
            Add Task
          </button>
          <button
            onClick={submitTaskForm}
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            Submit Tasks
          </button>
        </form>
      </div>
    </div>
  );
};

export default Post;
