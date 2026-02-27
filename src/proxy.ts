import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;

export const menus = {
    menubar: [
        '/post',
        '/game',
    ]
}

export default async function proxy(req: NextRequest) {
    const authToken = req.cookies.get("auth_token")?.value;
    const loginUrl = new URL('/login?error=true', req.url);

    if (authToken === undefined) {
    } else {
        try {
            // jwtの署名の検証
            const encode = new TextEncoder().encode(JWT_SECRET);
            await jwtVerify(authToken, encode);
        } catch (error) {
            console.log("エラー内容確認", error);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}


export const config = {
    matcher: [
        '/post/:path*',
        '/game/:path*',
        '/user/:path*',
        '/((?!api|_next/static|_next/image|.*\\.png$).*)',
    ]
}