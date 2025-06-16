import { NextRequest, NextResponse } from "next/server";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firestore"; // Assuming db is exported from here

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const { date, tasks } = await request.json();

    if (!userId || !date || !tasks) {
      return NextResponse.json(
        { message: "Missing userId, date, or tasks in request body" },
        { status: 400 }
      );
    }

    // Basic validation for date format (YYYY-MM-DD) - can be enhanced
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { message: "Invalid date format. Please use YYYY-MM-DD" },
        { status: 400 }
      );
    }

    const dailyTaskRef = doc(db, `users/${userId}/daily-tasks`, date);

    await setDoc(dailyTaskRef, tasks);

    return NextResponse.json(
      { message: "Daily tasks added successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding daily tasks:", error);
    return NextResponse.json(
      { message: "Error adding daily tasks", error },
      { status: 500 }
    );
  }
}
