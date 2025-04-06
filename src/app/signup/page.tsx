"use client";
// https://nextjs.org/docs/app/building-your-application/rendering/client-components
import Link from "next/link";
import React from "react";
import {useRouter} from "next/navigation";
import {axios} from "axios";
// ts requires type defination since axios 
// type are not defined you have to explicitly install them


export default function Page() {

  const [user, setUser] = React.useState({
    email: "",
    password: "",
    username: ""
  })
  
  const onSignUp = async () => {

  } 

    return (
    <h1 className="text-3xl font-bold 
    underline flex flex-col items-center justify-center min-h-screen py-2"> SignUp </h1>
  )}