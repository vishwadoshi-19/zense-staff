"use client";

import { FormStep } from "@/types";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";
import {
  FormState,
  PhoneVerificationState,
  UserDetailsState,
  ShiftsState,
  WagesState,
  EducationState,
  SkillsState,
  PersonalInfoState,
  TestimonialState,
  IdProofState,
} from "@/types";
import { UserDetails } from "@/components/onboarding/UserDetails";
import { ShiftSelection } from "@/components/ShiftSelection";
import { WagesSection } from "@/components/WagesSection";
import { EducationSection } from "@/components/EducationSection";
import { SkillsSection } from "@/components/SkillsSection";
import { PersonalInfoSection } from "@/components/PersonalInfoSection";
import { TestimonialSection } from "@/components/TestimonialSection";
import { IdProofSection } from "@/components/onboarding/IdProofSection";
import { FormProgress } from "@/components/onboarding/FormProgress";
import { saveFormData, updateDoc, doc, db } from "@/lib/firebase/firestore";
import { createUser } from "@/lib/firebase/auth";
import LoadingScreen from "@/components/common/LoadingScreen";

const FORM_STEPS: { id: FormStep; label: string }[] = [
  { id: "details", label: "Details" },
  { id: "wages", label: "Wages" },
  { id: "education", label: "Education" },
  { id: "shifts", label: "Shifts" },
  { id: "skills", label: "Skills" },
  { id: "personal", label: "Personal" },
  { id: "testimonial", label: "Testimonial" },
  { id: "idproof", label: "ID Proof" },
];

export default function Onboarding() {
  const { user, isAuthenticated, isLoading, isNewUser } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [step, setStep] = useState<
    | "details"
    | "wages"
    | "education"
    | "shifts"
    | "skills"
    | "personal"
    | "testimonial"
    | "idproof"
    | "completed"
  >("details");
  const [formState, setFormState] = useState<FormState>({});
  const [userDetails, setUserDetails] = useState<UserDetailsState>({
    fullName: "",
    jobLocation: "",
    gender: "",
    profilePhoto: null,
    previewUrl: "",
    agency: "",
  });
  const [wagesState, setWagesState] = useState<WagesState>({
    lessThan5Hours: 0,
    hours12: 0,
    hours24: 0,
  });
  const [educationState, setEducationState] = useState<EducationState>({
    qualification: "",
    certificate: null,
    certificatePreview: "",
    experience: 0,
    maritalStatus: "",
    languages: [],
  });
  const [shiftsState, setShiftsState] = useState<ShiftsState>({
    preferredShifts: [],
  });
  const [skillsState, setSkillsState] = useState<SkillsState>({
    jobRole: "",
    services: [],
  });
  const [personalInfoState, setPersonalInfoState] = useState<PersonalInfoState>(
    {
      foodPreference: "",
      smoking: "",
      carryFood: "",
      additionalInfo: "",
    }
  );
  const [testimonialState, setTestimonialState] = useState<TestimonialState>({
    recording: null,
    customerName: "",
    customerPhone: "",
  });
  const [idProofState, setIdProofState] = useState<IdProofState>({
    aadharNumber: "",
    aadharFront: null,
    aadharBack: null,
    panNumber: "",
    panCard: null,
  });

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && !isNewUser) {
        router.push("/jobs");
      }
    }
  }, [isAuthenticated, isLoading, isNewUser, router]);

  const handleDetailsSubmitted = (profilePhotoURL: string) => {
    setFormState((prev) => ({
      ...prev,
      ...userDetails,
      profilePhoto: profilePhotoURL,
    }));
    setStep("wages");
  };

  const handleWagesSubmitted = () => {
    setFormState((prev) => ({
      ...prev,
      ...wagesState,
    }));
    setStep("education");
  };

  const handleEducationSubmitted = () => {
    setFormState((prev) => ({
      ...prev,
      ...educationState,
    }));
    setStep("shifts");
  };

  const handleShiftsSubmitted = () => {
    setFormState((prev) => ({
      ...prev,
      ...shiftsState,
    }));
    setStep("skills");
  };

  const handleSkillsSubmitted = () => {
    setFormState((prev) => ({
      ...prev,
      ...skillsState,
    }));
    setStep("personal");
  };

  const handlePersonalInfoSubmitted = () => {
    setFormState((prev) => ({
      ...prev,
      ...personalInfoState,
    }));
    setStep("testimonial");
  };

  const handleTestimonialSubmitted = () => {
    setFormState((prev) => ({
      ...prev,
      ...testimonialState,
    }));
    setStep("idproof");
  };

  const handleIdProofSubmitted = async () => {
    if (!user) return;

    setIsSubmitting(true);

    // Update form state with ID proof data
    const updatedFormState = {
      ...formState,
      ...idProofState,
    };

    try {
      // Create user in Firestore if new
      if (isNewUser) {
        await createUser(user, {
          name: userDetails.fullName,
          phone: user.phoneNumber || "",
          role: "staff",
        });
      }

      // Save form data to Firestore
      const result = await saveFormData(user.uid, updatedFormState);
      // router.push("/jobs");

      if (result.success) {
        setStep("completed");
        toast.success("Your profile has been successfully created!");

        // Update user status to "registered"
        await updateDoc(doc(db, "users", user.uid), {
          status: "registered",
        });

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push("/jobs");
        }, 3000);
      } else {
        toast.error("Failed to save your profile. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (step === "completed") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center p-6">
        <div className="text-center text-white space-y-6">
          <Heart className="w-16 h-16 mx-auto text-red-400 animate-pulse" />
          <h1 className="text-4xl font-bold">Thank you!</h1>
          <p className="text-xl text-blue-50">
            Your application has been received.
          </p>
          <p className="text-blue-50">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {isNewUser && step !== "details" && (
        <FormProgress
          currentStep={step}
          steps={FORM_STEPS}
          formData={formState}
        />
      )}

      <AnimatePresence mode="wait">
        {step === "details" && (
          <UserDetails
            userDetails={userDetails}
            setUserDetails={setUserDetails}
            onSubmit={handleDetailsSubmitted}
          />
        )}

        {step === "wages" && (
          <WagesSection
            wagesState={wagesState}
            setWagesState={setWagesState}
            onBack={() => setStep("details")}
            onNext={handleWagesSubmitted}
          />
        )}

        {step === "education" && (
          <EducationSection
            educationState={educationState}
            setEducationState={setEducationState}
            onBack={() => setStep("wages")}
            onNext={handleEducationSubmitted}
          />
        )}

        {step === "shifts" && (
          <ShiftSelection
            shiftsState={shiftsState}
            setShiftsState={setShiftsState}
            onBack={() => setStep("education")}
            onSubmit={handleShiftsSubmitted}
          />
        )}

        {step === "skills" && (
          <SkillsSection
            skillsState={skillsState}
            setSkillsState={setSkillsState}
            onBack={() => setStep("shifts")}
            onNext={handleSkillsSubmitted}
          />
        )}

        {step === "personal" && (
          <PersonalInfoSection
            personalInfoState={personalInfoState}
            setPersonalInfoState={setPersonalInfoState}
            onBack={() => setStep("skills")}
            onNext={handlePersonalInfoSubmitted}
          />
        )}

        {step === "testimonial" && (
          <TestimonialSection
            testimonialState={testimonialState}
            setTestimonialState={setTestimonialState}
            onBack={() => setStep("personal")}
            onNext={handleTestimonialSubmitted}
          />
        )}

        {step === "idproof" && (
          <IdProofSection
            idProofState={idProofState}
            setIdProofState={setIdProofState}
            onBack={() => setStep("testimonial")}
            onNext={handleIdProofSubmitted}
            isSubmitting={isSubmitting}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
