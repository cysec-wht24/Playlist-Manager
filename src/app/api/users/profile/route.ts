import {connect} from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import Playlist from "@/models/playlistModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect()

export async function POST(request: NextRequest) {
  try {
    console.log("POST /api/users/profile called"); // Debug log

    // Extract userId from the token
    const userId = getDataFromToken(request);

    const reqBody = await request.json();
    const { playlistName } = reqBody;

    // Validate input
    if (!playlistName || typeof playlistName !== "string") {
      return NextResponse.json({ error: "Invalid or missing playlistName" }, { status: 400 });
    }

    // Create a new playlist
    const newPlaylist = await Playlist.create({
      owner: userId,
      name: playlistName,
      music: [], // Default to an empty array
    });

    return NextResponse.json({
      message: "Playlist created successfully",
      playlist: newPlaylist,
    });
  } catch (error: any) {
    // Handle duplicate key error
    if (error.code === 11000) {
      console.error("Duplicate key error:", error.message); // Log the error for debugging
      return NextResponse.json(
        { error: "A playlist with this name already exists for the user" },
        { status: 400 }
      );
    }

    // Handle other errors
    console.error("Error in POST /api/users/profile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
    try {
        // Extract userId from the token
        const userId = getDataFromToken(request);
    
        // Retrieve playlists for the user
        const playlists = await Playlist.find({ owner: userId }).select(
          "name description createdAt updatedAt"
        );

        // Check if no playlists exist
        if (!playlists || playlists.length === 0) {
            return NextResponse.json({
            message: "No playlists found for the user",
            playlists: [],
            });
        }
    
        // Return the playlists
        return NextResponse.json({
          message: "Playlists retrieved successfully",
          playlists,
        });
      } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
}

export async function PATCH(request: NextRequest) {
    try {
        // Extract userId from the token
        const userId = getDataFromToken(request);
    
        // Parse the request body
        const reqBody = await request.json();
        const { playlistId, newName } = reqBody;
    
        // Validate input
        if (!playlistId || typeof playlistId !== "string") {
          return NextResponse.json({ error: "Invalid or missing playlistId" }, { status: 400 });
        }
        if (!newName || typeof newName !== "string") {
          return NextResponse.json({ error: "Invalid or missing newName" }, { status: 400 });
        }
    
        // Check if the new name is unique for the user
        const existingPlaylist = await Playlist.findOne({ owner: userId, name: newName });
        if (existingPlaylist) {
          return NextResponse.json(
            { error: "A playlist with this name already exists for the user" },
            { status: 400 }
          );
        }
    
        // Update the playlist name
        const updatedPlaylist = await Playlist.findOneAndUpdate(
          { _id: playlistId, owner: userId }, // Ensure the playlist belongs to the user
          { name: newName },
          { new: true } // Return the updated document
        );
    
        if (!updatedPlaylist) {
          return NextResponse.json({ error: "Playlist not found or not owned by the user" }, { status: 404 });
        }
    
        // Return success response
        return NextResponse.json({
          message: "Playlist name updated successfully",
          playlist: updatedPlaylist,
        });
      } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
}

export async function DELETE(request: NextRequest) {
    try {
        // Extract userId from the token
        const userId = getDataFromToken(request);
    
        // Parse the request body
        const reqBody = await request.json();
        const { playlistId } = reqBody;
    
        // Validate input
        if (!playlistId || typeof playlistId !== "string") {
          return NextResponse.json({ error: "Invalid or missing playlistId" }, { status: 400 });
        }
    
        // Find and delete the playlist
        const deletedPlaylist = await Playlist.findOneAndDelete({
          _id: playlistId,
          owner: userId, // Ensure the playlist belongs to the authenticated user
        });
    
        if (!deletedPlaylist) {
          return NextResponse.json(
            { error: "Playlist not found or not owned by the user" },
            { status: 404 }
          );
        }
    
        // Return success response
        return NextResponse.json({
          message: "Playlist deleted successfully",
          playlist: deletedPlaylist,
        })
      } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
}

 
