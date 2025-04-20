"use client";
import React from "react";
import { CldVideoPlayer } from 'next-cloudinary';
import { CldUploadButton } from 'next-cloudinary';
import 'next-cloudinary/dist/cld-video-player.css';

export default function Workspace() {


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <div className="container mx-auto p-4">
            <div className="flex h-[80vh] space-x-4">
            
            {/* Left Column */}
            <div className="flex-1 flex flex-col space-y-4">
                
                {/* Video Workspace */}
                {/* <div className="flex-[3] bg-gray-800 rounded-xl border border-white p-4"> */}
                <div className="w-full h-full relative overflow-hidden rounded-lg">
                <CldVideoPlayer
                    id="adaptive-bitrate-streaming"
                    src="https://res.cloudinary.com/dlcdnrtoh/video/upload/v1745097381/samples/dance-2.mp4"
                    transformation={{ streaming_profile: 'hd' }}
                    sourceTypes={['hls']}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                />
                </div>
                {/* </div> */}

                {/* Editing Settings */}
                <div className="flex-[1] bg-gray-800 rounded-xl border border-white p-4">
                <p className="text-lg font-semibold">Editing settings for the playlist</p>
                </div>
            </div>

            {/* Right Column: Playlist List */}
            <div className="w-1/3 bg-gray-800 rounded-xl border border-white flex flex-col">
                
                {/* Upload Button */}
                <div className="h-20 bg-gray-700 rounded-xl border-b-2 border-white flex items-center justify-center">

                <CldUploadButton
                signatureEndpoint="<Endpoint (ex: /api/sign-cloudinary-params)>"
                uploadPreset="<Upload Preset>"
                className="px-4 py-2 rounded-md bg-black text-white shadow-md hover:bg-gray-800 hover:shadow-lg transition-all duration-300"
                />
                {/* <button className="px-4 py-2 rounded-md bg-black text-white shadow-md hover:bg-gray-800 hover:shadow-lg transition-all duration-300">
                Upload
                </button> */}
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