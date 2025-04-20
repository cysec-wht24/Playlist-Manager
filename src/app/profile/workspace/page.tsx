"use client";
import { useSearchParams } from "next/navigation";
import React from "react";

export default function Workspace() {
    const searchParams = useSearchParams();
    const playlistId = searchParams.get("playlistId");

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <div className="container mx-auto p-4">
            <div className="flex h-[80vh] space-x-4">
            
            {/* Left Column */}
            <div className="flex-1 flex flex-col space-y-4">
                
                {/* Video Workspace */}
                <div className="flex-[3] bg-gray-800 rounded-xl border border-white p-4">
                <p className="text-lg font-semibold">Video and Workspace for Playlist ID:</p>
                </div>

                {/* Editing Settings */}
                <div className="flex-[1] bg-gray-800 rounded-xl border border-white p-4">
                <p className="text-lg font-semibold">Editing settings for the playlist</p>
                </div>
            </div>

            {/* Right Column: Playlist List */}
            <div className="w-1/3 bg-gray-800 rounded-xl border border-white flex flex-col">
                
                {/* Upload Button */}
                <div className="h-20 bg-gray-700 rounded-xl flex items-center justify-center">
                <button className="px-4 py-2 border border-white rounded-md">Upload</button>
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