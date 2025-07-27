import { fetchDailyTasks, getUserById } from "@/lib/firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

// --- CORS helper functions ---
function withCorsHeaders(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*"); // or specific origin
  response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

function jsonWithCors(data: any, status = 200) {
  const res = NextResponse.json(data, { status });
  return withCorsHeaders(res);
}

// --- OPTIONS handler ---
export function OPTIONS() {
  return withCorsHeaders(
    new NextResponse(null, {
      status: 204,
    })
  );
}

// --- GET handler ---
export async function GET(request: NextRequest) {
  try {
    // Get parameters from query string
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Validate required parameters
    if (!userId) {
      return jsonWithCors(
        { success: false, message: "userId parameter is required" },
        400
      );
    }

    // --- Add this user existence check ---
    const user = await getUserById(userId);
    if (!user) {
      return jsonWithCors(
        { success: false, message: "User not found" },
        404 // Use 404 for Not Found
      );
    }
    // --- End of added check ---

    if (!startDate || !endDate) {
      return jsonWithCors(
        {
          success: false,
          message: "startDate and endDate parameters are required",
        },
        400
      );
    }

    // Parse dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Validate date format
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return jsonWithCors(
        { success: false, message: "Invalid date format. Use YYYY-MM-DD" },
        400
      );
    }

    // Validate date range
    if (start > end) {
      return jsonWithCors(
        { success: false, message: "startDate must be before endDate" },
        400
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

    return withCorsHeaders(
      new NextResponse(
        JSON.stringify({
          success: true,
          data: results,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
    );
  } catch (error) {
    console.error("API error:", error);
    return jsonWithCors(
      { success: false, message: "Internal server error" },
      500
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
