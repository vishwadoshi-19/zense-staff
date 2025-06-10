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
import { updateJobStatus } from "@/lib/firebase/firestore";
import { useAuth } from "@/context/AuthContext";

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
  patientInfo: any;
  staffInfo: any;
  guardianInfo: any;
  serviceInfo: any;
  serviceType: string;
  serviceDate: string;
  serviceTime: string;
  serviceLocation: string;
  serviceNotes: string;
  staffId: string;
}

interface JobCardProps {
  job: Job;
}

export const JobCard = ({ job }: JobCardProps) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [action, setAction] = useState<"accept" | "decline" | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const { user } = useAuth();

  const handleAction = (type: "accept" | "decline") => {
    setAction(type);
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    if (!user) return;
    
    setIsUpdating(true);
    try {
      const newStatus = action === "accept" ? "ongoing" : "cancelled";
      const result = await updateJobStatus(job.id.toString(), newStatus, user.uid);
      
      if (result.success) {
        // Optionally refresh the jobs list or update local state
        window.location.reload(); // Simple refresh for now
      } else {
        console.error("Failed to update job status");
      }
    } catch (error) {
      console.error("Error updating job:", error);
    } finally {
      setIsUpdating(false);
      setShowConfirmation(false);
    }
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
              {job.patientInfo?.name}
            </h3>
            <p className="text-sm text-gray-500">Age: {job.patientInfo?.age}</p>
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
            {job.patientInfo?.state}, {job.patientInfo?.city}, {job.patientInfo?.pincode}
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="w-5 h-5 mr-2 text-gray-400" />
            {job.serviceType}
          </div>
          <div className="flex items-center text-gray-600">
            <CalendarSearchIcon className="w-5 h-5 mr-2 text-gray-400" />
            {new Date(job.startDate).toLocaleString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              
            })} -{" "}
            {new Date(job.endDate).toLocaleString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              
            })}
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
        {canJobBeAccepted && (
          <div className="flex gap-3">
            <button
              onClick={() => handleAction("accept")}
              disabled={isUpdating}
              className="flex-1 bg-teal-700 text-white px-4 py-2 rounded-lg hover:bg-teal-600 
                       transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? "Updating..." : "Accept"}
            </button>
            <button
              onClick={() => handleAction("decline")}
              disabled={isUpdating}
              className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg 
                       hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? "Updating..." : "Decline"}
            </button>
          </div>
        )}
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
