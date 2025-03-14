import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { FormStep } from "@/types";

interface FormNavigationProps {
  onBack: () => void;
  onNext: () => void;
  canProceed: boolean;
  currentStep: FormStep;
  isLastStep?: boolean;
  isSubmitting?: boolean;
}

export const FormNavigation: React.FC<FormNavigationProps> = ({
  onBack,
  onNext,
  canProceed,
  currentStep,
  isLastStep = false,
  isSubmitting = false,
}) => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4">
      <div className="max-w-md mx-auto flex gap-4">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full
                   border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed || isSubmitting}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full
                   bg-teal-700 text-white hover:bg-teal-600 transition-colors
                   disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Submitting...</span>
            </div>
          ) : (
            <>
              <span>{isLastStep ? "Finish" : "Continue"}</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
