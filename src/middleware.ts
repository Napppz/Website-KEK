import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken, decode } from "next-auth/jwt";

const DEFAULT_AUTH_SECRET = "kek-indonesia-secret-jwt-key-2026-development";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Proteksi rute admin
  if (pathname.startsWith("/admin")) {
    const secret = process.env.AUTH_SECRET || DEFAULT_AUTH_SECRET;

    // 1. Coba decode langsung token sesi Auth.js v5 (authjs.session-token)
    const cookieNames = [
      "authjs.session-token",
      "__Secure-authjs.session-token",
      "next-auth.session-token",
      "__Secure-next-auth.session-token",
    ];

    let sessionToken = null;

    for (const name of cookieNames) {
      const cookie = req.cookies.get(name);
      if (cookie?.value) {
        try {
          const decoded = await decode({
            token: cookie.value,
            secret,
            salt: name,
          });
          if (decoded) {
            sessionToken = decoded;
            break;
          }
        } catch {
          // Lanjut ke pemeriksaan cookie berikutnya
        }
      }
    }

    // 2. Fallback ke getToken standar
    if (!sessionToken) {
      sessionToken = await getToken({
        req,
        secret,
      });
    }

    if (!sessionToken) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

