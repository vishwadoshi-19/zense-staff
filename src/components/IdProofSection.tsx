import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, FileCheck } from "lucide-react";
import { IdProofState } from "../types";
import { FileUpload } from "./FileUpload";
import { FormNavigation } from "./FormNavigation";

interface IdProofSectionProps {
  idProofState: IdProofState;
  setIdProofState: React.Dispatch<React.SetStateAction<IdProofState>>;
  onBack: () => void;
  onNext: () => void;
}

export const IdProofSection: React.FC<IdProofSectionProps> = ({
  idProofState,
  setIdProofState,
  onBack,
  onNext,
}) => {
  const handleFileChange =
    (field: keyof IdProofState) => (file: File | null) => {
      setIdProofState((prev) => ({
        ...prev,
        [field]: file,
      }));
    };

  const canProceed =
    !!idProofState.aadharNumber &&
    !!idProofState.aadharFront &&
    !!idProofState.aadharBack;

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
          <h1 className="text-2xl font-bold text-gray-800 ml-4">ID Proof</h1>
        </div>

        <div className="mb-8 flex items-center justify-center">
          <FileCheck className="w-16 h-16 text-blue-500" />
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Aadhar Card Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={idProofState.aadharNumber}
              onChange={(e) =>
                setIdProofState((prev) => ({
                  ...prev,
                  aadharNumber: e.target.value,
                }))
              }
              placeholder="Enter your Aadhar number"
              pattern="[0-9]{12}"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 
                       focus:ring-2 focus:ring-blue-200 transition-colors"
              required
            />
          </div>

          <FileUpload
            label="Aadhar Card Front"
            required
            value={idProofState.aadharFront}
            onChange={handleFileChange("aadharFront")}
            maxSize={2 * 1024 * 1024} // 2MB
          />

          <FileUpload
            label="Aadhar Card Back"
            required
            value={idProofState.aadharBack}
            onChange={handleFileChange("aadharBack")}
            maxSize={2 * 1024 * 1024} // 2MB
          />

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              PAN Card Number
            </label>
            <input
              type="text"
              value={idProofState.panNumber}
              onChange={(e) =>
                setIdProofState((prev) => ({
                  ...prev,
                  panNumber: e.target.value,
                }))
              }
              placeholder="Enter your PAN number"
              pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 
                       focus:ring-2 focus:ring-blue-200 transition-colors"
            />
          </div>

          <FileUpload
            label="PAN Card"
            value={idProofState.panCard}
            onChange={handleFileChange("panCard")}
            maxSize={2 * 1024 * 1024} // 2MB
          />
        </div>

        <FormNavigation
          onBack={onBack}
          onNext={onNext}
          canProceed={canProceed}
          currentStep="idproof"
          isLastStep
        />
      </motion.div>
    </div>
  );
};
