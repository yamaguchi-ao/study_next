import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;

export default async function proxy(req: NextRequest) {
    const authToken = req.cookies.get("auth_token")?.value;
    const loginUrl = new URL('/login?error=true', req.url);
    const postUrl = new URL('/post', req.url);

    if (authToken === undefined) {
        if (!req.nextUrl.pathname.includes("/login")) {
            return NextResponse.redirect(loginUrl);
        }
    } else {
        try {
            // jwtの署名の検証
            const encode = new TextEncoder().encode(JWT_SECRET);
            await jwtVerify(authToken, encode);

            // ログインしているのにログイン画面に遷移している場合
            if (req.nextUrl.pathname.includes("/login")) {
                // 投稿画面に自動的に遷移させる
                return NextResponse.redirect(postUrl);
            }
        } catch (error) {
            console.log("エラー内容：", error);
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