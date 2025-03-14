import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Check } from "lucide-react";
import { ShiftsState } from "../types";
import { FormNavigation } from "./onboarding/FormNavigation";

const SHIFT_OPTIONS = [
  "Morning Shift (6 AM - 2 PM)",
  "Afternoon Shift (2 PM - 10 PM)",
  "Night Shift (10 PM - 6 AM)",
  "Full Day (9 AM - 6 PM)",
  "Part Time",
  "Flexible Hours",
];

interface ShiftSelectionProps {
  shiftsState: ShiftsState;
  setShiftsState: React.Dispatch<React.SetStateAction<ShiftsState>>;
  onBack: () => void;
  onNext: () => void;
}

export const ShiftSelection: React.FC<ShiftSelectionProps> = ({
  shiftsState,
  setShiftsState,
  onBack,
  onNext,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (shiftsState.preferredShifts.length > 0) {
      onNext();
    }
  };

  const toggleShift = (shift: string) => {
    setShiftsState((prev) => {
      const isSelected = prev.preferredShifts.includes(shift);
      if (isSelected) {
        return {
          preferredShifts: prev.preferredShifts.filter((s) => s !== shift),
        };
      } else {
        return {
          preferredShifts: [...prev.preferredShifts, shift],
        };
      }
    });
  };

  return (
    <div className="min-h-screen bg-white px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        {/* Header */}
        <div className="flex items-center mb-8">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-800" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800 ml-4">Onboarding</h1>
        </div>

        <h2 className="text-xl text-gray-600 mb-8">
          Enter your details to complete your profile
        </h2>

        <div className="mb-8 flex items-center justify-center">
          <Clock className="w-16 h-16 text-teal-700" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-gray-700 font-medium">
              Preferred Shifts <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-gray-500 mb-4">
              Select all shifts that work for you
            </p>
            <div className="grid gap-3">
              {SHIFT_OPTIONS.map((shift) => {
                const isSelected = shiftsState.preferredShifts.includes(shift);
                return (
                  <label
                    key={shift}
                    className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? "border-teal-700 bg-teal-50"
                        : "border-gray-200 hover:border-teal-200"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleShift(shift)}
                      className="sr-only"
                    />
                    <div className="flex items-center justify-between w-full">
                      <span
                        className={`text-lg ${
                          isSelected ? "text-teal-700" : "text-gray-700"
                        }`}
                      >
                        {shift}
                      </span>
                      {isSelected && (
                        <Check className="w-5 h-5 text-teal-700" />
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* <button
            type="submit"
            disabled={shiftsState.preferredShifts.length === 0}
            className="w-full bg-teal-700 text-white py-4 px-6 rounded-full font-semibold
                     hover:bg-teal-600 transition-colors duration-200 mt-8
                     disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Continue
          </button> */}
        </form>
        <FormNavigation
          onBack={onBack}
          onNext={onNext}
          currentStep="wages"
          canProceed={shiftsState.preferredShifts.length > 0}
        />
      </motion.div>
    </div>
  );
};
