import { db } from "./config"; // Adjust path based on your folder structure
import { collection, addDoc } from "firebase/firestore";

const jobStatuses = [
  "assigned",
  "available",
  "ongoing",
  "completed",
  "rejected",
];
const subDistricts = [
  "North West Delhi",
  "South Delhi",
  "East Delhi",
  "West Delhi",
  "Central Delhi",
];
const customerNames = [
  "Rahul Sharma",
  "Ananya Verma",
  "Karan Mehta",
  "Simran Kaur",
  "Vikram Singh",
];

export const addJobs = async () => {
  console.log("Adding jobs...");
  try {
    for (let i = 0; i < 5; i++) {
      const newJob = {
        customerAge: (60 + Math.floor(Math.random() * 30)).toString(), // Random age between 60-89
        customerName: customerNames[i],
        description:
          "Medical assistance as well as daily monitoring and helping with chores",
        district: "Delhi",
        pincode: "1100" + (40 + i).toString(), // Varying pincode
        requirements: ["Requirement 1", "Requirement 2", "Requirement 3"],
        staffId: "unknown",
        status: jobStatuses[i], // Assigning different status
        subDistrict: subDistricts[i], // Assigning different subdistrict
        timing: "24 hour Care",
      };

      await addDoc(collection(db, "jobs"), newJob);
      console.log(`Added job ${i + 1}:`, newJob);
    }
    console.log("All jobs added successfully!");
  } catch (error) {
    console.error("Error adding jobs:", error);
  }
};

addJobs();
