"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../../components/ui/sidebar";
import { IconArrowLeft, IconSettings, } from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "../../../lib/utils";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

type Playlist = {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
};

// Optional, maybe should be in route.ts of profile
function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export default function SidebarDemo() {
  const router = useRouter();
  const [username, setUsername] = useState("Username");

  // Fetch username from the /api/users/me endpoint
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await axios.get("/api/users/me");
        setUsername(response.data.data.username); // Update the username state
      } catch (error: any) {
        console.error("Error fetching username:", error.message);
        toast.error("Failed to fetch user data");
      }
    };

    fetchUsername();
  }, []); // This runs only once when the component mounts

  useEffect(() => {
    const token = getCookie("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const logout = async () => {
    try {
      console.log("Calling logout API..."); // Debug log
      const response = await axios.get("/api/users/logout");
      console.log("Logout API response:", response.data); // Debug log

      if (response.data.success) {
        toast.success(response.data.message);
        router.push("/login");
      } else {
        toast.error("Logout failed");
      }
    } catch (error: any) {
      console.error("Logout error:", error.message);
      toast.error("An error occurred while logging out");
    }
  };

  const links = [
    {
      label: "Settings",
      href: "#",
      icon: (
        <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
      onClick: logout,
    },
  ];

  const [open, setOpen] = useState(false);

  return (
    <div className={cn("mx-auto flex w-full flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800 h-screen")}>
      <Sidebar open={open} setOpen={setOpen} animate={true}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            <Logo />
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: username || "Loading...",
                href: "#",
                icon: null,
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <Dashboard />
    </div>
  );
}

export const Logo = () => {
  return (
    <Link
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black">
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white">
        PlayStar
      </motion.span>
    </Link>
  );
};

const Dashboard = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch playlists from the backend.
  const fetchPlaylists = useCallback(async () => {
    try { //wanna remove callback just remove callBack()
      setLoading(true);
      setError(null);
      const response = await axios.get("/api/users/profile");
      setPlaylists(response.data.playlists);
    } catch (error: any) {
      console.error("Error fetching playlists:", error);
      setError("Failed to load playlists. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  // Add a new playlist
  const handleAddNew = async () => {
    const playlistName = prompt("Enter the name of the new playlist:");
    if (!playlistName || !playlistName.trim()) {
      toast.error("Playlist name cannot be empty.");
      return;
    }

    try {
      const response = await axios.post("/api/users/profile", { playlistName });
      setPlaylists([...playlists, response.data.playlist]);
      toast.success("Playlist created successfully!");
    } catch (error: any) {
      console.error("Error creating playlist:", error);
      toast.error(error.response?.data?.error || "Failed to create playlist. Please try again.");
    }
  };

  // Rename a playlist
  const handleRename = async (playlistId: string) => {
    const newName = prompt("Enter the new name for the playlist:");
    if (!newName || !newName.trim()) {
      toast.error("Playlist name cannot be empty.");
      return;
    }

    try {
      const response = await axios.patch("/api/users/profile", {
        playlistId,
        newName,
      });
      setPlaylists(
        playlists.map((playlist) =>
          playlist._id === playlistId ? response.data.playlist : playlist
        )
      );
      toast.success("Playlist renamed successfully!");
    } catch (error: any) {
      console.error("Error renaming playlist:", error);
      toast.error(error.response?.data?.error || "Failed to rename playlist. Please try again.");
    }
  };

  // Delete a playlist
  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this playlist?");
    if (!confirmDelete) return;

    try {
      await axios.delete("/api/users/profile", { data: { playlistId: id } });
      setPlaylists(playlists.filter((playlist) => playlist._id !== id));
      toast.success("Playlist deleted successfully!");
    } catch (error) {
      console.error("Error deleting playlist:", error);
      toast.error("Failed to delete playlist. Please try again.");
    }
  };

  // Navigate to the workspace
  const handleEdit = (id: string) => {
    router.push(`/profile/workspace?id=${id}`);
  };

  return (
    <div className="flex flex-1 flex-col h-screen rounded-tl-2xl rounded-tr-2xl overflow-hidden border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
      {/* Navbar */}
      <header className="sticky top-0 z-10 bg-black p-6 border-b border-neutral-700 flex justify-between items-center rounded-tl-2xl rounded-tr-2xl">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <div className="flex space-x-4">
          <button
            onClick={handleAddNew}
            className="bg-slate-100 grid place-items-center py-2 px-4 rounded-full font-bold shadow-md"
          >
            Add New
          </button>
          <button
            onClick={fetchPlaylists}
            className="bg-slate-100 grid place-items-center py-2 px-4 rounded-full font-bold shadow-md"
          >
            Refresh
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <h2 className="text-2xl font-bold text-black dark:text-white mb-6">Created Playlists:</h2>
        {loading ? (
          <p className="text-center text-gray-500">Loading playlists...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : playlists.length > 0 ? (
          playlists.map((playlist) => (
            <div
              key={playlist._id}
              className="group relative bg-black border border-gray-700 rounded-lg overflow-hidden shadow-lg flex mb-4"
            >
              {/* Left: Image Placeholder */}
              <div className="p-4 flex items-center justify-center">
                <a href="#">
                  <div className="h-32 w-44 bg-gray-800 flex items-center justify-center rounded-lg">
                    <span className="text-sm text-gray-400">Image Placeholder</span>
                  </div>
                </a>
              </div>
              {/* Right: Playlist Details */}
              <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                  <h2 className="mt-1 text-xl font-bold text-gray-300">
                    Name: {playlist.name}
                  </h2>
                  <p className="mt-1 text-md font-bold text-gray-300">
                    Description: {playlist.description || "No description provided"}
                  </p>
                  <p className="mt-1 text-md font-bold text-gray-300">
                    Created At: {new Date(playlist.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex justify-end space-x-4 mt-4">
                  <button
                    onClick={() => handleEdit(playlist._id)}
                    className="w-32 text-center px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition duration-300 text-sm font-semibold"
                  >
                    Activate
                  </button>
                  <button
                    onClick={() => handleRename(playlist._id)}
                    className="w-32 text-center px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition duration-300 text-sm font-semibold"
                  >
                    Rename
                  </button>
                  <button
                    onClick={() => handleDelete(playlist._id)}
                    className="w-32 text-center px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition duration-300 text-sm font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No playlists found.</p>
        )}
      </div> // can make it main for SEO
    </div>
  );
};
