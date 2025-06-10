"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { fetchJobs } from "@/lib/firebase/firestore";

interface JobDetails {
  id: string;
  status: "ongoing" | "completed" | "cancelled" | "assigned";
  patientInfo: {
    name: string;
    age: number;
    [key: string]: any;
  };
  staffInfo: {
    staffId: string;
    [key: string]: any;
  };
  guardianInfo: {
    [key: string]: any;
  };
  serviceInfo: {
    [key: string]: any;
  };
  serviceType: string;
  serviceDate: string;
  serviceTime: string;
  serviceLocation: string;
  serviceStatus: string;
  serviceNotes: string;
  staffId: string;
  customerName: string;
  customerAge: number;
  description: string;
  requirements: string[];
  district: string;
  subDistrict: string;
  pincode: number;
  JobType: string;
  startDate: string;
  endDate: string;
  [key: string]: any;
}

interface UserAvailability {
  isAvailable: boolean;
  nextAvailableDate?: string;
  workingHours?: {
    start: string;
    end: string;
  };
}

interface UserContextType {
  ongoingJob: JobDetails | null;
  availability: UserAvailability;
  isLoading: boolean;
  refreshUserData: () => Promise<void>;
}

const defaultAvailability: UserAvailability = {
  isAvailable: true,
};

const UserContext = createContext<UserContextType>({
  ongoingJob: null,
  availability: defaultAvailability,
  isLoading: true,
  refreshUserData: async () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, userData } = useAuth();
  const [ongoingJob, setOngoingJob] = useState<JobDetails | null>(null);
  const [availability, setAvailability] = useState<UserAvailability>(defaultAvailability);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = async () => {
    if (!user || !userData) {
      setOngoingJob(null);
      setAvailability(defaultAvailability);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Fetch jobs using the actual function
      const jobsResponse = await fetchJobs(userData.status, user);
      
      if ('jobs' in jobsResponse && Array.isArray(jobsResponse.jobs)) {
        // Find the first ongoing job
        const ongoingJob = jobsResponse.jobs.find(job => job.status === "ongoing");
        if (ongoingJob) {
          setOngoingJob(ongoingJob);
        } else {
          setOngoingJob(null);
        }
      } else {
        setOngoingJob(null);
      }

      // Keep mock availability for now
      const mockAvailability: UserAvailability = {
        isAvailable: true,
        workingHours: {
          start: "09:00",
          end: "17:00",
        },
      };
      setAvailability(mockAvailability);

    } catch (error) {
      console.error("Error fetching user data:", error);
      setOngoingJob(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user, userData]);

  const value = {
    ongoingJob,
    availability,
    isLoading,
    refreshUserData: fetchUserData,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}; 