import { NextRequest, NextResponse } from "next/server";
import { getStaffDetails } from "@/lib/firebase/firestore";

export async function GET(req: NextRequest) {
  console.log("GET request to /api/staff initiated");
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }
    const result = await getStaffDetails(userId);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error in /api/staff:", error);
    // In production, you might return a generic error message instead of error.message.
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
  console.log("GET request to /api/staff completed");
}
