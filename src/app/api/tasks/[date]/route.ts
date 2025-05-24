import { fetchDailyTasks } from "@/lib/firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { date: string } }
) {
  try {
    const { date } = params;

    // Get userId from query parameter instead of auth
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "userId parameter is required" },
        { status: 400 }
      );
    }

    if (!date) {
      return NextResponse.json(
        { success: false, message: "Date parameter is required" },
        { status: 400 }
      );
    }

    const result = await fetchDailyTasks(userId, date);

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        {
          success: false,
          message: result.message || "Failed to fetch tasks",
        },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
