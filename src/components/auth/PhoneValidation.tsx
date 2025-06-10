"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Phone, AlertCircle, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
}

// Indian mobile number validation rules
const PHONE_VALIDATION = {
  // Valid starting digits for Indian mobile numbers
  validStartDigits: ["6", "7", "8", "9"],
  length: 10,
  // Common invalid patterns
  invalidPatterns: [
    /^(.)\1{9}$/, // All same digits (1111111111)
    /^0+/, // Starting with zeros
    /^1+/, // Starting with ones
    /^[2-5]/, // Starting with 2,3,4,5 (not valid for mobile)
  ],
}

export function PhoneInput({ value, onChange, disabled, className }: PhoneInputProps) {
  const [touched, setTouched] = useState(false)

  const validatePhone = (phone: string) => {
    if (!phone) return { isValid: false, message: "" }

    if (phone.length < 10) {
      return { isValid: false, message: "Phone number must be 10 digits" }
    }

    if (phone.length > 10) {
      return { isValid: false, message: "Phone number cannot exceed 10 digits" }
    }

    if (!PHONE_VALIDATION.validStartDigits.includes(phone[0])) {
      return { isValid: false, message: "Phone number must start with 6, 7, 8, or 9" }
    }

    for (const pattern of PHONE_VALIDATION.invalidPatterns) {
      if (pattern.test(phone)) {
        return { isValid: false, message: "Please enter a valid phone number" }
      }
    }

    return { isValid: true, message: "Valid phone number" }
  }

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "")
    if (cleaned.length <= 5) return cleaned
    return `${cleaned.slice(0, 5)} ${cleaned.slice(5, 10)}`
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, "").slice(0, 10)
    onChange(cleaned)
    if (!touched) setTouched(true)
  }

  const validation = validatePhone(value)
  const showValidation = touched && value.length > 0

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">Mobile Number</label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center">
          <Phone className="h-4 w-4 text-muted-foreground mr-2" />
          <span className="text-sm text-muted-foreground">+91</span>
        </div>
        <Input
          type="tel"
          placeholder="Enter your phone number"
          value={formatPhoneNumber(value)}
          onChange={handleChange}
          onBlur={() => setTouched(true)}
          className={cn(
            "pl-16 h-12 text-base border-2 transition-colors",
            showValidation && validation.isValid && "border-green-500 focus:border-green-500",
            showValidation && !validation.isValid && value.length === 10 && "border-red-500 focus:border-red-500",
            "focus:border-blue-500",
            className,
          )}
          maxLength={11} // Account for space in formatting
          required
          inputMode="numeric"
          disabled={disabled}
        />
        {showValidation && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {validation.isValid ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : value.length === 10 ? (
              <AlertCircle className="h-4 w-4 text-red-500" />
            ) : null}
          </div>
        )}
      </div>
      {showValidation && !validation.isValid && value.length > 0 && (
        <p className="text-sm text-red-600 flex items-center">
          <AlertCircle className="h-3 w-3 mr-1" />
          {validation.message}
        </p>
      )}
      {showValidation && validation.isValid && (
        <p className="text-sm text-green-600 flex items-center">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          {validation.message}
        </p>
      )}
    </div>
  )
}
