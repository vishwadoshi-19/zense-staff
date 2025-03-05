"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoadingScreen from "@/components/common/LoadingScreen";
import { getStaffDetails } from "@/lib/firebase/firestore";

export default function Home() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkUserStatus = async () => {
      if (!isLoading) {
        if (isAuthenticated && user) {
          const staffDetails = await getStaffDetails(user.uid);
          if (staffDetails && staffDetails.success) {
            // Pre-populate form fields with staffDetails.data
            // Redirect to the first not-filled form step
            router.push("/jobs");
          } else {
            router.push("/onboarding");
          }
        } else {
          router.push("/sign-in");
        }
      }
    };
    checkUserStatus();
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return null;
}
