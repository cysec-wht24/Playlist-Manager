//     const [data, setData] = useState("nothing")


//     const getUserDetails = async () => {
//         try {
//             const res = await axios.get('/api/users/me', {
//                 withCredentials: true
//             });
//             console.log(res.data);
//             setData(res.data.data._id);
//         } catch (err: any) {
//             console.error(err.response?.data || err.message);
//             toast.error(err.response?.data?.message || "Something went wrong");
//         }
//     };
    
//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen py-2">
//             <h1>Profile</h1>
//             <hr />
//             <p>Profile page</p>
//             <h2 className="p-1 rounded bg-green-500">
//                 {data === 'nothing' ? "Nothing" : <Link href={`/profile/${data}`}>{data}</Link>}
//             </h2>


//             <button onClick={getUserDetails} className="bg-green-800 mt-4 
//             hover:bg-blue-700 text-white font-bold 
//             py-2 px-4 rounded">Get User Details</button>

//         </div>
//     )
// }

"use client";
import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../../components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "../../../lib/utils";
import {useRouter} from "next/navigation";
import axios from "axios";
import {toast} from "react-hot-toast";

//optional, maybe should be in route.ts of profile
function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export default function SidebarDemo() {
  const router = useRouter()

  useEffect(() => {
    const token = getCookie("token");
    if (!token) {
      router.push("/login");
    }
  }, []);
  

  const logout = async () => {
    try {
      console.log("Calling logout API..."); // Debug log
      const response = await axios.get('/api/users/logout'); // Call the logout API
      console.log("Logout API response:", response.data); // Debug log
  
      if (response.data.success) {
        toast.success(response.data.message); // Display the success message from the API
        router.push('/login'); // Redirect to the login page
      } else {
        toast.error('Logout failed'); // Handle unexpected cases
      }
    } catch (error: any) {
      console.error("Logout error:", error.message); // Debug log
      toast.error('An error occurred while logging out'); // Display error message
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
    <div
      className={cn(
        "mx-auto flex w-full flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
        "h-screen", // for your use case, use `h-screen` instead of `h-[60vh]`
      )}
    >
      <Sidebar open={open} setOpen={setOpen} animate={false}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            <>
              <Logo />
            </>
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
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white"
      >
        PlayStar
      </motion.span>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
    </Link>
  );
};

// Dummy dashboard component with content
const Dashboard = () => {
  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
        
      

      </div>
    </div>
  );
};
