"use client";

import { AddressData } from "@/types";
import { motion } from "framer-motion";
import { ArrowLeft, Home, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { FormNavigation } from "./onboarding/FormNavigation";

interface AddressSectionProps {
  currentAddress: AddressData;
  setCurrentAddress: React.Dispatch<React.SetStateAction<AddressData>>;
  permanentAddress: AddressData;
  setPermanentAddress: React.Dispatch<React.SetStateAction<AddressData>>;
  isCurrentAddressSameAsPermanent: boolean;
  setIsCurrentAddressSameAsPermanent: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  onBack: () => void;
  onNext: () => void;
}

export const AddressSection: React.FC<AddressSectionProps> = ({
  currentAddress,
  setCurrentAddress,
  permanentAddress,
  setPermanentAddress,
  isCurrentAddressSameAsPermanent,
  setIsCurrentAddressSameAsPermanent,
  onBack,
  onNext,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [canProceed, setCanProceed] = useState<boolean>(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate current address
    if (!currentAddress.street.trim()) {
      newErrors.currentStreet = "Street address is required";
    }
    if (!currentAddress.city.trim()) {
      newErrors.currentCity = "City is required";
    }
    if (!currentAddress.state.trim()) {
      newErrors.currentState = "State is required";
    }
    if (!currentAddress.zip.trim()) {
      newErrors.currentZip = "ZIP code is required";
    }

    // Validate permanent address if it's different from current
    if (!isCurrentAddressSameAsPermanent) {
      if (!permanentAddress.street.trim()) {
        newErrors.permanentStreet = "Street address is required";
      }
      if (!permanentAddress.city.trim()) {
        newErrors.permanentCity = "City is required";
      }
      if (!permanentAddress.state.trim()) {
        newErrors.permanentState = "State is required";
      }
      if (!permanentAddress.zip.trim()) {
        newErrors.permanentZip = "ZIP code is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Use useEffect to validate form whenever relevant data changes
  useEffect(() => {
    const isValid = validateForm();
    setCanProceed(isValid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAddress, permanentAddress, isCurrentAddressSameAsPermanent]);

  const handleSameAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isSameAddress = e.target.checked;
    setIsCurrentAddressSameAsPermanent(isSameAddress);
  };

  const handleCurrentAddressChange = (
    field: keyof AddressData,
    value: string
  ) => {
    setCurrentAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePermanentAddressChange = (
    field: keyof AddressData,
    value: string
  ) => {
    setPermanentAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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
            Address Information
          </h1>
        </div>

        <div className="mb-8 flex items-center justify-center">
          <Home className="w-16 h-16 text-teal-700" />
        </div>

        <div className="space-y-6">
          {/* Current Address Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-teal-600" />
              Current Address
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={currentAddress.street}
                  onChange={(e) =>
                    handleCurrentAddressChange("street", e.target.value)
                  }
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.currentStreet
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:border-teal-700 focus:ring-2 focus:ring-teal-200"
                  } transition-colors`}
                  placeholder="Enter your street address"
                />
                {errors.currentStreet && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.currentStreet}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={currentAddress.city}
                    onChange={(e) =>
                      handleCurrentAddressChange("city", e.target.value)
                    }
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.currentCity
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-teal-700 focus:ring-2 focus:ring-teal-200"
                    } transition-colors`}
                    placeholder="City"
                  />
                  {errors.currentCity && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.currentCity}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={currentAddress.state}
                    onChange={(e) =>
                      handleCurrentAddressChange("state", e.target.value)
                    }
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.currentState
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-teal-700 focus:ring-2 focus:ring-teal-200"
                    } transition-colors`}
                    placeholder="State"
                  />
                  {errors.currentState && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.currentState}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  ZIP Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={currentAddress.zip}
                  onChange={(e) =>
                    handleCurrentAddressChange("zip", e.target.value)
                  }
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.currentZip
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:border-teal-700 focus:ring-2 focus:ring-teal-200"
                  } transition-colors`}
                  placeholder="ZIP Code"
                />
                {errors.currentZip && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.currentZip}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Same Address Checkbox */}
          <div>
            <label className="flex items-center p-3 rounded-xl border-2 cursor-pointer transition-colors hover:bg-gray-50 border-gray-200">
              <input
                type="checkbox"
                checked={isCurrentAddressSameAsPermanent}
                onChange={handleSameAddressChange}
                className="w-5 h-5 text-teal-700 rounded focus:ring-teal-500"
              />
              <span className="text-gray-700 ml-2">
                Permanent address is same as current address
              </span>
            </label>
          </div>

          {/* Permanent Address Section (conditional) */}
          {!isCurrentAddressSameAsPermanent && (
            <div className="pt-2">
              <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-teal-600" />
                Permanent Address
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={permanentAddress.street}
                    onChange={(e) =>
                      handlePermanentAddressChange("street", e.target.value)
                    }
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.permanentStreet
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-teal-700 focus:ring-2 focus:ring-teal-200"
                    } transition-colors`}
                    placeholder="Enter your street address"
                  />
                  {errors.permanentStreet && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.permanentStreet}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={permanentAddress.city}
                      onChange={(e) =>
                        handlePermanentAddressChange("city", e.target.value)
                      }
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.permanentCity
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-300 focus:border-teal-700 focus:ring-2 focus:ring-teal-200"
                      } transition-colors`}
                      placeholder="City"
                    />
                    {errors.permanentCity && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.permanentCity}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={permanentAddress.state}
                      onChange={(e) =>
                        handlePermanentAddressChange("state", e.target.value)
                      }
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.permanentState
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-300 focus:border-teal-700 focus:ring-2 focus:ring-teal-200"
                      } transition-colors`}
                      placeholder="State"
                    />
                    {errors.permanentState && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.permanentState}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    ZIP Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={permanentAddress.zip}
                    onChange={(e) =>
                      handlePermanentAddressChange("zip", e.target.value)
                    }
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.permanentZip
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-teal-700 focus:ring-2 focus:ring-teal-200"
                    } transition-colors`}
                    placeholder="ZIP Code"
                  />
                  {errors.permanentZip && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.permanentZip}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <FormNavigation
          onBack={onBack}
          onNext={onNext}
          canProceed={canProceed}
          currentStep="address"
        />
      </motion.div>
    </div>
  );
};
