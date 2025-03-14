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
  phoneNumber: string;
  showOTP: boolean;
  otp: string;
  isVerified: boolean;
  verificationId?: string;
}

export interface UserDetailsState {
  fullName: string;
  jobLocation: string;
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
  experience: number;
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

// Firebase User Data Types
export interface UserData {
  name: string;
  status: "unregistered" | "registered" | "onboarding";
  phone: string;
  profilePhoto?: string;
  previewUrl?: string;
  location?: string;
  gender?: string;
  role: "user" | "provider" | "staff" | "admin";
  lastStep: "details";
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
}
// https://firebasestorage.googleapis.com/v0/b/airy-adapter-451212-b8.firebasestorage.app/o/profile-photos%2F2R5Z4qL5mLU7Tw3n5w1P6f2avNe2?alt=media&token=c2c3ee04-01cc-4de0-a37d-1997e267973a
// https://firebasestorage.googleapis.com/v0/b/airy-adapter-451212-b8.firebasestorage.app/o/profile-photos%2F2R5Z4qL5mLU7Tw3n5w1P6f2avNe2?alt=media&token=c2c3ee04-01cc-4de0-a37d-1997e267973a
export interface StaffDetails {
  lastStep: FormStep;
  name: string;
  phone: string;
  agency: string;
  profilePhoto: string | null;
  location: string;
  gender: string;

  providerId: string;
  expectedWages: {
    "5hrs": number;
    "12hrs": number;
    "24hrs": number;
  };
  educationQualification: string;
  educationCertificate: string;
  experienceYears: number;
  maritalStatus: string;
  languagesKnown: string[];
  preferredShifts: string[];
  jobRole: string;
  extraServicesOffered: string[];
  foodPreference: string;
  smokes: string;
  carryOwnFood12hrs: string;
  additionalInfo?: string;
  selfTestimonial?: {
    customerName: string;
    customerPhone: string;
    recording: string;
  } | null;
  identityDocuments: {
    aadharNumber: string;
    aadharFront: string;
    aadharBack: string;
    panNumber?: string;
    panDocument?: string;
  };
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
}
