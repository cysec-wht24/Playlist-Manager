import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";

connect();

export async function GET() {
  try {
    const token = (await cookies()).get("token")?.value;
    console.log("🍪 token:", token);

    if (!token) {
      console.log("⚠️ no token found");
      return NextResponse.json({ error: "Token missing" }, { status: 400 });
    }

    const decoded = jwt.verify(token, process.env.SECRET_TOKEN!) as { id: string };
    console.log("🔓 decoded:", decoded);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      console.log("⚠️ user not found for id", decoded.id);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User found", data: {username: user.username}}, { status: 200 });
  } catch (err: any) {
    console.error("🔥 route error:", err);
    // send back err.message so it’s never undefined
    return NextResponse.json(
      { error: err.message || "Unknown error" },
      { status: err.message === "Token missing" ? 400 : 401 }
    );
  }
}


