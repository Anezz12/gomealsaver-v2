import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const session = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Jika user sudah login dan mencoba akses register atau login
  if (session) {
    if (
      request.nextUrl.pathname === '/register' ||
      request.nextUrl.pathname === '/login' ||
      request
    ) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Lanjutkan dengan permintaan normal
  return NextResponse.next();
}

// Konfigurasi jalur yang perlu di-cek oleh middleware
export const config = {
  matcher: ['/register', '/login', '/dashboard-seller/:path*'],
};
