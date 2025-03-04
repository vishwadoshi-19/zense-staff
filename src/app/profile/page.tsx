"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  User,
  Mail,
  Phone,
  Award,
  Briefcase,
  Star,
  Calendar,
  Clock,
  ChevronRight,
  Edit2,
  Check,
} from "lucide-react";
import { ProfileSection } from "@/components/profile/ProfileSection";
import { StatsCard } from "@/components/profile/StatsCard";
import { TestimonialCard } from "@/components/profile/TestimonialCard";
import { useAuth } from "@/context/AuthContext";
import { getStaffDetails } from "@/lib/firebase/firestore";
import { StaffDetails } from "@/types/index";
import LoadingScreen from "@/components/common/LoadingScreen";

export default function Profile() {
  const { user, userData, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [staffDetails, setStaffDetails] = useState<StaffDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/sign-in");
      } else if (userData?.status !== "registered") {
        router.push("/onboarding");
      }
    }
  }, [isAuthenticated, isLoading, router, userData]);

  useEffect(() => {
    const fetchStaffDetails = async () => {
      if (user) {
        setIsLoadingDetails(true);
        try {
          const result = await getStaffDetails(user.uid);
          if (result.success) {
            if (result.data) {
              setStaffDetails(result.data);
            }
          }
        } catch (error) {
          console.error("Error fetching staff details:", error);
        } finally {
          setIsLoadingDetails(false);
        }
      }
    };

    if (isAuthenticated) {
      fetchStaffDetails();
    }
  }, [isAuthenticated, user]);

  if (isLoading || isLoadingDetails) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated || !userData) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      {/* Header Section */}
      <div className="bg-blue-500 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-8 mb-8">
        <div className="flex items-center gap-6">
          <div className="relative">
            <Image
              src={
                userData.profilePhoto ||
                "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&h=300"
              }
              alt={userData.name}
              width={100}
              height={100}
              className="rounded-full border-4 border-white"
            />
            <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg">
              <Edit2 className="w-4 h-4 text-blue-500" />
            </button>
          </div>
          <div className="text-white">
            <h1 className="text-2xl font-bold">{userData.name}</h1>
            <p className="text-blue-100">
              {staffDetails?.jobRole || "Healthcare Professional"}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatsCard icon={Star} title="Rating" value={4.8} suffix="/5" />
        <StatsCard icon={Check} title="Tasks" value={1250} />
        <StatsCard icon={Clock} title="Hours" value={3200} />
        <StatsCard icon={Calendar} title="On Time" value={98} suffix="%" />
      </div>

      {/* Profile Sections */}
      <div className="space-y-6">
        <ProfileSection
          icon={User}
          title="Personal Information"
          items={[
            { label: "Phone", value: userData.phone || "Not provided" },
            { label: "Location", value: userData.location || "Not provided" },
            { label: "Gender", value: userData.gender || "Not provided" },
          ]}
        />

        {staffDetails && (
          <>
            <ProfileSection
              icon={Award}
              title="Specializations"
              items={staffDetails.extraServicesOffered.map((service) => ({
                value: service,
              }))}
            />

            <ProfileSection
              icon={Award}
              title="Education & Certifications"
              items={[
                {
                  value: staffDetails.educationQualification,
                  subtitle: `${staffDetails.experienceYears} years of experience`,
                },
              ]}
            />

            <ProfileSection
              icon={Briefcase}
              title="Preferred Shifts"
              items={staffDetails.preferredShifts.map((shift) => ({
                value: shift,
              }))}
            />

            {/* Testimonials */}
            {staffDetails.selfTestimonial && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Testimonials
                </h2>
                <div className="space-y-4">
                  <TestimonialCard
                    testimonial={{
                      id: 1,
                      patientName: staffDetails.selfTestimonial.customerName,
                      rating: 5,
                      comment: "Testimonial provided by staff member",
                      date: "Self-submitted",
                    }}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
