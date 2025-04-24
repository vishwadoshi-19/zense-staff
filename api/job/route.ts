// pages/api/job/route.ts

import { NextApiRequest, NextApiResponse } from "next";
import { fetchJobs } from "@/lib/firebase/firestore"; // Make sure to import your Firestore function

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userStatus, userId } = req.body;

  console.log("userStatus", userStatus);
  console.log("userId", userId);

  try {
    const result = await fetchJobs(userStatus, userId);
    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    return res.status(200).json({ jobs: result.jobs });
  } catch (error) {
    console.error("Error in fetching jobs:", error);
    return res.status(500).json({ error: "Failed to fetch jobs" });
  }
}
