import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { DeleteSchema } from "@/utils/validation";
import { z } from "zod";
import { loginCheck } from "@/utils/loginCheck";

// ゲームとランクの検索
export async function POST(req: NextRequest) {
    const { userId, id } = await req.json();
    
    try {
        // ログインしているかどうかの判定
        const isLogin = await loginCheck(req);

        if (!isLogin) {
            return NextResponse.json({message: "ログインしていません。", success: false, login: false}, {status: 401});
        }

        //API側バリデーションチェック
        const issue = DeleteSchema.safeParse({ userId, id });

        if (!issue.success) {
            const validation = z.flattenError(issue.error);
            const message = validation.fieldErrors;
            return NextResponse.json({ message: message, success: false }, { status: 400 });
        }

        if (id && userId) {
            await prisma.games.delete({
                where: { id: id, userId: userId }
            });
            return NextResponse.json({ message: "登録したゲームは正常に削除されました。", success: true }, { status: 200 });
        } else {
            return NextResponse.json({ message: "対象なし", success: false }, { status: 500 });
        }
    } catch (e) {
        return NextResponse.json({ message: "登録したゲームの削除は失敗しました。", e }, { status: 500 })
    }
}