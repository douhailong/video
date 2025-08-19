import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

const protectedRoute = ['/studio(.*)', '/playlist(.*)', '/feed(.*)', '/setting(.*)'];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoute.some((route) => {
    return RegExp(route).test(pathname);
  });

  if (isProtectedRoute) {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)'
  ]
};
