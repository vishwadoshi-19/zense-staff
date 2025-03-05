"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Job } from "@/components/JobCard";
import { jobs } from "../page";

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
