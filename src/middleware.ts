import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === '/login' || path === '/signup' || path === '/verifyemail' || path === '/';
  
// we have 2 variables now, if the path is public is public and user 
// has a token they should not be able to access that path
  const token = request.cookies.get('token')?.value || '';

   if(isPublicPath && token) {
    console.log('Redirecting to /profile'); // Debug log
    return NextResponse.redirect(new URL('/profile', request.nextUrl))
  }
  
  if(!isPublicPath && !token) {
    console.log('Redirecting to /login'); // Debug log
    return NextResponse.redirect(new URL('/login', request.nextUrl))
  }


  // console.log('No redirection needed, Allowing request to proceed'); // Debug log
  // return NextResponse.next();

}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [// instead of passing this as a string you can pass this as an array 
  '/',
  '/profile',
  '/login',
  '/signup',
  '/verifyemail'
  ] 
}