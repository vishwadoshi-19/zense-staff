import { NextRequest, NextResponse } from "next/server";
import { pushSampleDailyTasks } from "@/lib/firebase/firestore";

export async function POST(req: NextRequest) {
  try {
    const { userId, date } = await req.json();

    if (!userId || !date) {
      return NextResponse.json(
        { success: false, message: "Missing parameters" },
        { status: 400 }
      );
    }

    const result = await pushSampleDailyTasks(userId, date);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
