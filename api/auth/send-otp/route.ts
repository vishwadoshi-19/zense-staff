import { NextRequest, NextResponse } from "next/server";
import { setupRecaptcha, sendOTP } from "@/lib/firebase/auth";

export async function POST(req: NextRequest) {
  try {
    const { phoneNumber } = await req.json();
    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    const recaptchaVerifier = setupRecaptcha("recaptcha-container"); // invisible
    const result = await sendOTP(phoneNumber, recaptchaVerifier);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ verificationId: result.verificationId });
  } catch (error) {
    console.error("Error in send-otp API:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
