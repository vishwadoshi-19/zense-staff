"use client";

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Phone, KeyRound } from "lucide-react";
import Image from "next/image";
import { PhoneVerificationState } from "@/types";
import { useRouter } from "next/navigation";
import { setupRecaptcha, sendOTP, verifyOTP } from "@/lib/firebase/auth";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

interface PhoneVerificationProps {
  verificationState: PhoneVerificationState;
  setVerificationState: React.Dispatch<
    React.SetStateAction<PhoneVerificationState>
  >;
  onVerified: () => void;
}

export const PhoneVerification: React.FC<PhoneVerificationProps> = ({
  verificationState,
  setVerificationState,
  onVerified,
}) => {
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { setIsNewUser } = useAuth();

  useEffect(() => {
    // Cleanup function to remove recaptcha when component unmounts
    return () => {
      const recaptchaElements = document.querySelectorAll(".grecaptcha-badge");
      recaptchaElements.forEach((element) => {
        element.remove();
      });
    };
  }, []);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Format phone number to E.164 format if not already
      let formattedPhone = verificationState.phoneNumber;
      if (!formattedPhone.startsWith("+")) {
        // Assuming Indian phone numbers
        formattedPhone = `+91${formattedPhone}`;
      }

      // Setup recaptcha
      const recaptchaVerifier = setupRecaptcha("recaptcha-container");

      // Send OTP
      const result = await sendOTP(formattedPhone, recaptchaVerifier);

      if (result.success) {
        setVerificationState((prev) => ({
          ...prev,
          showOTP: true,
          verificationId: result.verificationId,
          phoneNumber: formattedPhone,
        }));
        toast.success("OTP sent successfully!");
      } else {
        toast.error("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!verificationState.verificationId) {
      toast.error("Verification ID not found. Please try again.");
      return;
    }

    try {
      const result = await verifyOTP(
        verificationState.verificationId,
        verificationState.otp,
        router
      );

      if (result && result.success) {
        setVerificationState((prev) => ({ ...prev, isVerified: true }));
        toast.success("Phone verified successfully!");
        setIsNewUser(result.isNewUser ?? false);
        onVerified();
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-xl shadow-md p-8"
      >
        <div className="text-center mb-8">
          <div className="w-30 h-30 mx-auto mb-4 rounded-full overflow-hidden relative">
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/airy-adapter-451212-b8.firebasestorage.app/o/assets%2Fzense_logo.png?alt=media&token=5ed099ff-e892-472b-a37c-e6f572bb95e5"
              alt="Healthcare"
              width={96}
              height={96}
              className="w-full h-full object-cover"
              style={{ objectFit: "cover" }}
            />
          </div>
          <h2 className="text-3xl text-nowrap font-bold text-gray-800">
            Phone Verification
          </h2>
        </div>
        <form
          onSubmit={
            verificationState.showOTP ? handleOTPSubmit : handlePhoneSubmit
          }
          className="space-y-6"
        >
          {!verificationState.showOTP ? (
            <>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="tel"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-700 focus:border-cyan-700"
                  placeholder="Enter your phone number"
                  value={verificationState.phoneNumber}
                  onChange={(e) =>
                    setVerificationState({
                      ...verificationState,
                      phoneNumber: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div id="recaptcha-container" ref={recaptchaContainerRef}></div>
            </>
          ) : (
            <>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-700 focus:border-cyan-700"
                  placeholder="Enter OTP"
                  value={verificationState.otp}
                  onChange={(e) =>
                    setVerificationState({
                      ...verificationState,
                      otp: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </>
          )}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-700 focus:ring-offset-1 text-xl"
          >
            {verificationState.showOTP ? "Verify OTP" : "Send OTP"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
