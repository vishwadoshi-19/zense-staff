"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Clock,
  User,
  AlertCircle,
  CalendarSearchIcon,
} from "lucide-react";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";

export interface Job {
  id: number;
  customerName: string;
  customerAge: number;
  description: string;
  requirements: string[];
  location: string;
  district: string;
  subDistrict: string;
  pincode: number;
  JobType: string;
  status: string;
  startDate: string;
  endDate: string;
}

interface JobCardProps {
  job: Job;
}

export const JobCard = ({ job }: JobCardProps) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [action, setAction] = useState<"accept" | "decline" | null>(null);

  const handleAction = (type: "accept" | "decline") => {
    setAction(type);
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    // Handle the confirmation action here
    console.log(`Job ${action}ed:`, job.id);
    setShowConfirmation(false);
  };

  const canJobBeAccepted =
    job.status === "available" || job.status === "assigned";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
    >
      {/* <a href={`/jobs/${job.id}`} className="block"></a> */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {job.customerName}
            </h3>
            <p className="text-sm text-gray-500">Age: {job.customerAge}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              job.status === "available"
                ? "bg-green-100 text-green-800"
                : job.status === "assigned"
                ? "bg-teal-100 text-teal-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
          </span>
        </div>

        <p className="text-gray-600 mb-4">{job.description}</p>

        <div className="space-y-3 mb-6">
          <div className="flex items-center text-gray-600">
            <MapPin className="w-5 h-5 mr-2 text-gray-400" />
            {job.subDistrict}, {job.district}, {job.pincode}
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="w-5 h-5 mr-2 text-gray-400" />
            {job.JobType}
          </div>
          <div className="flex items-center text-gray-600">
            <CalendarSearchIcon className="w-5 h-5 mr-2 text-gray-400" />
            {new Date(job.startDate).toLocaleDateString("en-GB")} -{" "}
            {new Date(job.endDate).toLocaleDateString("en-GB")}
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <h4 className="text-sm font-medium text-gray-900">Requirements:</h4>
          <ul className="space-y-1">
            {job.requirements.map((req, index) => (
              <li
                key={index}
                className="text-sm text-gray-600 flex items-center"
              >
                <span className="w-1.5 h-1.5 bg-teal-700 rounded-full mr-2" />
                {req}
              </li>
            ))}
          </ul>
        </div>
        {/* {canJobBeAccepted && (
          <div className="flex gap-3">
            <button
              onClick={() => handleAction("accept")}
              className="flex-1 bg-teal-700 text-white px-4 py-2 rounded-lg hover:bg-teal-600 
                       transition-colors duration-200"
            >
              Accept
            </button>
            <button
              onClick={() => handleAction("decline")}
              className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg 
                       hover:bg-gray-50 transition-colors duration-200"
            >
              Decline
            </button>
          </div>
        )} */}
      </div>

      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirm}
        title={`${action === "accept" ? "Accept" : "Decline"} Assignment`}
        message={`Are you sure you want to ${action} this assignment?`}
        confirmText={action === "accept" ? "Accept" : "Decline"}
        confirmColor={action === "accept" ? "blue" : "gray"}
      />
    </motion.div>
  );
};
