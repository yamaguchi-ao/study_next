
// Logout用API
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Logout呼び出しAPI
export async function POST() {
    const cookieStore = await cookies();

    if (cookieStore === null || cookieStore === undefined) {
        return NextResponse.json({ message: "cookieが取得できませんでした。", success: false }, { status: 400 });
    }

    const hasCookies = cookieStore.has("auth_token");

    if (hasCookies) {
        cookieStore.delete("auth_token");
        return NextResponse.json({ message: "ログアウトしました。", success: true }, { status: 200 });
    } else {
       return NextResponse.json({ message: "セッション切れでログアウトしました。", success: true }, { status: 200 });
    }
}