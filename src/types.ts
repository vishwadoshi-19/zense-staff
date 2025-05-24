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
  [key: string]: string | string[] | File | null | number | object | boolean;
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
  dateOfBirth: string;
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
//

export interface ShiftsState {
  preferredShifts: string[];
}

export type FormStep =
  | "phone"
  | "details"
  | "address"
  | "wages"
  | "education"
  | "shifts"
  | "skills"
  | "personal"
  | "testimonial"
  | "idproof"
  | "completed";

export interface UserData {
  name: string;
  status: "unregistered" | "registered" | "live";
  phone: string;
  profilePhoto?: string;
  previewUrl?: string;
  location?: string;
  gender?: string;
  role: "user" | "provider" | "staff" | "admin";
  lastStep: "details";
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
  hasOngoingJob?: boolean; // Added property
}

export interface AddressData {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface StaffDetails {
  lastStep: FormStep;
  name: string;
  phone: string;
  agency: string;
  profilePhoto: string | null;
  location: string;
  gender: string;
  district: string;
  subDistricts: string[];

  providerId: string;
  currentAddress: AddressData;
  permanentAddress: AddressData;
  isCurrentAddressSameAsPermanent: boolean;

  expectedWages: {
    "5hrs": number;
    "12hrs": number;
    "24hrs": number;
  };
  educationQualification: string;
  educationCertificate: string;
  experienceYears: string;
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
  dateOfBirth: string;
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
}
