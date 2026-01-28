import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import bcryptjs from "bcryptjs";
import { writeFile } from "fs/promises";
import path from "path";

connect();

// GET method to fetch user settings
export async function GET(request: NextRequest) {
  try {
    // Get user ID from token
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Find the user
    const user = await User.findById(userId).select("-password -forgotPasswordToken -forgotPasswordTokenExpiry -verifyToken -verifyTokenExpiry");
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        username: user.username,
        email: user.email,
        fullName: user.fullName || "",
        profilePicture: user.profilePicture || "",
        isVerified: user.isVerified,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error: any) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

// POST method to update user settings
export async function POST(request: NextRequest) {
  try {
    // Get user ID from token
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const fullName = formData.get("fullName") as string;
    const username = formData.get("username") as string;
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const profilePictureFile = formData.get("profilePicture") as File | null;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Update basic fields
    if (fullName !== undefined && fullName !== null) {
      user.fullName = fullName;
    }

    // Check if username is being changed and if it's already taken
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return NextResponse.json(
          { error: "Username already taken" },
          { status: 400 }
        );
      }
      user.username = username;
    }

    // Handle password change
    if (currentPassword && newPassword) {
      // Verify current password
      const validPassword = await bcryptjs.compare(currentPassword, user.password);
      if (!validPassword) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 400 }
        );
      }

      // Validate new password length
      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: "New password must be at least 6 characters" },
          { status: 400 }
        );
      }

      // Hash and update new password
      const salt = await bcryptjs.genSalt(10);
      user.password = await bcryptjs.hash(newPassword, salt);
    }

    // Handle profile picture upload
    if (profilePictureFile && profilePictureFile.size > 0) {
      const bytes = await profilePictureFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create unique filename
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(profilePictureFile.name) || '.jpg';
      const filename = `profile-${userId}-${uniqueSuffix}${ext}`;
      const uploadDir = path.join(process.cwd(), "public", "uploads", "profiles");
      const filepath = path.join(uploadDir, filename);

      // Ensure the directory exists
      const fs = require("fs");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Write file
      await writeFile(filepath, buffer);

      // Update user profile picture path
      user.profilePicture = `/uploads/profiles/${filename}`;
    }

    // Save updated user
    await user.save();

    return NextResponse.json({
      message: "Settings updated successfully",
      success: true,
      user: {
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error: any) {
    console.error("Settings update error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update settings" },
      { status: 500 }
    );
  }
}