// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { Role } from '@/app/types/user';

// Role-based paths mapping
const rolePathMap = {
  [Role.ADMIN]: ['/admin', '/dashboard', '/transactions', '/documents'],
  [Role.FIELD_OFFICER]: ['/dashboard', '/transactions'],
  [Role.OFFICE_OFFICER]: ['/dashboard', '/documents'],
};

// Paths that are accessible without authentication
const publicPaths = ['/', '/login', '/api/auth'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path is public
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }
  
  // Get the user's token
  const token = await getToken({ req: request });
  
  // If there's no token, redirect to login
  if (!token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', encodeURI(request.url));
    return NextResponse.redirect(url);
  }
  
  // Get the paths accessible by the user's role
  const userRole = token.role as Role;
  const allowedPaths = rolePathMap[userRole] || [];
  
  // Check if the user is allowed to access the current path
  const isAllowed = allowedPaths.some(path => pathname.startsWith(path));
  
  if (!isAllowed) {
    // Redirect to dashboard if not allowed
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

// Configure matcher for paths that should be protected
export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes that don't need authentication (you'll need to customize this)
     * 2. /_next (Next.js internal routes)
     * 3. /_static (public files)
     * 4. /_vercel (Vercel internal routes)
     * 5. /favicon.ico, /robots.txt, /sitemap.xml (SEO files)
     */
    '/((?!api/auth|_next|_static|_vercel|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};