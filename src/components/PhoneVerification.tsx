import React from "react";
import { motion } from "framer-motion";
import { Phone, KeyRound } from "lucide-react";
import { PhoneVerificationState } from "../types";
import Image from "next/image";

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
  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationState((prev) => ({ ...prev, showOTP: true }));
  };

  const handleOTPSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationState.otp === "123456") {
      setVerificationState((prev) => ({ ...prev, isVerified: true }));
      onVerified();
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Image
          src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=200&h=200"
          alt="Healthcare"
          width={96}
          height={96}
          className="w-24 h-24 mx-auto mb-6 rounded-full object-cover"
        />

        <h1 className="text-4xl font-bold text-blue-500 mb-2">Welcome!</h1>
        <p className="text-blue-500 text-lg">
          Sign up to start your career as a caregiver
        </p>

        {!verificationState.showOTP ? (
          <form onSubmit={handlePhoneSubmit} className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-blue-200" />
              </div>
              <input
                type="tel"
                value={verificationState.phoneNumber}
                onChange={(e) =>
                  setVerificationState((prev) => ({
                    ...prev,
                    phoneNumber: e.target.value,
                  }))
                }
                placeholder="Enter your phone number"
                className="block w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 border border-white/20 
                         text-blue-500 placeholder-blue-300 focus:outline-none focus:ring-2 
                         focus:ring-blue/50 focus:border-transparent"
                required
                pattern="[0-9]{10}"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-white text-blue-600 py-4 px-6 rounded-xl font-semibold
                       hover:bg-blue-50 transition-colors duration-200"
            >
              Get OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleOTPSubmit} className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <KeyRound className="h-5 w-5 text-blue-200" />
              </div>
              <input
                type="text"
                value={verificationState.otp}
                onChange={(e) =>
                  setVerificationState((prev) => ({
                    ...prev,
                    otp: e.target.value,
                  }))
                }
                placeholder="Enter OTP"
                className="block w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 border border-white/20 
                         text-blue-500 placeholder-blue-300 focus:outline-none focus:ring-2 
                         focus:ring-blue/50 focus:border-transparent"
                required
                pattern="[0-9]{6}"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-white text-blue-600 py-4 px-6 rounded-xl font-semibold
                       hover:bg-blue-50 transition-colors duration-200"
            >
              Verify OTP
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};
