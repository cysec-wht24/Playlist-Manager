import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

connect()

//db is another continent thus use async
// similarly make other  functions of Get, Delete, put
export async function POST(request: NextRequest) { // handles request : gets next request
    try {
        const reqBody = await request.json()
        //extract stuff through destructuring
        const {username, email, password} = reqBody

        console.log(reqBody); // not ideal for production grade

        //Check if user already exists 
        const user = await User.findOne({email}) // it will give you a query if you don't put await
        
        if(user) {
            return NextResponse.json({error: "User already exists"}, {status: 400})
        }

        //hash password
        //No. of rounds depend on framework, eg rubyOnRails uses 12 rounds, Nextjs, mongoose, Express use 10
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)

        //Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })

        //Save to DB -> one line await newUser.save()
        const savedUser = await newUser.save()
        console.log(savedUser);

        // Send verification email
        await sendEmail({email, emailType: "VERIFY", userId: savedUser._id})

        return NextResponse.json({
            message: "User created successfully",
            success: true,
            savedUser
        })
 



    } catch (error: any) {
        return NextResponse.json({error: error.message},
            {status: 500})
    }
}