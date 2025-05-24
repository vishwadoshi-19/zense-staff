import { fetchDailyTasks } from "@/lib/firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get parameters from query string
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Validate required parameters
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "userId parameter is required" },
        { status: 400 }
      );
    }

    if (!startDate || !endDate) {
      return NextResponse.json(
        {
          success: false,
          message: "startDate and endDate parameters are required",
        },
        { status: 400 }
      );
    }

    // Parse dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Validate date format
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        { success: false, message: "Invalid date format. Use YYYY-MM-DD" },
        { status: 400 }
      );
    }

    // Validate date range
    if (start > end) {
      return NextResponse.json(
        { success: false, message: "startDate must be before endDate" },
        { status: 400 }
      );
    }

    // Generate array of dates between start and end
    const dateRange = getDatesInRange(start, end);

    // Fetch tasks for each date
    const results = await Promise.all(
      dateRange.map(async (date) => {
        const formattedDate = formatDate(date);
        const result = await fetchDailyTasks(userId, formattedDate);

        return {
          date: formattedDate,
          data: result.success ? result.data : null,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper function to get all dates in a range
function getDatesInRange(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

// Helper function to format date as YYYY-MM-DD
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
