import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Star } from "lucide-react";
import { TestimonialState } from "../types";
import { FileUpload } from "./common/FileUpload";
import { FormNavigation } from "./onboarding/FormNavigation";

interface TestimonialSectionProps {
  testimonialState: TestimonialState;
  setTestimonialState: React.Dispatch<React.SetStateAction<TestimonialState>>;
  onBack: () => void;
  onNext: () => void;
}

export const TestimonialSection: React.FC<TestimonialSectionProps> = ({
  testimonialState,
  setTestimonialState,
  onBack,
  onNext,
}) => {
  const handleFileChange = (file: File | null) => {
    setTestimonialState((prev) => ({
      ...prev,
      recording: file,
    }));
  };

  // Since this section is optional, we can always proceed
  const canProceed = true;

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
            Testimonials
          </h1>
        </div>

        <div className="mb-8 flex items-center justify-center">
          <Star className="w-16 h-16 text-teal-700" />
        </div>

        <div className="space-y-6">
          <div className="bg-teal-50 p-4 rounded-lg">
            <p className="text-teal-700 text-sm">
              This section is optional. You can share testimonials from your
              previous customers to increase your chances of getting hired.
            </p>
          </div>

          <FileUpload
            label="Customer Recording"
            accept="audio/*,video/*"
            value={testimonialState.recording}
            onChange={handleFileChange}
            maxSize={20 * 1024 * 1024} // 20MB
          />

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Customer Name
            </label>
            <input
              type="text"
              value={testimonialState.customerName}
              onChange={(e) =>
                setTestimonialState((prev) => ({
                  ...prev,
                  customerName: e.target.value,
                }))
              }
              placeholder="Enter customer name"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-teal-700 
                       focus:ring-2 focus:ring-teal-200 transition-colors"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Customer Phone Number
            </label>
            <input
              type="tel"
              value={testimonialState.customerPhone}
              onChange={(e) =>
                setTestimonialState((prev) => ({
                  ...prev,
                  customerPhone: e.target.value,
                }))
              }
              placeholder="Enter customer phone number"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-teal-700 
                       focus:ring-2 focus:ring-teal-200 transition-colors"
            />
          </div>
        </div>

        <FormNavigation
          onBack={onBack}
          onNext={onNext}
          canProceed={canProceed}
          currentStep="testimonial"
        />
      </motion.div>
    </div>
  );
};
