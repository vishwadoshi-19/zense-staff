"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import { ArrowLeft, Lock } from "lucide-react"
import Image from "next/image"
import type { PhoneVerificationState } from "@/types"
import { useRouter } from "next/navigation"
import { setupRecaptcha, sendOTP, verifyOTP } from "@/lib/firebase/auth"
import toast from "react-hot-toast"
import { useAuth } from "@/context/AuthContext"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface PhoneVerificationProps {
  verificationState: PhoneVerificationState
  setVerificationState: React.Dispatch<React.SetStateAction<PhoneVerificationState>>
  onVerified: () => void
}

export const PhoneVerification: React.FC<PhoneVerificationProps> = ({
  verificationState,
  setVerificationState,
  onVerified,
}) => {
  const recaptchaContainerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { setIsNewUser } = useAuth()

  const [loading, setLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)

  useEffect(() => {
    return () => {
      const recaptchaElements = document.querySelectorAll(".grecaptcha-badge")
      recaptchaElements.forEach((element) => {
        element.remove()
      })
    }
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [resendTimer])

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let formattedPhone = verificationState.phoneNumber
      if (!formattedPhone.startsWith("+")) {
        formattedPhone = `+91${formattedPhone}`
      }

      const recaptchaVerifier = setupRecaptcha("recaptcha-container")
      const result = await sendOTP(formattedPhone, recaptchaVerifier)

      if (result.success) {
        setVerificationState((prev) => ({
          ...prev,
          showOTP: true,
          verificationId: result.verificationId,
          phoneNumber: formattedPhone,
        }))
        setResendTimer(30)
        toast.success("OTP sent successfully!")
      } else {
        toast.error("Failed to send OTP. Please try again.")
      }
    } catch (error) {
      console.error("Error sending OTP:", error)
      toast.error("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!verificationState.verificationId) {
      toast.error("Verification ID not found. Please try again.")
      setLoading(false)
      return
    }

    try {
      const result = await verifyOTP(verificationState.verificationId, verificationState.otp, router)

      if (result && result.success) {
        setVerificationState((prev) => ({ ...prev, isVerified: true }));
        toast.success("Phone verified successfully!");
        setIsNewUser(result.isNewUser ?? false);
        onVerified();
        router.push('/terms-and-agreement');
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error)
      toast.error("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (resendTimer > 0) return

    setLoading(true)
    try {
      const recaptchaVerifier = setupRecaptcha("recaptcha-container")
      const result = await sendOTP(verificationState.phoneNumber, recaptchaVerifier)

      if (result.success) {
        setVerificationState((prev) => ({
          ...prev,
          verificationId: result.verificationId,
          otp: "",
        }))
        setResendTimer(30)
        toast.success("OTP resent successfully!")
      } else {
        toast.error("Failed to resend OTP. Please try again.")
      }
    } catch (error) {
      console.error("Error resending OTP:", error)
      toast.error("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleKeypadPress = (value: string) => {
    if (value === "backspace") {
      if (!verificationState.showOTP) {
        setVerificationState((prev) => ({
          ...prev,
          phoneNumber: prev.phoneNumber.slice(0, -1),
        }))
      } else {
        setVerificationState((prev) => ({
          ...prev,
          otp: prev.otp.slice(0, -1),
        }))
      }
    } else {
      if (!verificationState.showOTP) {
        if (verificationState.phoneNumber.length < 10) {
          setVerificationState((prev) => ({
            ...prev,
            phoneNumber: prev.phoneNumber + value,
          }))
        }
      } else {
        if (verificationState.otp.length < 6) {
          setVerificationState((prev) => ({
            ...prev,
            otp: prev.otp + value,
          }))
        }
      }
    }
  }

  const KeypadButton = ({
    value,
    letters,
    onPress,
  }: { value: string; letters?: string; onPress: (value: string) => void }) => (
    <button
      type="button"
      onClick={() => onPress(value)}
      className="bg-white rounded-lg h-11 flex flex-col items-center justify-center text-black hover:bg-gray-50 active:bg-gray-100 transition-colors shadow-sm border border-gray-200 text-sm"

    >
      <span className="text-lg font-medium">{value}</span>
      
    </button>
  )

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="flex-grow px-4 pt-6 pb-2 flex flex-col items-center overflow-hidden">

        {/* {verificationState.showOTP && (
          <button
            onClick={() => setVerificationState((prev) => ({ ...prev, showOTP: false, otp: "" }))}
            className="mb-6 p-2 -ml-2 self-start"
          >
            <ArrowLeft className="h-6 w-6 text-gray-700" />
          </button>
        )} */}

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/airy-adapter-451212-b8.firebasestorage.app/o/assets%2Fzense_logo.png?alt=media&token=5ed099ff-e892-472b-a37c-e6f572bb95e5"
            alt="Logo"
            width={100}
            height={100}
            className="rounded-full"
          />
        </div>

        {!verificationState.showOTP ? (
          <div >
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Can we get your number, please?</h1>
            <p className="text-gray-600 mb-8 text-base">
              This is madatory for logging in.
            </p>

            <form onSubmit={handlePhoneSubmit} className="w-full">
              <div className="mb-6">
                <div className="flex gap-3 mb-4">
                  <div className="bg-gray-100 rounded-lg px-4 py-3 flex items-center shrink-0">
                    <span className="text-gray-700 font-medium whitespace-nowrap">IN +91</span>
                  </div>
                  <Input
                    type="tel"
                    value={verificationState.phoneNumber}
                    onChange={() => {}} // Controlled by keypad
                    className="flex-1 h-12 text-lg border-2 border-gray-200 rounded-lg"
                    placeholder=""
                    readOnly
                    inputMode="none"
                  />
                </div>
              </div>

              <div id="recaptcha-container" ref={recaptchaContainerRef} className="mb-4" />

              <div className="flex items-center justify-center gap-3 text-sm text-gray-600 mb-6">
                <Lock className="h-4 w-4" />
                <span>We never share this with anyone and it won&apos;t be on your profile.</span>
              </div>
            </form>
          </div>
        ) : (
          <div className="w-full max-w-md text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Verify your number</h1>
            <p className="text-gray-600 mb-2 text-base">
              Enter the code we&apos;ve sent by text to {verificationState.phoneNumber}.
            </p>
            {/* <button
              onClick={() => setVerificationState((prev) => ({ ...prev, showOTP: false }))}
              className="text-teal-600 underline mb-8 text-base"
            >
              Change number
            </button> */}

            <form onSubmit={handleOTPSubmit} className="w-full">
              <div className="mb-6 mt-4">
                {/* <label className="text-sm text-gray-600 mb-3 block">Code</label> */}
                <div className="flex gap-2 mb-6 justify-center">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className="w-12 h-12 border-2 border-gray-200 rounded-lg flex items-center justify-center text-xl font-medium bg-white"
                    >
                      {verificationState.otp[index] || ""}
                    </div>
                  ))}
                </div>
              </div>

              {loading && (
                <div className="flex justify-center mb-6">
                  <div className="bg-black text-white px-6 py-2 rounded-full text-sm">••• Loading</div>
                </div>
              )}

              {/* <div className="mb-6">
                {resendTimer > 0 ? (
                  <p className="text-gray-600 text-base">Resend code in {resendTimer}s</p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={loading}
                    className="text-gray-600 text-base"
                  >
                    Didn&apos;t get a code?
                  </button>
                )}
              </div> */}
            </form>
          </div>
        )}
      </div>

      {/* Mobile Keypad */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-100 px-4 pt-2">
  <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">

          <KeypadButton value="1" onPress={handleKeypadPress} />
          <KeypadButton value="2" letters="ABC" onPress={handleKeypadPress} />
          <KeypadButton value="3" letters="DEF" onPress={handleKeypadPress} />
          <KeypadButton value="4" letters="GHI" onPress={handleKeypadPress} />
          <KeypadButton value="5" letters="JKL" onPress={handleKeypadPress} />
          <KeypadButton value="6" letters="MNO" onPress={handleKeypadPress} />
          <KeypadButton value="7" letters="PQRS" onPress={handleKeypadPress} />
          <KeypadButton value="8" letters="TUV" onPress={handleKeypadPress} />
          <KeypadButton value="9" letters="WXYZ" onPress={handleKeypadPress} />
          <div></div>
          <KeypadButton value="0" onPress={handleKeypadPress} />
          <button
            type="button"
            onClick={() => handleKeypadPress("backspace")}
            className="bg-white rounded-lg h-11 flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 transition-colors shadow-sm border border-gray-200"
          >
            <span className="text-2xl">⌫</span>
          </button>
        </div>

        {/* Submit Button */}
        {!verificationState.showOTP ? (
          <div className="mt-3 max-w-sm mx-auto">
            <Button
              onClick={handlePhoneSubmit}
              disabled={loading || verificationState.phoneNumber.length !== 10}
              className="w-full h-12 bg-teal-600 hover:bg-teal-700 text-white rounded-md font-medium"
            >
              {loading ? "Sending..." : "Continue"}
            </Button>
          </div>
        ) : (
          <div className="mt-6 max-w-sm mx-auto">
            <Button
              onClick={handleOTPSubmit}
              disabled={loading || verificationState.otp.length !== 6}
              className="w-full h-12 bg-teal-600 hover:bg-teal-700 text-white rounded-md font-medium"
            >
              {loading ? "Verifying..." : "Verify"}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
