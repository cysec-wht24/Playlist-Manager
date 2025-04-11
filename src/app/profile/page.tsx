"use client";
import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../../components/ui/sidebar";
import { IconArrowLeft, IconSettings, } from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "../../../lib/utils";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

// Optional, maybe should be in route.ts of profile
function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export default function SidebarDemo() {
  const router = useRouter();

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
                label: "Manu Arora",
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
  // Example list of playlists
  const playlists = [
    { id: "123", name: "Playlist 1", videos: 10 },
    { id: "456", name: "Playlist 2", videos: 5 },
    { id: "789", name: "Playlist 3", videos: 8 },
  ];

  const router = useRouter();

  // Edit handler for a specific playlist
  const handleEdit = (id: string) => {
    router.push(`/profile/workspace?id=${id}`); // Navigate to the workspace with the playlist ID
  };

  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
        <header className="p-6 border-b flex justify-between bg-black rounded-lg">
          <h1 className="text-2xl font-bold text-white">CRUD Operation</h1>
          <Link
            href="/create"
            className="bg-slate-100 grid place-items-center py-2 px-4 rounded-full font-bold shadow-md"
          >
            Add New
          </Link>
        </header>

        <h2 className="text-2xl font-bold text-white mt-4 mb-6">
          Created Playlists:
        </h2>

        {/* Render the list of playlists */}
        <div className="w-full mx-auto">
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
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
                    No. of videos: {playlist.videos}
                  </p>
                </div>
                <div className="flex justify-end space-x-4 mt-4">
                  <a
                    href="#"
                    onClick={() => handleEdit(playlist.id)} // Pass the playlist ID
                    className="w-32 text-center px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition duration-300 text-sm font-semibold"
                  >
                    Activate
                  </a>
                  <button
                    className="w-32 text-center px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition duration-300 text-sm font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

