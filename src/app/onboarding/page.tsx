"use client";

import { FormStep } from "@/types";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AnimatePresence } from "framer-motion";
import { User } from "firebase/auth"; // Import Firebase User type if using Firebase

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
import {
  saveFormData,
  updateDoc,
  doc,
  db,
  getStaffDetails,
} from "@/lib/firebase/firestore";
import { createUser } from "@/lib/firebase/auth";
import LoadingScreen from "@/components/common/LoadingScreen";
import Link from "next/link";

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

interface Props {
  user: User | null; // Ensure user has a proper type
}

export default function Onboarding() {
  const { user, isAuthenticated, isLoading, isNewUser, userData } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // useEffect(() => {
  //   if (!isLoading && userData?.status !== "unregistered") {
  //     router.push("/jobs");
  //   }
  // }, [isAuthenticated, isLoading, userData?.status]);

  const [step, setStep] = useState<FormStep>("details");
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
    const fetchStaffDetails = async () => {
      if (user?.uid) {
        const res = await getStaffDetails(user.uid);
        console.log(res);
        setStep(res?.data?.lastStep ?? "details");
        console.log("step : ", step);
        setUserDetails((prev) => ({
          ...prev,
          fullName: res?.data?.name ?? "",
          jobLocation: res?.data?.location ?? "",
          agency: res?.data?.agency ?? "",
          gender: res?.data?.gender ?? "",
          previewUrl: res?.data?.profilePhoto ?? "",
        }));

        setWagesState((prev) => ({
          ...prev,
          lessThan5Hours: res?.data?.expectedWages["5hrs"] ?? 0,
          hours12: res?.data?.expectedWages["12hrs"] ?? 0,
          hours24: res?.data?.expectedWages["24hrs"] ?? 0,
        }));
        setEducationState((prev) => ({
          ...prev,
          qualification: res?.data?.educationQualification ?? "",
          certificatePreview: res?.data?.educationCertificate ?? "",
          experience: res?.data?.experienceYears ?? 0,
          maritalStatus: res?.data?.maritalStatus ?? "",
          languages: res?.data?.languagesKnown ?? [],
        }));
        setShiftsState((prev) => ({
          ...prev,
          preferredShifts: res?.data?.preferredShifts ?? [],
        }));
        setSkillsState((prev) => ({
          ...prev,
          jobRole: res?.data?.jobRole ?? "",
          services: res?.data?.extraServicesOffered ?? [],
        }));
        setPersonalInfoState((prev) => ({
          ...prev,
          foodPreference: res?.data?.foodPreference ?? "",
          smoking: res?.data?.smokes ?? "",
          carryFood: res?.data?.carryOwnFood12hrs ?? "",
          additionalInfo: res?.data?.additionalInfo ?? "",
        }));
        setTestimonialState((prev) => ({
          ...prev,
          customerName: res?.data?.selfTestimonial?.customerName ?? "",
          customerPhone: res?.data?.selfTestimonial?.customerPhone ?? "",
        }));
        setIdProofState((prev) => ({
          ...prev,
          aadharNumber: res?.data?.identityDocuments?.aadharNumber ?? "",
          panNumber: res?.data?.identityDocuments?.panNumber ?? "",
        }));
        setFormState((prev) => ({
          ...userDetails,
          ...wagesState,
          ...educationState,
          ...shiftsState,
          ...skillsState,
          ...personalInfoState,
          ...testimonialState,
          lastStep: res?.data?.lastStep ?? "details",
        }));
        console.log("formState altered in fetchStaffDetails", formState);
      }
    };
    fetchStaffDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDetailsSubmitted = async (profilePhotoURL: string) => {
    console.log(userDetails);
    setFormState(() => ({
      ...userDetails,
      profilePhoto: profilePhotoURL,
      lastStep: "wages",
    }));
    console.log("formState altered in details", formState, userDetails);
    setStep("wages");
    if (user) {
      console.log(formState);
      const result = await saveFormData(user.uid, formState);

      if (result.success) {
        console.log("save form data called with details : ", formState);
        toast.success("Details saved");
      }
    }
  };

  const handleWagesSubmitted = async () => {
    console.log(wagesState);
    setFormState(() => ({
      ...userDetails,
      ...wagesState,
      ...educationState,
      ...shiftsState,
      ...skillsState,
      ...personalInfoState,
      ...testimonialState,
      ...idProofState,
      lastStep: "education",
    }));
    console.log("formState altered in wages", formState, wagesState);

    setStep("education");
    if (user) {
      console.log(formState);
      const result = await saveFormData(user.uid, formState);

      if (result.success) {
        console.log("save form data called with wages : ", formState);
        toast.success("Details saved");
      }
    }
  };

  const handleEducationSubmitted = async () => {
    console.log(educationState);
    setFormState((prev) => ({
      ...userDetails,
      ...wagesState,
      ...educationState,
      ...shiftsState,
      ...skillsState,
      ...personalInfoState,
      ...testimonialState,
      ...idProofState,
      lastStep: "shifts",
    }));
    console.log("formState altered in education", formState, educationState);

    setStep("shifts");
    if (user) {
      console.log(formState);
      const result = await saveFormData(user.uid, formState);

      if (result.success) {
        console.log("save form data called with edu : ", formState);
        toast.success("Details saved");
      }
    }
  };

  const handleShiftsSubmitted = async () => {
    setFormState((prev) => ({
      ...userDetails,
      ...wagesState,
      ...educationState,
      ...shiftsState,
      ...skillsState,
      ...personalInfoState,
      ...testimonialState,
      ...idProofState,
      lastStep: "skills",
    }));
    console.log("formState altered in shifts", formState, educationState);

    setStep("skills");
    if (user) {
      const result = await saveFormData(user.uid, formState);

      if (result.success) {
        console.log("save form data called with shifts : ", formState);
        toast.success("Details saved");
      }
    }
  };

  const handleSkillsSubmitted = async () => {
    setFormState((prev) => ({
      ...userDetails,
      ...wagesState,
      ...educationState,
      ...shiftsState,
      ...skillsState,
      ...personalInfoState,
      ...testimonialState,
      ...idProofState,
      lastStep: "personal",
    }));
    console.log("formState altered in skills", formState, educationState);

    setStep("personal");
    if (user) {
      const result = await saveFormData(user.uid, formState);

      if (result.success) {
        console.log("save form data called with skills : ", formState);
        toast.success("Details saved");
      }
    }
  };

  const handlePersonalInfoSubmitted = async () => {
    setFormState((prev) => ({
      ...userDetails,
      ...wagesState,
      ...educationState,
      ...shiftsState,
      ...skillsState,
      ...personalInfoState,
      ...testimonialState,
      ...idProofState,
      lastStep: "testimonial",
    }));
    console.log("formState altered in personal", formState, educationState);

    setStep("testimonial");

    if (user) {
      const result = await saveFormData(user.uid, formState);

      if (result.success) {
        console.log("save form data called with personal : ", formState);
        toast.success("Details saved");
      }
    }
  };

  const handleTestimonialSubmitted = async () => {
    setFormState((prev) => ({
      ...userDetails,
      ...wagesState,
      ...educationState,
      ...shiftsState,
      ...skillsState,
      ...personalInfoState,
      ...testimonialState,
      ...idProofState,
      lastStep: "idproof",
    }));
    console.log("formState altered in testimonials", formState, educationState);

    setStep("idproof");

    if (user) {
      const result = await saveFormData(user.uid, formState);

      if (result.success) {
        console.log("save form data called with testimonials : ", formState);
        toast.success("Details saved");
      }
    }
  };

  const handleIdProofSubmitted = async () => {
    if (!user) return;

    setIsSubmitting(true);

    // Update form state with ID proof data
    const updatedFormState = {
      ...userDetails,
      ...wagesState,
      ...educationState,
      ...shiftsState,
      ...skillsState,
      ...personalInfoState,
      ...testimonialState,
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
          console.log("Effect Triggered", {
            isLoading,
            userData,
            userStatus: userData?.status,
          });
          router.replace("/jobs");
        });
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
    // router.push("/jobs");
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center p-6">
        <div className="text-center text-white space-y-6">
          <Heart className="w-16 h-16 mx-auto text-red-400 animate-pulse" />
          <h1 className="text-4xl font-bold">Thank you!</h1>
          <p className="text-xl text-blue-50">
            Your application has been received.
          </p>
          <Link href="/jobs" className="text-blue-500 hover:underline">
            Redirecting to dashboard...
          </Link>
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
            onNext={handleShiftsSubmitted}
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
