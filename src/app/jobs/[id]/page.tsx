"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Job } from "@/components/dashboard/JobCard";
// import { jobs } from "../page";

const jobs = [
  {
    id: 1,
    patientName: "Sarah Johnson",
    age: 72,
    description: "Post-surgery care and rehabilitation assistance",
    requirements: ["Wound dressing", "Mobility assistance", "Vital monitoring"],
    location: "Green Park, Delhi",
    timing: "12-hour care",
    status: "available",
  },
  {
    id: 2,
    patientName: "Raj Patel",
    age: 65,
    description: "Diabetes management and daily care",
    requirements: [
      "Blood sugar monitoring",
      "Medication management",
      "Diet assistance",
    ],
    location: "Dwarka, Delhi",
    timing: "24-hour care",
    status: "assigned",
  },
  // Add more jobs as needed
  {
    id: 3,
    patientName: "Vikram Singh",
    age: 66,
    description: "Lukemia patient care",
    requirements: [
      "Blood sugar monitoring",
      "Medication management",
      "Diet assistance",
    ],
    location: "Rohini, Delhi",
    timing: "24-hour care",
    status: "completed",
  },
  {
    id: 4,
    patientName: "Vikram Singh",
    age: 55,
    description: "Overthinker patient care",
    requirements: [
      "Blood sugar monitoring",
      "Medication management",
      "Diet assistance",
    ],
    location: "Ookhla , Delhi",
    timing: "12-hour care",
    status: "ongoing",
  },
];

const JobDetails = () => {
  const router = useRouter();
  const { id } = useParams();
  const [jobData, setJobData] = useState<Job | null>(null);

  useEffect(() => {
    if (id) {
      const job = jobs.find((job) => job.id === parseInt(id as string));
      setJobData(job || null);
    }
  }, [id]);

  if (!jobData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => router.push("/jobs")}
        className="text-gray-500 hover:text-gray-700"
      >
        Close
      </button>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        {jobData.patientName}
      </h1>
      <p className="text-gray-700 mb-4">{jobData.description}</p>
      <div className="flex gap-4">
        <button className="bg-green-500 text-white px-4 py-2 rounded">
          Accept
        </button>
        <button className="bg-red-500 text-white px-4 py-2 rounded">
          Decline
        </button>
      </div>
    </div>
  );
};

export default JobDetails;
