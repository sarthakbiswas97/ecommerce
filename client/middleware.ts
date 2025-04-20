import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('auth-storage');
  let isAuthenticated = false;

  try {
    if (authCookie?.value) {
      const authState = JSON.parse(authCookie.value);
      isAuthenticated = authState.state.isAuthenticated;
    }
  } catch (error) {
    console.error('Error parsing auth cookie:', error);
  }

  // If authenticated user tries to access auth pages
  const authRoutes = ['/signin', '/signup'];
  const isAuthRoute = authRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/products', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/signin', '/signup'],
}; 