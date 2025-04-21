"use client";
import React from "react";
import { CldUploadWidget } from 'next-cloudinary';
import 'next-cloudinary/dist/cld-video-player.css';
import { CldVideoPlayer } from 'next-cloudinary';

import axios from 'axios';
import { toast } from 'react-hot-toast';


export default function Workspace() {
    
    const handleUploadSuccess = async (result: any, { widget }: any) => {
        try {
            // Close the widget UI
            // widget.close(); // it closes automatically after upload
      
            // Send the *entire* `result` object to your backend
            const response = await axios.post('/api/users/workspace', result);
            console.log('Backend response:', response.data);
            toast.success('Upload data saved successfully!');
            
            // Redirect or refresh as needed
            // window.location.reload();
          } catch (error: any) {
            console.error('Error saving upload data:', error);
            toast.error('Failed to save upload data.');
          }
      };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <div className="container mx-auto p-4">
            <div className="flex h-[80vh] space-x-4">
            
            {/* Left Column */}
            <div className="flex-1 flex flex-col space-y-4">
                
                {/* Video Workspace */}
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                {/* <CldVideoPlayer id="adaptive-bitrate-streaming" 
                width="1620"
                height="1080"
                src="<Your Public ID>"
                transformation={{
                    streaming_profile: 'hd',
                }}
                sourceTypes={['hls']}
                /> */}
                <iframe
                    src="https://res.cloudinary.com/dlcdnrtoh/video/upload/t_my_transformation/samples/cld-sample-video.mp4"
                    className="absolute top-0 left-0 w-full h-full"
                    allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                    allowFullScreen
                ></iframe>
                </div>

                {/* Editing Settings */}
                <div className="flex-[1] bg-gray-800 rounded-xl border border-white p-4">
                <p className="text-lg font-semibold">Editing settings for the playlist</p>
                </div>
            </div>

            {/* Right Column: Playlist List */}
            <div className="w-1/3 bg-gray-800 rounded-xl border border-white flex flex-col">
                
                {/* Upload Button */}
                <div className="h-20 bg-gray-700 rounded-xl border-b-2 border-white flex items-center justify-center">

                <CldUploadWidget
                signatureEndpoint="/api/users/sign-cloudinary-params"
                options={{ sources: ['local', 'url', 'unsplash'] }}
                onSuccess={handleUploadSuccess}>
                {({ open }) => (
                    <button className="px-4 py-2 rounded-md bg-black text-white shadow-md hover:bg-gray-800 hover:shadow-lg transition-all duration-300" 
                    onClick={() => open()}>
                    Upload Video
                    </button>
                )}
                </CldUploadWidget>
                </div>

                {/* Playlist Items */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {[1, 2, 3, 4].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 p-3 border border-white rounded-md">
                    <div className="w-16 h-12 border border-white rounded-md bg-blue-800"></div>
                    <div>
                        <div className="text-white">Title of the video</div>
                        <div className="text-sm text-gray-300">Posted date</div>
                    </div>
                    </div>
                ))}
                </div>
            </div>
            
            </div>
        </div>
        </div>

    );
}

