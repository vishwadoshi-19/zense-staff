import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, DollarSign } from 'lucide-react';
import { WagesState } from '../types';
import { FormNavigation } from './FormNavigation';

interface WagesSectionProps {
  wagesState: WagesState;
  setWagesState: React.Dispatch<React.SetStateAction<WagesState>>;
  onBack: () => void;
  onNext: () => void;
}

export const WagesSection: React.FC<WagesSectionProps> = ({
  wagesState,
  setWagesState,
  onBack,
  onNext,
}) => {
  const canProceed = wagesState.lessThan5Hours > 0 && wagesState.hours12 > 0 && wagesState.hours24 > 0;

  return (
    <div className="min-h-screen bg-white px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto pb-24"
      >
        <div className="flex items-center mb-8">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-800" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800 ml-4">Expected Wages</h1>
        </div>

        <div className="mb-8 flex items-center justify-center">
          <DollarSign className="w-16 h-16 text-blue-500" />
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Less than 5 hours duty (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={wagesState.lessThan5Hours || ''}
              onChange={(e) => setWagesState(prev => ({
                ...prev,
                lessThan5Hours: parseInt(e.target.value) || 0
              }))}
              min="0"
              placeholder="Enter amount"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 
                       focus:ring-2 focus:ring-blue-200 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              12 hours duty (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={wagesState.hours12 || ''}
              onChange={(e) => setWagesState(prev => ({
                ...prev,
                hours12: parseInt(e.target.value) || 0
              }))}
              min="0"
              placeholder="Enter amount"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 
                       focus:ring-2 focus:ring-blue-200 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              24 hours duty (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={wagesState.hours24 || ''}
              onChange={(e) => setWagesState(prev => ({
                ...prev,
                hours24: parseInt(e.target.value) || 0
              }))}
              min="0"
              placeholder="Enter amount"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 
                       focus:ring-2 focus:ring-blue-200 transition-colors"
              required
            />
          </div>
        </div>

        <FormNavigation
          onBack={onBack}
          onNext={onNext}
          canProceed={canProceed}
          currentStep="wages"
        />
      </motion.div>
    </div>
  );
};