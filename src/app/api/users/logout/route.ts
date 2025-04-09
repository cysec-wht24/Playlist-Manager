import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("Logout API called"); // Debug log
    const response = NextResponse.json(
      {
        message: "Logout successful",
        success: true,
      }
    );
    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    console.log("Logout response sent"); // Debug log
    return response;
  } catch (error: any) {
    console.error("Logout API error:", error.message); // Debug log
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}