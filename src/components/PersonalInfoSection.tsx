import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, User } from "lucide-react";
import { PersonalInfoState } from "../types";
import { FormNavigation } from "./onboarding/FormNavigation";

interface PersonalInfoSectionProps {
  personalInfoState: PersonalInfoState;
  setPersonalInfoState: React.Dispatch<React.SetStateAction<PersonalInfoState>>;
  onBack: () => void;
  onNext: () => void;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  personalInfoState,
  setPersonalInfoState,
  onBack,
  onNext,
}) => {
  const canProceed = !!(
    personalInfoState.foodPreference &&
    personalInfoState.smoking &&
    personalInfoState.carryFood
  );

  return (
    <div className="min-h-screen bg-white px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto pb-24"
      >
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-800" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800 ml-4">
            Personal Information
          </h1>
        </div>

        <div className="mb-8 flex items-center justify-center">
          <User className="w-16 h-16 text-blue-500" />
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Food Preference <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              {["Veg", "Non-veg"].map((pref) => (
                <label
                  key={pref}
                  className={`flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer
                           transition-colors ${
                             personalInfoState.foodPreference ===
                             pref.toLowerCase()
                               ? "border-blue-500 bg-blue-50 text-blue-700"
                               : "border-gray-200 hover:border-blue-200"
                           }`}
                >
                  <input
                    type="radio"
                    name="foodPreference"
                    value={pref.toLowerCase()}
                    checked={
                      personalInfoState.foodPreference === pref.toLowerCase()
                    }
                    onChange={(e) =>
                      setPersonalInfoState((prev) => ({
                        ...prev,
                        foodPreference: e.target.value,
                      }))
                    }
                    className="sr-only"
                  />
                  <span>{pref}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Do you smoke? <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              {["Yes", "No"].map((option) => (
                <label
                  key={option}
                  className={`flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer
                           transition-colors ${
                             personalInfoState.smoking === option.toLowerCase()
                               ? "border-blue-500 bg-blue-50 text-blue-700"
                               : "border-gray-200 hover:border-blue-200"
                           }`}
                >
                  <input
                    type="radio"
                    name="smoking"
                    value={option.toLowerCase()}
                    checked={personalInfoState.smoking === option.toLowerCase()}
                    onChange={(e) =>
                      setPersonalInfoState((prev) => ({
                        ...prev,
                        smoking: e.target.value,
                      }))
                    }
                    className="sr-only"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Will you carry your own food for 12 Hr duty?{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              {["Yes", "No"].map((option) => (
                <label
                  key={option}
                  className={`flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer
                           transition-colors ${
                             personalInfoState.carryFood ===
                             option.toLowerCase()
                               ? "border-blue-500 bg-blue-50 text-blue-700"
                               : "border-gray-200 hover:border-blue-200"
                           }`}
                >
                  <input
                    type="radio"
                    name="carryFood"
                    value={option.toLowerCase()}
                    checked={
                      personalInfoState.carryFood === option.toLowerCase()
                    }
                    onChange={(e) =>
                      setPersonalInfoState((prev) => ({
                        ...prev,
                        carryFood: e.target.value,
                      }))
                    }
                    className="sr-only"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Additional Information
            </label>
            <textarea
              value={personalInfoState.additionalInfo}
              onChange={(e) =>
                setPersonalInfoState((prev) => ({
                  ...prev,
                  additionalInfo: e.target.value,
                }))
              }
              placeholder="Share anything that might help us find you more customers..."
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 
                       focus:ring-2 focus:ring-blue-200 transition-colors min-h-[120px]"
            />
          </div>
        </div>

        <FormNavigation
          onBack={onBack}
          onNext={onNext}
          canProceed={canProceed}
          currentStep="personal"
        />
      </motion.div>
    </div>
  );
};
