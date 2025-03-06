import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Stethoscope } from "lucide-react";
import { SkillsState } from "../types";
import { JOB_ROLES, SERVICES } from "../constants";
import { FormNavigation } from "./onboarding/FormNavigation";

interface SkillsSectionProps {
  skillsState: SkillsState;
  setSkillsState: React.Dispatch<React.SetStateAction<SkillsState>>;
  onBack: () => void;
  onNext: () => void;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  skillsState,
  setSkillsState,
  onBack,
  onNext,
}) => {
  const toggleService = (service: string) => {
    setSkillsState((prev) => {
      const isSelected = prev.services.includes(service);
      return {
        ...prev,
        services: isSelected
          ? prev.services.filter((s) => s !== service)
          : [...prev.services, service],
      };
    });
  };

  const canProceed = !!skillsState.jobRole && skillsState.services.length > 0;

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
            Skills and Services
          </h1>
        </div>

        <div className="mb-8 flex items-center justify-center">
          <Stethoscope className="w-16 h-16 text-blue-500" />
        </div>

        <div className="space-y-8">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Job Role <span className="text-red-500">*</span>
            </label>
            <select
              value={skillsState.jobRole}
              onChange={(e) =>
                setSkillsState((prev) => ({
                  ...prev,
                  jobRole: e.target.value,
                }))
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 
                       focus:ring-2 focus:ring-blue-200 transition-colors"
              required
            >
              <option value="">Select your role</option>
              {JOB_ROLES.map((role) => (
                <option key={role} value={role.toLowerCase()}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-4">
              Services You Can Provide <span className="text-red-500">*</span>
            </label>
            <div className="grid gap-3">
              {SERVICES.map((service) => (
                <label
                  key={service}
                  className={`flex items-center p-4 rounded-xl border-2 cursor-pointer
                           transition-colors ${
                             skillsState.services.includes(service)
                               ? "border-blue-500 bg-blue-50 text-blue-700"
                               : "border-gray-200 hover:border-blue-200"
                           }`}
                >
                  <input
                    type="checkbox"
                    checked={skillsState.services.includes(service)}
                    onChange={() => toggleService(service)}
                    className="sr-only"
                  />
                  <span className="text-sm">{service}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <FormNavigation
          onBack={onBack}
          onNext={onNext}
          canProceed={canProceed}
          currentStep="skills"
        />
      </motion.div>
    </div>
  );
};
