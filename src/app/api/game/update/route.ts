import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { GameUpdateSchema } from "@/utils/validation";
import { z } from "zod";
import { loginCheck } from "@/utils/loginCheck";

export async function POST(req: NextRequest) {
    const { rank, gameId } = await req.json();

    try {
        // ログインしているかどうかの判定
        const isLogin = await loginCheck(req);

        if (!isLogin) {
            return NextResponse.json({message: "ログインしていません。", success: false, login: false}, {status: 401});
        }

        //API側バリデーションチェック
        const issue = GameUpdateSchema.safeParse({ rank, gameId });

        if (!issue.success) {
            const validation = z.flattenError(issue.error);
            const message = validation.fieldErrors;
            console.log("エラーメッセージ：", message);
            return NextResponse.json({ message: message, success: false }, { status: 400 });
        }

        // ゲームとランクの更新
        await prisma.games.update({
            where: { id: Number(gameId) },
            data: {
                rank: rank
            },
        });

        return NextResponse.json({ message: "ゲーム　更新成功！", success: true }, { status: 200 });

    } catch (e) {
        return NextResponse.json({ message: "ゲーム 更新失敗...", e }, { status: 500 });
    }
}