import { NextResponse } from "next/server";


export async function GET() {
    try {
        const response = NextResponse.json(
            {
                message: "Logout Successful",
                success: true,
            }
        )
        response.cookies.set("token", "", {httpOnly: true, expires: new Date(0)}); // no need to specify expiration date as httpOnly does that only
        return response;
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}