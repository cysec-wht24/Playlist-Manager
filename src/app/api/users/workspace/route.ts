import {connect} from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { v2 as cloudinary } from 'cloudinary';
import Playlist from '@/models/playlistModel';

connect()

export async function POST(request: NextRequest) {
    try {
        // Authenticate the user
        const userId = await getDataFromToken(request);
        if (!userId) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    
        // Parse request body
        const { public_id, playlistId } = await request.json();
        console.log("Received data:", { public_id, playlistId });
    
        // Validate inputs
        if (!public_id) {
          return NextResponse.json(
            { error: "Missing public_id" },
            { status: 400 }
          );
        }

        if (!playlistId) {
            return NextResponse.json(
              { error: "Missing playlist_Id" },
              { status: 400 }
            );
          }
    
        // Update the playlist by adding the new video's public_id
        const updatedPlaylist = await Playlist.findOneAndUpdate(
          { _id: playlistId, owner: userId },
          { $push: { videos: public_id } },
          { new: true }
        );
    
        if (!updatedPlaylist) {
          console.error(`Failed to update playlist with ID: ${playlistId}`);
          return NextResponse.json(
            { error: "Playlist not found or not owned by user" },
            { status: 404 }
          );
        }
    
        return NextResponse.json({
          message: "Video added to playlist successfully",
          playlist: updatedPlaylist,
        });
      } catch (error) {
        console.error("Error adding video to playlist:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
      }
}

export async function GET(request: NextRequest) {
    //so in get request I would want to retreive the videos inside a playlist inside the user's account from cloudinary
    //while retreiving I would need thier their title, thumbnail, and other things required to play it I don't actually know what is that 
}

export async function DELETE(request: NextRequest) {}

// video-upload will have two function one to upload POST, 
// one to transform inside the POST also the post will set 
// things up about video in the mongodb, one more function 
// that I can think of right now is the retreival function 
// that would retreive all playlists video, Delete function, 
// update function thats it.

//in Post function first of all check if it is a video or not


