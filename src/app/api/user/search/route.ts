import prisma from "@/lib/prisma";
import { loginCheck } from "@/utils/loginCheck";
import { NextRequest, NextResponse } from "next/server";

// ユーザー詳細
export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const userIdParams = searchParams.get('id') as number | null;

    try {
        // ログイン判定
        const isLogin = await loginCheck(req);
        

        if (!isLogin) {
            return NextResponse.json({ message: "ログインしていません。", success: false, login: false }, { status: 401 });
        }

        if (!userIdParams) {
            return NextResponse.json({ message: "ユーザーIDが指定されていません。", success: false }, { status: 400 });
        } else {
            const data = await getUserInfo(userIdParams);
            return NextResponse.json({ data, success: true }, { status: 200 })
        }

    } catch (e) {
        return NextResponse.json({ message: "ユーザー取得失敗...", e }, { status: 500 });
    }
}

async function getUserInfo(userId: number) {
    const data = await prisma.users.findUnique({
        where: { id: Number(userId) },
        select: {
            name: true,
            email: true,
            password: true,
        }
    });
    return data;
}