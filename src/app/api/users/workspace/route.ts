import {connect} from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { v2 as cloudinary } from 'cloudinary';

import Playlist from '@/models/playlistModel';
import mongoose from 'mongoose';

connect()

// Configure Cloudinary - Make sure this runs before any API calls
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function generateThumbnailUrl(
  publicId: string,
  {
    startOffset = '0',     
    width       = 320,     
    height      = 180      
  } = {}
): string {
  return cloudinary.url(publicId, {
    resource_type: 'video',               
    format: 'jpg',                        
    transformation: [
      { start_offset: startOffset },      
      { width, height, crop: 'fill' }     
    ]
  });
}

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
  try {
    // Authenticate the user
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract and validate playlistId from query parameters
    const playlistId = request.nextUrl.searchParams.get("id");
    if (!playlistId || !mongoose.Types.ObjectId.isValid(playlistId)) {
      return NextResponse.json({ error: "Invalid playlist ID" }, { status: 400 });
    }

    // Fetch the playlist document
    const playlist = await Playlist.findOne({ _id: playlistId, owner: userId });
    if (!playlist) {
      return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
    }

    const publicIds: string[] = playlist.videos;

    // Log config to verify it's loaded
    console.log('Cloudinary config check:', {
      cloud_name: cloudinary.config().cloud_name,
      api_key: cloudinary.config().api_key ? 'Set' : 'Not set',
      api_secret: cloudinary.config().api_secret ? 'Set' : 'Not set'
    });

    // Fetch video details from Cloudinary for each public_id
    const details = await Promise.all(
      publicIds.map(async (id) => {
        try {
          // Explicitly pass config if needed
          const result = await cloudinary.api.resource(id, {
            resource_type: "video",
          });

          const thumbnail_url = generateThumbnailUrl(id, {
            startOffset: "2", 
            width: 640,
            height: 360,
          });

          return {
            public_id: id,
            original_name: result.original_filename,
            secure_url: result.secure_url,
            thumbnail_url,
          };
        } catch (error) {
          console.error(`Error fetching details for public_id ${id}:`, error);
          // Return fallback data with generated thumbnail URL
          const thumbnail_url = generateThumbnailUrl(id, {
            startOffset: "2",
            width: 640,
            height: 360,
          });
          
          return {
            public_id: id,
            original_name: id, // Use public_id as fallback name
            secure_url: `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/${id}.mp4`,
            thumbnail_url,
          };
        }
      })
    );

    return NextResponse.json({ videos: details });
  } catch (error) {
    console.error("Error retrieving playlist videos:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function DELETE(request: NextRequest) {
  try {
    // Authenticate the user
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Extract playlistId from query parameters
    const playlistId = request.nextUrl.searchParams.get('id');
    console.log('Playlist ID backend API:', playlistId);

    // Validate the playlistId
    if (!playlistId || !mongoose.Types.ObjectId.isValid(playlistId)) {
      console.log('Invalid playlist ID');
      return NextResponse.json({ error: 'Invalid playlist ID' }, { status: 400 });
    }

    // Parse request body
    const { public_id} = await request.json();

    // Validate inputs
    if (!public_id) {
      return NextResponse.json(
        { error: 'Missing public_id' },
        { status: 400 }
      );
    }

    // Delete video from Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.destroy(public_id, {
      resource_type: 'video',
      invalidate: true,
    });

    if (cloudinaryResponse.result !== 'ok') {
      return NextResponse.json(
        { error: 'Failed to delete video from Cloudinary' },
        { status: 500 }
      );
    }

    // Update the playlist by removing the video's public_id
    const updatedPlaylist = await Playlist.findOneAndUpdate(
      { _id: playlistId, owner: userId },
      { $pull: { videos: public_id } },
      { new: true }
    );

    if (!updatedPlaylist) {
      return NextResponse.json(
        { error: 'Playlist not found or not owned by user' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Video removed from playlist and deleted from Cloudinary successfully',
      playlist: updatedPlaylist,
    });
  } catch (error) {
    console.error('Error removing video from playlist:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}