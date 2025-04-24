import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase/config";
import { doc, updateDoc } from "firebase/firestore";

export async function POST(req: NextRequest) {
  const { uid, userData } = await req.json();

  console.log("API Route: Received uid:", uid);
  console.log("API Route: Received userData:", userData);

  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, userData);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error creating user:", error.message, error.stack);
    return { success: false, error: error.message || "Unknown error" };
  }
}
