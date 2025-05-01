"use client";

import React, { useEffect, useState } from "react";
import { CldUploadWidget } from 'next-cloudinary';
import 'next-cloudinary/dist/cld-video-player.css';
import { CldVideoPlayer } from 'next-cloudinary';
import { useSearchParams } from "next/navigation";
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface Video {
  public_id: string;
  thumbnail_url: string | null;
  original_name: string | null;
  secure_url: string | null;
}

export default function Workspace() {
  const [videoDetails, setVideoDetails] = useState<Video[]>([]);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const playlistId = searchParams.get('id');

  const handleVideoClick = (video: Video) => {
    if (video.secure_url) {
      setSelectedVideoUrl(video.secure_url);
    }
  };

  useEffect(() => {
    const fetchVideoDetails = async () => {
      if (!playlistId) {
        setError("Missing playlist ID in URL.");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`/api/users/workspace?id=${encodeURIComponent(playlistId)}`);
        const videos: Video[] = response.data.videos;
        setVideoDetails(videos);

        if (videos.length > 0 && videos[0].secure_url) {
          setSelectedVideoUrl(videos[0].secure_url);
        } else {
          setSelectedVideoUrl(null);
        }
      } catch (err: any) {
        console.error('Error fetching video details:', err);
        setError('Failed to load video details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideoDetails();
  }, [playlistId]);

  const handleUploadSuccess = async (result: any, { widget }: any) => {
    if (!playlistId) {
      setError('Playlist ID is missing.');
      return;
    }

    try {
      const public_id = result?.info?.public_id;
      if (!public_id) {
        console.error('public_id is missing in the result object.');
        return;
      }
      const response = await axios.post('/api/users/workspace', {
        public_id,
        playlistId
      });

      toast.success('Upload data saved successfully!');
      window.location.reload();
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error('Server responded with:', error.response?.data);
      } else {
        console.error('Unexpected error:', error);
      }
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
              {selectedVideoUrl ? (
                <video
                  src={selectedVideoUrl}
                  className="absolute top-0 left-0 w-full h-full"
                  controls
                  autoPlay
                />
              ) : (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white">
                  No video selected
                </div>
              )}
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
                  <button
                    className="px-4 py-2 rounded-md bg-black text-white shadow-md hover:bg-gray-800 hover:shadow-lg transition-all duration-300"
                    onClick={() => open()}>
                    Upload Video
                  </button>
                )}
              </CldUploadWidget>
            </div>

            {/* Playlist Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loading && <p>Loading videos...</p>}
              {error && <p className="text-red-500">{error}</p>}
              {!loading && !error && videoDetails.length === 0 && (
                <p>No videos found in this playlist.</p>
              )}
              {videoDetails.map((video, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-3 border border-white rounded-md cursor-pointer"
                  onClick={() => handleVideoClick(video)}
                >
                  <div className="w-16 h-12 border border-white rounded-md bg-blue-800">
                    {video.thumbnail_url ? (
                      <img
                        src={video.thumbnail_url}
                        alt={video.original_name || 'Video'}
                        className="w-full h-full object-cover rounded-md"
                        loading="lazy"
                        title={video.original_name || 'Video'}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
                        No Thumbnail
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-white">{video.original_name || 'Untitled Video'}</div>
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


