import React, { useEffect } from "react";
import { FormStep } from "@/types";
import { db } from "@/lib/firebase/config";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { saveFormData, uploadFile } from "@/lib/firebase/firestore";
import toast from "react-hot-toast";
import { form } from "framer-motion/client";

interface FormProgressProps {
  currentStep: FormStep;
  steps: { id: FormStep; label: string }[];
  formData: any;
}

export const FormProgress: React.FC<FormProgressProps> = ({
  currentStep,
  steps,
  formData,
}) => {
  const { user } = useAuth();
  const currentIndex = steps.findIndex((step) => step.id === currentStep);

  // useEffect(() => {
  //   const savee = async () => {
  //     if (user) {
  //       console.log(formData);
  //       const result = await saveFormData(user.uid, formData);

  //       if (result.success) {
  //         toast.success("Details saved");
  //       }
  //     }
  //   };

  //   savee();
  // }, [currentStep, formData, user]);

  return (
    <div className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
      <div className="max-w-md mx-auto px-4 py-2 hidden">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index <= currentIndex
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-1 w-12 ${
                    index < currentIndex ? "bg-blue-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
