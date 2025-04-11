"use client";
import { useSearchParams } from "next/navigation";
import React from "react";

export default function Workspace() {
    const searchParams = useSearchParams();
    const playlistId = searchParams.get("playlistId");

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="container mx-auto p-8">
            {/* <div className="container mx-auto p-8"> */}
        <div className="flex h-[80vh] space-x-4">
            {/* <!-- Left Column: Video (3/4) + Editing Settings (1/4) --> */}
            <div className="flex-1 flex flex-col space-y-4">
            {/* <!-- Video Section --> */}
            <div className="flex-[3] bg-gray-700 rounded-lg p-4">
                Video and Workspace for Playlist ID:{" "}
            </div>
            {/* <!-- Editing Settings Section --> */}
            <div className="flex-[1] bg-gray-700 rounded-lg p-4">
                Editing settings for the playlist
            </div>
            </div>

            {/* <!-- Right Column: Playlists --> */}
            <div className="w-1/3 bg-gray-700 rounded-lg flex flex-col">
            {/* <!-- Top Div (Playlist Header) --> */}
            <div className="h-22 bg-gray-600 rounded-t-md flex items-center justify-center">
                <span className="font-bold">Playlists</span>
            </div>
            {/* <!-- Bottom Div (Remaining Space) --> */}
            <div className="flex-1 bg-gray-800 rounded-b-md">
                {/* <!-- Content for the playlist items or additional elements --> */}
            </div>
            </div>
            </div>
            </div>
            </div>
        // </div>
    );
}