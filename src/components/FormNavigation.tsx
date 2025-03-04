import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { FormStep } from '../types';

interface FormNavigationProps {
  onBack: () => void;
  onNext: () => void;
  canProceed: boolean;
  currentStep: FormStep;
  isLastStep?: boolean;
}

export const FormNavigation: React.FC<FormNavigationProps> = ({
  onBack,
  onNext,
  canProceed,
  currentStep,
  isLastStep = false,
}) => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4">
      <div className="max-w-md mx-auto flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full
                   border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full
                   bg-blue-500 text-white hover:bg-blue-600 transition-colors
                   disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <span>{isLastStep ? 'Finish' : 'Continue'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};