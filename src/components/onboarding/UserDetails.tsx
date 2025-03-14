"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Camera, Upload, X } from "lucide-react";
import Image from "next/image";
import { UserDetailsState } from "@/types";
import { useRouter } from "next/navigation";
import { AGENCIES } from "@/constants";
import { db, storage } from "@/lib/firebase/config";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import toast from "react-hot-toast";

// const INDIAN_CITIES = [
//   "Delhi",
//   "Mumbai",
//   "Bangalore",
//   "Hyderabad",
//   "Chennai",
//   "Kolkata",
//   "Pune",
//   "Ahmedabad",
//   "Jaipur",
//   "Surat",
// ];

type District = "delhi" | "mumbai" | "bangalore";

const DISTRICTS: string[] = ["Delhi", "Mumbai", "Bangalore"];

const SUB_DISTRICTS: Record<District, string[]> = {
  delhi: [
    "Central Delhi",
    "East Delhi",
    "New Delhi",
    "North Delhi",
    "North East Delhi",
    "North West Delhi",
    "Shahdara",
    "South Delhi",
    "South East Delhi",
    "South West Delhi",
    "West Delhi",
  ],
  mumbai: [
    "Colaba",
    "Dadar",
    "Andheri",
    "Bandra",
    "Borivali",
    "Goregaon",
    "Juhu",
    "Kurla",
    "Mulund",
    "Powai",
    "Vikhroli",
  ],
  bangalore: [
    "Bangalore East",
    "Bangalore North",
    "Bangalore South",
    "Yelahanka",
    "KR Puram",
    "Jayanagar",
    "Rajajinagar",
    "BTM Layout",
    "Malleswaram",
    "Basavanagudi",
    "Whitefield",
    "Electronic City",
  ],
};

interface UserDetailsProps {
  userDetails: UserDetailsState;
  setUserDetails: React.Dispatch<React.SetStateAction<UserDetailsState>>;
  onSubmit: (profilePhotoURL: string) => void;
}

export const UserDetails: React.FC<UserDetailsProps> = ({
  userDetails,
  setUserDetails,
  onSubmit,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { user, isAuthenticated, signOut } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userDetails.profilePhoto && !userDetails.previewUrl) {
      alert("Please upload a profile photo.");
      return;
    }

    if (userDetails.profilePhoto) {
      try {
        const storageRef = ref(storage, `profile-photos/${user?.uid}`);

        await uploadBytes(storageRef, userDetails.profilePhoto);

        const profilePhotoURL = await getDownloadURL(storageRef);

        if (user) {
          await updateDoc(doc(db, "users", user.uid), {
            ...userDetails,
            profilePhoto: profilePhotoURL,
            // status: "registered",
            updatedAt: serverTimestamp(),
          });
        }
        onSubmit(profilePhotoURL);
      } catch (error) {
        console.error("Error uploading profile photo:", error);
        alert("Failed to upload profile photo. Please try again.");
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUserDetails((prev) => ({
        ...prev,
        profilePhoto: file,
        previewUrl: URL.createObjectURL(file),
      }));
    }
  };

  const handleRemovePhoto = () => {
    setUserDetails((prev) => ({
      ...prev,
      profilePhoto: null,
      previewUrl: "",
    }));
  };

  // const handleLeftArrowClick = async () => {
  //   try {
  //     await signOut();
  //     toast.success("Signed out successfully");
  //   } catch (error) {
  //     toast.error("Failed to sign out");
  //   router.push("/sign-in");
  //   Router.push("/sign-in");
  // };

  const handleLeftArrowClick = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      router.push("/sign-in");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  // console.log(userDetails);

  return (
    <div className="min-h-screen bg-white px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={handleLeftArrowClick}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-800" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800 ml-4">
            Register Your Account
          </h1>
        </div>

        {/* Profile Photo Preview */}
        <div className="mb-8 text-center">
          <div className="relative inline-block">
            {userDetails.previewUrl ? (
              <div className="relative inline-block">
                <Image
                  src={userDetails.previewUrl}
                  alt="Profile Preview"
                  className="w-32 h-32 rounded-full object-cover border-4 border-teal-700"
                  width={128}
                  height={128}
                />

                <button
                  onClick={handleRemovePhoto}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="w-32 h-32 mx-auto rounded-full bg-gray-100 flex items-center justify-center border-4 border-gray-200">
                <Camera className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </div>

          {/* Photo Upload Buttons */}
          <div className="mt-4 flex gap-4 justify-center">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <input
              type="file"
              ref={cameraInputRef}
              accept="image/*"
              capture="user"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-600 transition-colors"
            >
              <Camera className="w-4 h-4" />
              <span>Camera</span>
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Gallery</span>
            </button>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Enter Your Details
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="block text-gray-700 font-medium">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={userDetails.fullName}
              onChange={(e) =>
                setUserDetails((prev) => ({
                  ...prev,
                  fullName: e.target.value,
                }))
              }
              placeholder="Enter your full name"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-teal-700 
                       focus:ring-2 focus:ring-teal-200 transition-colors"
            />
          </div>

          {/* Agency Selection */}
          <div className="space-y-2">
            <label className="block text-gray-700 font-medium">
              Agency <span className="text-red-500">*</span>
            </label>
            <select
              value={userDetails.agency}
              onChange={(e) =>
                setUserDetails((prev) => ({ ...prev, agency: e.target.value }))
              }
              required
              defaultValue={"Zense"}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-teal-700 
                       focus:ring-2 focus:ring-teal-200 transition-colors appearance-none bg-white"
            >
              <option value="">Select agency</option>
              {AGENCIES.map((agency) => (
                <option key={agency} value={agency.toLowerCase()}>
                  {agency}
                </option>
              ))}
            </select>
          </div>

          {/* Job Location */}
          {/* <div className="space-y-2">
            <label className="block text-gray-700 font-medium">
              Job Location <span className="text-red-500">*</span>
            </label>
            <select
              value={userDetails.jobLocation}
              onChange={(e) =>
                setUserDetails((prev) => ({
                  ...prev,
                  jobLocation: e.target.value,
                }))
              }
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-teal-700 
                       focus:ring-2 focus:ring-teal-200 transition-colors appearance-none bg-white"
            >
              <option value="">Select city</option>
              {INDIAN_CITIES.map((city) => (
                <option key={city} value={city.toLowerCase()}>
                  {city}
                </option>
              ))}
            </select>
          </div> */}

          {/* Job Location */}
          <div className="space-y-4">
            {/* District Selection */}
            <div>
              <label className="block text-gray-700 font-medium">
                District <span className="text-red-500">*</span>
              </label>
              <select
                value={userDetails.district}
                onChange={(e) =>
                  setUserDetails((prev) => ({
                    ...prev,
                    district: e.target.value,
                    subDistricts: [], // Reset sub-districts on district change
                  }))
                }
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-teal-700 
                 focus:ring-2 focus:ring-teal-200 transition-colors appearance-none bg-white"
              >
                <option value="">Select district</option>
                {DISTRICTS.map((district) => (
                  <option key={district} value={district.toLowerCase()}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

            {/* Sub-District Selection (Multi-Select)
            <div>
              <label className="block text-gray-700 font-medium">
                Sub-District
              </label>
              <select
                multiple
                value={userDetails.subDistricts}
                onChange={(e) => {
                  const selectedOptions = Array.from(
                    e.target.selectedOptions,
                    (opt) => opt.value
                  );
                  setUserDetails((prev) => ({
                    ...prev,
                    subDistricts: selectedOptions.includes("all")
                      ? ["all"]
                      : selectedOptions,
                  }));
                }}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-teal-700 
                 focus:ring-2 focus:ring-teal-200 transition-colors appearance-none bg-white"
              >
                <option value="all">All</option>
                {SUB_DISTRICTS[userDetails.district as District]?.map(
                  (subDistrict) => (
                    <option key={subDistrict} value={subDistrict.toLowerCase()}>
                      {subDistrict}
                    </option>
                  )
                )}
              </select>
            </div> */}
            {/* Sub-District Selection (Multi-Select with Checkboxes) */}
            <div>
              <label className="block text-gray-700 font-medium">
                Sub-District
              </label>
              <div className="w-full border border-gray-300 rounded-xl p-3 bg-white focus-within:ring-2 focus-within:ring-teal-200">
                {SUB_DISTRICTS[userDetails.district as District]?.length ? (
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {/* "All" Checkbox */}
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={userDetails.subDistricts?.includes("all")}
                        onChange={() => {
                          setUserDetails((prev) => ({
                            ...prev,
                            subDistricts: prev.subDistricts?.includes("all")
                              ? []
                              : [
                                  "all",
                                  ...SUB_DISTRICTS[
                                    userDetails.district as District
                                  ],
                                ],
                          }));
                        }}
                        className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                      />
                      <span>All</span>
                    </label>

                    {/* Individual Sub-Districts */}
                    {SUB_DISTRICTS[userDetails.district as District].map(
                      (subDistrict) => (
                        <label
                          key={subDistrict}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            value={subDistrict.toLowerCase()}
                            checked={userDetails.subDistricts?.includes(
                              subDistrict
                            )}
                            onChange={(e) => {
                              const { checked, value } = e.target;
                              setUserDetails((prev) => {
                                let updatedSubDistricts =
                                  prev.subDistricts?.filter(
                                    (sd) => sd !== "all"
                                  );
                                if (checked) {
                                  updatedSubDistricts?.push(subDistrict);
                                } else {
                                  updatedSubDistricts =
                                    updatedSubDistricts?.filter(
                                      (sd) => sd !== subDistrict
                                    );
                                }
                                return {
                                  ...prev,
                                  subDistricts: updatedSubDistricts,
                                };
                              });
                            }}
                            className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                          />
                          <span>{subDistrict}</span>
                        </label>
                      )
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">Select a district first</p>
                )}
              </div>
            </div>
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <label className="block text-gray-700 font-medium">
              Gender <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-6">
              {["Male", "Female", "Other"].map((option) => (
                <label
                  key={option}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="gender"
                    value={option.toLowerCase()}
                    checked={userDetails.gender === option.toLowerCase()}
                    onChange={(e) =>
                      setUserDetails((prev) => ({
                        ...prev,
                        gender: e.target.value,
                      }))
                    }
                    required
                    className="w-4 h-4 text-teal-700 border-gray-300 focus:ring-teal-700"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={
              !userDetails.fullName ||
              !userDetails.district ||
              !userDetails.gender ||
              (!userDetails.profilePhoto && !userDetails.previewUrl) ||
              !userDetails.agency
            }
            className="w-full bg-teal-700 text-white py-4 px-6 rounded-full font-semibold
                     hover:bg-teal-600 transition-colors duration-200 mt-8
                     disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </form>
      </motion.div>
    </div>
  );
};
