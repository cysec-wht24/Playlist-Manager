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
      videos: [], // Default to an empty array
      description: "", // Default empty description
      thumbnail: null, // Will be auto-set from Cloudinary when first video is added
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
        const playlists = await Playlist.find({ owner: userId })
          .select("name description thumbnail createdAt updatedAt videos")
          .lean(); // Convert to plain JavaScript objects for better performance

        // Check if no playlists exist
        if (!playlists || playlists.length === 0) {
            return NextResponse.json({
            message: "No playlists found for the user",
            playlists: [],
            });
        }

        // For each playlist, if it has videos but no thumbnail, use first video's thumbnail
        for (const playlist of playlists) {
          if (!playlist.thumbnail && playlist.videos && playlist.videos.length > 0) {
            // Get the first video's thumbnail from the videos array
            const firstVideo = playlist.videos[0];
            if (firstVideo?.thumbnail) {
              playlist.thumbnail = firstVideo.thumbnail;
            }
          }
        }
    
        // Return the playlists
        return NextResponse.json({
          message: "Playlists retrieved successfully",
          playlists,
        });
      } catch (error: any) {
        console.error("Error in GET /api/users/profile:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
}

export async function PATCH(request: NextRequest) {
    try {
        // Extract userId from the token
        const userId = getDataFromToken(request);
    
        // Parse the request body
        const reqBody = await request.json();
        const { playlistId, newName, description } = reqBody;
    
        // Validate playlistId
        if (!playlistId || typeof playlistId !== "string") {
          return NextResponse.json({ error: "Invalid or missing playlistId" }, { status: 400 });
        }

        // Prepare update object
        const updateFields: any = {};
        
        // Handle name update
        if (newName !== undefined) {
          if (typeof newName !== "string") {
            return NextResponse.json({ error: "Invalid newName" }, { status: 400 });
          }
          
          // Check if the new name is unique for the user
          const existingPlaylist = await Playlist.findOne({ owner: userId, name: newName });
          if (existingPlaylist && existingPlaylist._id.toString() !== playlistId) {
            return NextResponse.json(
              { error: "A playlist with this name already exists for the user" },
              { status: 400 }
            );
          }
          
          updateFields.name = newName;
        }

        // Handle description update
        if (description !== undefined) {
          if (typeof description !== "string") {
            return NextResponse.json({ error: "Invalid description" }, { status: 400 });
          }
          updateFields.description = description;
        }

        // Check if there are fields to update
        if (Object.keys(updateFields).length === 0) {
          return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
        }
    
        // Update the playlist
        const updatedPlaylist = await Playlist.findOneAndUpdate(
          { _id: playlistId, owner: userId }, // Ensure the playlist belongs to the user
          updateFields,
          { new: true } // Return the updated document
        );
    
        if (!updatedPlaylist) {
          return NextResponse.json({ error: "Playlist not found or not owned by the user" }, { status: 404 });
        }
    
        // Return success response
        return NextResponse.json({
          message: "Playlist updated successfully",
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