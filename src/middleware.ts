import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasSession = req.cookies.has("ss_token");

  if (pathname === "/admin/login") {
    return hasSession ? NextResponse.redirect(new URL("/admin", req.url)) : NextResponse.next();
  }
  if (!hasSession) {
    const url = new URL("/admin/login", req.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
