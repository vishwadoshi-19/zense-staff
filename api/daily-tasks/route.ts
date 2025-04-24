import { NextRequest, NextResponse } from "next/server";
import {
  saveDailyTasks,
  fetchDailyTasks,
  doc,
  db,
} from "@/lib/firebase/firestore";
import { getDoc, serverTimestamp, setDoc } from "firebase/firestore";

export async function GET(req: NextRequest) {
  console.log("GET handler loaded");

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const date = searchParams.get("date");

  if (!userId || !date) {
    return NextResponse.json(
      { success: false, message: "Missing parameters" },
      { status: 400 }
    );
  }

  const result = await fetchDailyTasks(userId, date);
  if (result.success) {
    return NextResponse.json(result.data);
  } else {
    return NextResponse.json(
      { success: false, error: result.error || result.message },
      { status: 500 }
    );
  }
}

// export async function POST(req: NextRequest) {
//   console.log("POST handler loaded");

//   try {
//     const body = await req.json();
//     const { userId, date, data } = body;

//     if (!userId || !date || !data) {
//       return NextResponse.json(
//         { message: "Missing userId, date or data" },
//         { status: 400 }
//       );
//     }

//     const docRef = doc(db, "users", userId, "daily-tasks", date);
//     await setDoc(docRef, {
//       ...data,
//       createdAt: new Date().toISOString(),
//     });

//     return NextResponse.json(
//       { message: "Task created successfully" },
//       { status: 201 }
//     );
//   } catch (error: any) {
//     console.error("Error creating task:", error);
//     return NextResponse.json(
//       { message: "Something went wrong", error: error.message },
//       { status: 500 }
//     );
//   }
// }

export async function POST(req: NextRequest) {
  console.log("🔥 POST handler triggered");

  const body = await req.json();
  console.log("📦 Request Body:", body);

  return NextResponse.json({ message: "POST received", body });
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, date, data } = body;

    if (!userId || !date || !data) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if daily task already exists (if needed)
    const existing = await fetchDailyTasks(userId, date);

    const taskRef = doc(db, "users", userId, "daily-tasks", date); // Firestore path: users/{userId}/daily-tasks/{date}
    await setDoc(taskRef, data, { merge: true });

    return NextResponse.json(
      { message: "Daily task updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating daily task:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
