import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Force dynamic rendering for API routes
    if (request.nextUrl.pathname.startsWith('/api/')) {
        const response = NextResponse.next();
        response.headers.set('x-middleware-cache', 'no-cache');
        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/api/:path*',
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
} 