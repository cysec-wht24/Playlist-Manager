import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect()

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const {email, password} = reqBody
        console.log(reqBody);

         //Check if user exists 
         const user = await User.findOne({email})
         if(!user) {
             return NextResponse.json({error: "User does not exists"}, {status: 400})
         }

         // Check if password correct
         const validPassword = await bcryptjs.compare(password, user.password)
         if(!validPassword) {
            return NextResponse.json({error: "Invalid password"}, {status:400})
         }

         //Create Token data
         const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email
         }

         //Create a token
         const token = await jwt.sign(tokenData, process.env.SECRET_TOKEN!, {expiresIn: "1d"})
         const response = NextResponse.json({
            message: "Login successful",
            success: true,
         })

         response.cookies.set("token", token, {httpOnly: true,})
         return response;



    } catch (error:any) {
        return NextResponse.json({error: error.message},
            {status: 500})
    }
}