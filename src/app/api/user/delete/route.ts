import { getCookies } from "@/app/actions/action";
import prisma from "@/lib/prisma";
import { loginCheck } from "@/utils/loginCheck";
import { DeleteSchema } from "@/utils/validation";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

// ユーザー削除
export async function POST(req: NextRequest) {

    const cookie = await getCookies();

    if (cookie === null || cookie === undefined) {
        return NextResponse.json({ message: "ログインしていません。", success: false, login: false }, { status: 401 });
    }

    const userId = cookie.id;
    const { id } = await req.json();

    try {
        // ログイン判定
        const isLogin = await loginCheck(req);

        if (!isLogin) {
            return NextResponse.json({ message: "ログインしていません。", success: false, login: false }, { status: 401 });
        }

        //　API側のバリデーションチェック
        const issue = DeleteSchema.safeParse({ userId, id });

        if (!issue.success) {
            const validation = z.flattenError(issue.error);
            const message = validation.fieldErrors ?? null;
            return NextResponse.json({ message: message, success: false }, { status: 400 });
        }

        if (Number(userId) !== Number(id)) {
            return NextResponse.json({ message: "権限がありません。", success: false }, { status: 403 });
        };

        // ユーザー削除
        await prisma.users.delete({
            where: { id: Number(id) }
        });

        return NextResponse.json({ message: "ユーザーを削除しました。", success: true }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ message: "ユーザー削除 失敗...", e }, { status: 500 })
    }
}