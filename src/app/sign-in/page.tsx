"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PhoneVerification } from "@/components/auth/PhoneVerification";
import { useAuth } from "@/context/AuthContext";
import LoadingScreen from "@/components/common/LoadingScreen";

export default function SignIn() {
  const { isLoading, isNewUser, userData } = useAuth();
  const router = useRouter();
  const [verificationState, setVerificationState] = useState({
    verificationId: null,
    phoneNumber: "",
    showOTP: false,
    otp: "",
    isVerified: false,
  });

  const handlePhoneVerified = () => {
    // Let RouteGuard handle the redirects based on user status
    // Just trigger a re-render by doing nothing
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
