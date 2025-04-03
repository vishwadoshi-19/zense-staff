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
import ReviewsSection from "@/components/ReviewsSection";
import { StatsCard } from "@/components/profile/StatsCard";
import { TestimonialCard } from "@/components/profile/TestimonialCard";
import { useAuth } from "@/context/AuthContext";
import { getStaffDetails } from "@/lib/firebase/firestore";
import { StaffDetails } from "@/types";
import LoadingScreen from "@/components/common/LoadingScreen";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/config"; // Import the auth object
import toast from "react-hot-toast";
import { LogOut } from "lucide-react";

export default function Profile() {
  const { user, userData, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [staffDetails, setStaffDetails] = useState<StaffDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);

  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false); // State for confirmation section

  const handleSignOut = async () => {
    try {
      await signOut(auth); // Use the correct auth object
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  const handleLogoutConfirmation = () => {
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } fixed inset-0 flex items-center justify-center z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`} // Explicitly center toast
        >
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-full w-96 max-h-full overflow-auto">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Logout
            </h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  handleSignOut();
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/sign-in");
      } else if (userData?.status === "unregistered") {
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
          if (result && result.success) {
            if (result.data) {
              console.log("Staff details fetched:", result.data);
              setStaffDetails(result.data);
            } else {
              console.log("No staff details found.");
            }
          }
        } catch (error) {
          console.error("Error fetching staff details:", error);
        } finally {
          // console.log("Staff details loading finished.");
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
      <div className="bg-teal-700 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-8 mb-8">
        <div className="flex items-center gap-6">
          <div className="relative">
            <Image
              src={
                staffDetails?.profilePhoto ||
                "https://firebasestorage.googleapis.com/v0/b/airy-adapter-451212-b8.firebasestorage.app/o/assets%2Fzense_logo.png?alt=media&token=5ed099ff-e892-472b-a37c-e6f572bb95e5"
              }
              alt={staffDetails?.name || "Profile Picture"}
              width={100}
              height={100}
              className="rounded-full border-4 border-white"
            />
            <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg">
              <Edit2 className="w-4 h-4 text-teal-700" />
            </button>
          </div>
          <div className="text-white">
            <h1 className="text-2xl font-bold">
              {staffDetails?.name || "Staff"}
            </h1>
            <p className="text-teal-100">
              {staffDetails?.jobRole || "Healthcare Professional"}
            </p>
            <p className="text-teal-100">
              {staffDetails?.agency || "Zense Agency"}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatsCard icon={Star} title="Rating" value={4.7} suffix="/5" />
        <StatsCard icon={Check} title="Jobs Completed" value={38} />
        <StatsCard icon={Clock} title="Income" value={50000} />
        <StatsCard icon={Calendar} title="On Time" value={98} suffix="%" />
      </div>

      {/* Profile Sections */}
      <div className="space-y-6">
        <ProfileSection
          icon={User}
          title="Personal Information"
          items={[
            { label: "Phone", value: staffDetails?.phone || "Not provided" },
            {
              label: "Location",
              value: staffDetails?.district || "Not provided",
            },
            { label: "Gender", value: staffDetails?.gender || "Not provided" },
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
            <ReviewsSection />

            <div className="mt-8 space-y-4">
              <button
                onClick={() =>
                  setShowLogoutConfirmation(!showLogoutConfirmation)
                }
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
              >
                <LogOut className="h-5" />
                <span className="text-md font-medium">Logout</span>
              </button>
              {showLogoutConfirmation && (
                <div className="p-4 bg-gray-100 rounded-lg shadow">
                  <p className="text-gray-700 mb-4">
                    Are you sure you want to log out?
                  </p>
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => setShowLogoutConfirmation(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      Confirm Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
