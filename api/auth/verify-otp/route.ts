import { NextRequest, NextResponse } from "next/server";
import { PhoneAuthProvider, signInWithCredential } from "firebase/auth";
import { auth, db } from "@/lib/firebase/config";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

export async function POST(req: NextRequest) {
  const { verificationId, otp } = await req.json();

  try {
    const credential = PhoneAuthProvider.credential(verificationId, otp);
    const result = await signInWithCredential(auth, credential);
    const user = result.user;

    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    let isNewUser = false;

    if (!userDoc.exists()) {
      await setDoc(userRef, {
        phone: user.phoneNumber,
        status: "unregistered",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      isNewUser = true;
    } else {
      await updateDoc(userRef, { updatedAt: serverTimestamp() });
    }

    return NextResponse.json({
      success: true,
      user: {
        uid: user.uid,
        phone: user.phoneNumber,
      },
      isNewUser,
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
