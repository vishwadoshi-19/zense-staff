"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PhoneVerification } from "@/components/auth/PhoneVerification";
import { useAuth } from "@/context/AuthContext";
import LoadingScreen from "@/components/common/LoadingScreen";
import toast from "react-hot-toast";

export default function SignIn() {
  const { isAuthenticated, isLoading, isNewUser, signOut } = useAuth();
  const router = useRouter();
  const [verificationState, setVerificationState] = useState({
    verificationId: null,
    phoneNumber: "",
    showOTP: false,
    otp: "",
    isVerified: false,
  });

  useEffect(() => {
    const handleDefaultRouteBehaviour = async () => {
      try {
        await signOut();
        toast.success("Signed out successfully");
        router.push("/sign-in");
      } catch (error) {
        toast.error("Failed to sign out");
      }
    };
    handleDefaultRouteBehaviour();
  });

  const handlePhoneVerified = () => {
    if (!isLoading) {
      if (isNewUser) {
        router.replace("/onboarding"); // Redirect to onboarding page
      } else {
        router.replace("/jobs"); // Redirect to jobs page
      }
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <PhoneVerification
        verificationState={verificationState}
        setVerificationState={setVerificationState}
        onVerified={handlePhoneVerified}
      />
    </div>
  );
}
