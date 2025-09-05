import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const menus = {
    menubar: [
        '/post',
        '/game'
    ]
}

export default function middleware(req: NextRequest) {
    const authToken = req.cookies.get("auth_token")?.value;

    for (const menu of menus.menubar) {
        if (!authToken && req.nextUrl.pathname.startsWith(menu)) {
            const loginUrl = new URL('/login?error=true', req.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/post/:path*',
        '/game/:path*'
    ]
}