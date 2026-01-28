// Create this file at: app/api/users/transform/route.ts

import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { v2 as cloudinary } from 'cloudinary';

connect();

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    // Authenticate the user
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const { public_id, aspectRatio, quality, format, playlistId } = await request.json();
    console.log('Transform request:', { public_id, aspectRatio, quality, format, playlistId });

    // Validate inputs
    if (!public_id) {
      return NextResponse.json({ error: "Missing public_id" }, { status: 400 });
    }

    // Build transformation array (not string)
    const transformations: any[] = [];

    // Aspect ratio transformation
    if (aspectRatio && aspectRatio !== 'original') {
      const aspectMap: { [key: string]: { width: number, height: number, crop: string, gravity: string } } = {
        '16:9': { width: 1920, height: 1080, crop: 'fill', gravity: 'auto' },
        '9:16': { width: 1080, height: 1920, crop: 'fill', gravity: 'auto' },
        '1:1': { width: 1080, height: 1080, crop: 'fill', gravity: 'auto' },
        '4:3': { width: 1440, height: 1080, crop: 'fill', gravity: 'auto' },
        '21:9': { width: 2560, height: 1080, crop: 'fill', gravity: 'auto' },
        '4:5': { width: 1080, height: 1350, crop: 'fill', gravity: 'auto' }
      };

      if (aspectMap[aspectRatio]) {
        transformations.push(aspectMap[aspectRatio]);
      }
    }

    // Quality transformation
    if (quality && quality !== 'auto') {
      const qualityMap: { [key: string]: { height: number, quality: string, crop: string } } = {
        '1080p': { height: 1080, quality: 'auto:good', crop: 'scale' },
        '720p': { height: 720, quality: 'auto:good', crop: 'scale' },
        '480p': { height: 480, quality: 'auto', crop: 'scale' },
        '360p': { height: 360, quality: 'auto', crop: 'scale' }
      };

      if (qualityMap[quality]) {
        transformations.push(qualityMap[quality]);
      }
    }

    console.log('Transformation array:', transformations);

    // Generate the transformed URL using Cloudinary SDK
    const transformedUrl = cloudinary.url(public_id, {
      resource_type: 'video',
      format: format.toLowerCase(),
      transformation: transformations.length > 0 ? transformations : undefined,
      secure: true
    });

    console.log('Generated transformed URL:', transformedUrl);

    // Verify the URL is accessible (optional - just for logging)
    try {
      const resourceCheck = await cloudinary.api.resource(public_id, {
        resource_type: 'video',
      });
      console.log('Original resource verified:', resourceCheck.public_id);
    } catch (err) {
      console.error('Could not verify resource:', err);
    }

    return NextResponse.json({
      message: "Video transformation settings applied successfully",
      url: transformedUrl,
      public_id: public_id,
      format: format.toLowerCase(),
      transformations: transformations,
      note: "The video will be served with these transformations applied."
    });

  } catch (error: any) {
    console.error("Error transforming video:", error);
    console.error("Error details:", {
      message: error.message,
      error: error.error,
      stack: error.stack
    });
    
    return NextResponse.json(
      { 
        error: error.message || "Internal Server Error",
        details: error.error?.message || error.toString()
      },
      { status: 500 }
    );
  }
}