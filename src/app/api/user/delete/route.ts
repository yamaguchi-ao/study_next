import prisma from "@/lib/prisma";
import { loginCheck } from "@/utils/loginCheck";
import { DeleteSchema, UserSchema } from "@/utils/validation";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

// ユーザー削除
export async function POST(req: NextRequest) {
    const { userId } = await req.json();

    try {
        // ログイン判定
        const isLogin = await loginCheck(req);

        if (!isLogin) {
            return NextResponse.json({ message: "ログインしていません。", success: false, login: false }, { status: 401 });
        }

        //　API側のバリデーションチェック
        const issue = DeleteSchema.safeParse({ userId });

        if (!issue.success) {
            const validation = z.flattenError(issue.error);
            const message = validation.fieldErrors ?? null;
            return NextResponse.json({ message: message, success: false }, { status: 400 });
        }

        // ユーザー削除
        await prisma.users.delete({
            where: { id: Number(userId) }
        });

        return NextResponse.json({ message: "ユーザーを削除しました。", success: true }, { status: 200 });

    } catch (e) {
        return NextResponse.json({ message: "ユーザー削除 失敗...", e }, { status: 500 })
    }
}