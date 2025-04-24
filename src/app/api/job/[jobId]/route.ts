import { NextRequest, NextResponse } from "next/server";
import { getJobById } from "@/lib/firebase/firestore"; // Adjust if stored elsewhere

export async function POST(req: NextRequest) {
  try {
    const { jobId } = await req.json();

    if (!jobId) {
      return NextResponse.json({ error: "Missing jobId" }, { status: 400 });
    }

    const job = await getJobById(jobId);
    if (job.error) {
      return NextResponse.json({ error: job.error }, { status: 404 });
    }

    return NextResponse.json({ job });
  } catch (error) {
    console.error("Error in /api/get-job:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
