import { db, storage } from "./config";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  DocumentReference,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FormState, UserData, StaffDetails } from "@/types";
import { sub } from "date-fns";

export { updateDoc, doc, db };

// Upload file to Firebase Storage
export const uploadFile = async (file: File, path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

// Save form data to Firestore
export const saveFormData = async (userId: string, formData: FormState) => {
  try {
    // Upload certificate if exists
    let certificateURL = "";
    if (formData.certificate instanceof File) {
      certificateURL = await uploadFile(
        formData.certificate,
        `users/${userId}/certificates/${formData.certificate.name}`
      );
    }

    // Upload ID proofs if they exist
    let aadharFrontURL = "";
    let aadharBackURL = "";
    let panCardURL = "";

    if (formData.aadharFront instanceof File) {
      aadharFrontURL = await uploadFile(
        formData.aadharFront,
        `users/${userId}/documents/aadhar_front_${formData.aadharFront.name}`
      );
    }

    if (formData.aadharBack instanceof File) {
      aadharBackURL = await uploadFile(
        formData.aadharBack,
        `users/${userId}/documents/aadhar_back_${formData.aadharBack.name}`
      );
    }

    if (formData.panCard instanceof File) {
      panCardURL = await uploadFile(
        formData.panCard,
        `users/${userId}/documents/pan_${formData.panCard.name}`
      );
    }

    // Upload testimonial recording if exists
    let recordingURL = "";
    if (formData.recording instanceof File) {
      recordingURL = await uploadFile(
        formData.recording,
        `users/${userId}/testimonials/${formData.recording.name}`
      );
    }

    // Update user data
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      name: formData.fullName || "",
      location: formData.jobLocation || "",
      gender: formData.gender || "",
      // profilePhoto: formData.profilePhoto || "", // Use the URL directly
      lastStep: formData.lastStep || "details",
      updatedAt: serverTimestamp(),
    });

    // Update user data with staff details
    await updateDoc(userRef, {
      providerId: formData.agency || "self",
      expectedWages: {
        "5hrs": formData.lessThan5Hours || 0,
        "12hrs": formData.hours12 || 0,
        "24hrs": formData.hours24 || 0,
      },
      educationQualification: formData.qualification || "",
      educationCertificate: certificateURL || "",
      experienceYears: formData.experience || 0,
      maritalStatus: formData.maritalStatus || "",
      languagesKnown: formData.languages || [],
      preferredShifts: formData.preferredShifts || [],
      jobRole: formData.jobRole || "",
      extraServicesOffered: formData.services || [],
      foodPreference: formData.foodPreference || "",
      smokes: formData.smoking || "",
      carryOwnFood12hrs: formData.carryFood || "",
      additionalInfo: formData.additionalInfo || "",
      selfTestimonial: recordingURL
        ? {
            customerName: formData.customerName || "",
            customerPhone: formData.customerPhone || "",
            recording: recordingURL || "",
          }
        : null,
      identityDocuments: {
        aadharNumber: formData.aadharNumber || "",
        aadharFront: aadharFrontURL || "",
        aadharBack: aadharBackURL || "",
        panNumber: formData.panNumber || "",
        panDocument: panCardURL,
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error saving form data:", error);
    return { success: false, error };
  }
};

// Get staff details from Firestore
export const getStaffDetails = async (userId: string) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnapshot = await getDoc(userRef);
    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      if (userData && userData.providerId) {
        // console.log("Staff details found:", userData);
        return {
          success: true,
          data: userData as StaffDetails,
        };
      }
    }
  } catch (error) {
    console.error("Error getting staff details:", error);
    return { success: false, error };
  }
};

// Fetch jobs from Firestore
export const fetchJobs = async (userStatus: string) => {
  console.log("Fetching jobs for user status:", userStatus);
  if (userStatus !== "live") {
    return {
      error:
        "Your application is under verification. You can take jobs after you have been approved.",
    };
  }

  try {
    const jobsCollection = collection(db, "jobs");
    const jobsQuery = query(jobsCollection, where("staffId", "==", "unknown"));
    // ,where("staffId", "==", "open")
    const querySnapshot = await getDocs(jobsQuery);
    console.log("Jobs found:", querySnapshot);

    const jobs = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      status: doc.data().status || "unknown",
      staffId: doc.data().staffId || "unknown",
      customerName: doc.data().customerName || "Unknown Patient",
      customerAge: doc.data().customerAge || 0,
      description: doc.data().description || "No description provided",
      requirements: doc.data().requirements || [],
      district: doc.data().district || "Unknown Location",
      subDistrict: doc.data().subDistrict || "Unknown Location",
      pincode: doc.data().pincode || 110042,
      JobType: doc.data().JobType || "Unknown Job Type",
      startDate: doc.data().startDate || new Date().toISOString(),
      endDate: doc.data().endDate || new Date().toISOString(),
    }));
    console.log("Jobs:", jobs);

    return { jobs };
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return { error: "Failed to fetch jobs. Please try again later." };
  }
};
