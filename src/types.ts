export interface Question {
  id: string;
  type:
    | "text"
    | "email"
    | "select"
    | "multiline"
    | "phone"
    | "otp"
    | "file"
    | "number";
  question: string;
  placeholder?: string;
  options?: string[];
}

export interface FormState {
  [key: string]: string | string[] | File | null | number;
}

export interface PhoneVerificationState {
  verificationId: any;
  phoneNumber: string;
  showOTP: boolean;
  otp: string;
  isVerified: boolean;
}

export interface UserDetailsState {
  district: string;
  subDistricts: string[];
  fullName: string;
  gender: string;
  profilePhoto: File | null;
  previewUrl: string;
  agency: string;
}

export interface WagesState {
  lessThan5Hours: number;
  hours12: number;
  hours24: number;
}

export interface EducationState {
  qualification: string;
  certificate: File | null;
  certificatePreview: string;
  experience: string;
  maritalStatus: string;
  languages: string[];
}

export interface SkillsState {
  jobRole: string;
  services: string[];
}

export interface PersonalInfoState {
  foodPreference: string;
  smoking: string;
  carryFood: string;
  additionalInfo: string;
}

export interface TestimonialState {
  recording: File | null;
  customerName: string;
  customerPhone: string;
}

export interface IdProofState {
  aadharNumber: string;
  aadharFront: File | null;
  aadharBack: File | null;
  panNumber: string;
  panCard: File | null;
}

export interface ShiftsState {
  preferredShifts: string[];
}

export type FormStep =
  | "phone"
  | "details"
  | "wages"
  | "education"
  | "shifts"
  | "skills"
  | "personal"
  | "testimonial"
  | "idproof"
  | "completed";
