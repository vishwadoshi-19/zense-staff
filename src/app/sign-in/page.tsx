"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PhoneVerification } from "@/components/auth/PhoneVerification"
import { useAuth } from "@/context/AuthContext"
import LoadingScreen from "@/components/common/LoadingScreen"

export default function SignIn() {
  const { isLoading } = useAuth()
  const router = useRouter()
  const [verificationState, setVerificationState] = useState({
    verificationId: null,
    phoneNumber: "",
    showOTP: false,
    otp: "",
    isVerified: false,
  })

  useEffect(() => {
    // Prevent body scrolling (works better on iOS with additional styles)
    document.body.style.overflow = "hidden"
    document.body.style.position = "fixed"
    document.body.style.inset = "0"
    document.body.style.width = "100%"
    document.body.style.height = "100%"

    return () => {
      // Restore body scroll on unmount
      document.body.style.overflow = ""
      document.body.style.position = ""
      document.body.style.inset = ""
      document.body.style.width = ""
      document.body.style.height = ""
    }
  }, [])

  const handlePhoneVerified = () => {
    // No-op, RouteGuard will handle redirect
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <main
      className={`
        fixed top-0 left-0 w-screen h-screen overflow-hidden bg-white
        flex flex-col items-center justify-center
        md:hidden   /* Hide on tablet/desktop */
      `}
    >
      <PhoneVerification
        verificationState={verificationState}
        setVerificationState={setVerificationState}
        onVerified={handlePhoneVerified}
      />
    </main>
  )
}
