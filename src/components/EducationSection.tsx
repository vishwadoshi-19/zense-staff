import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, GraduationCap } from "lucide-react";
import { EducationState } from "../types";
import { EDUCATION_QUALIFICATIONS, INDIAN_LANGUAGES } from "../constants";
import { FileUpload } from "./common/FileUpload";
import { FormNavigation } from "./onboarding/FormNavigation";

interface EducationSectionProps {
  educationState: EducationState;
  setEducationState: React.Dispatch<React.SetStateAction<EducationState>>;
  onBack: () => void;
  onNext: () => void;
}

export const EducationSection: React.FC<EducationSectionProps> = ({
  educationState,
  setEducationState,
  onBack,
  onNext,
}) => {
  const handleFileChange = (file: File | null) => {
    setEducationState((prev) => ({
      ...prev,
      certificate: file,
      certificatePreview: file ? URL.createObjectURL(file) : "",
    }));
  };

  const toggleLanguage = (language: string) => {
    setEducationState((prev) => {
      const isSelected = prev.languages.includes(language);
      return {
        ...prev,
        languages: isSelected
          ? prev.languages.filter((l) => l !== language)
          : [...prev.languages, language],
      };
    });
  };

  const canProceed = !!(
    educationState.qualification &&
    (educationState.certificate || educationState.certificatePreview) &&
    educationState.experience &&
    educationState.maritalStatus &&
    educationState.languages.length > 0
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
            Education & Experience
          </h1>
        </div>

        <div className="mb-8 flex items-center justify-center">
          <GraduationCap className="w-16 h-16 text-teal-700" />
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Highest Education Qualification{" "}
              <span className="text-red-500">*</span>
            </label>
            <select
              value={educationState.qualification}
              onChange={(e) =>
                setEducationState((prev) => ({
                  ...prev,
                  qualification: e.target.value,
                }))
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-teal-700 
                       focus:ring-2 focus:ring-teal-200 transition-colors"
              required
            >
              <option value="">Select qualification</option>
              {EDUCATION_QUALIFICATIONS.map((qual) => (
                <option key={qual} value={qual}>
                  {qual}
                </option>
              ))}
            </select>
          </div>

          <FileUpload
            label="Education Certificate"
            required
            value={educationState.certificate}
            previewUrl={educationState.certificatePreview}
            onChange={handleFileChange}
            maxSize={2 * 1024 * 1024} // 2MB
          />

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Years of Experience <span className="text-red-500">*</span>
            </label>
            <select
              value={educationState.experience || ""}
              onChange={(e) =>
                setEducationState((prev) => ({
                  ...prev,
                  experience: e.target.value, // Ensure it remains a string
                }))
              }
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-teal-700 
               focus:ring-2 focus:ring-teal-200 transition-colors bg-white appearance-none"
            >
              <option value="">Select experience</option>
              <option value="less_than_1">Less than 1 year</option>
              <option value="1-2">1-2 years</option>
              <option value="2-5">2-5 years</option>
              <option value="5-10">5-10 years</option>
              <option value="10_plus">10+ years</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Marital Status <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              {["Single", "Married", "Divorced", "Widowed"].map((status) => (
                <label
                  key={status}
                  className={`flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer
                           transition-colors ${
                             educationState.maritalStatus ===
                             status.toLowerCase()
                               ? "border-teal-700 bg-teal-50 text-teal-700"
                               : "border-gray-200 hover:border-teal-200"
                           }`}
                >
                  <input
                    type="radio"
                    name="maritalStatus"
                    value={status.toLowerCase()}
                    checked={
                      educationState.maritalStatus === status.toLowerCase()
                    }
                    onChange={(e) =>
                      setEducationState((prev) => ({
                        ...prev,
                        maritalStatus: e.target.value,
                      }))
                    }
                    className="sr-only"
                  />
                  <span>{status}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Known Languages <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {INDIAN_LANGUAGES.map((language) => (
                <label
                  key={language}
                  className={`flex items-center p-3 rounded-xl border-2 cursor-pointer
                           transition-colors ${
                             educationState.languages.includes(language)
                               ? "border-teal-700 bg-teal-50 text-teal-700"
                               : "border-gray-200 hover:border-teal-200"
                           }`}
                >
                  <input
                    type="checkbox"
                    checked={educationState.languages.includes(language)}
                    onChange={() => toggleLanguage(language)}
                    className="sr-only"
                  />
                  <span>{language}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <FormNavigation
          onBack={onBack}
          onNext={onNext}
          canProceed={canProceed}
          currentStep="education"
        />
      </motion.div>
    </div>
  );
};
