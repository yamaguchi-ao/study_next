import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { GameUpdateSchema } from "@/utils/validation";
import { z } from "zod";

export async function POST(req: NextRequest) {
    const { rank, gameId } = await req.json();
    const JWT_SECRET = process.env.JWT_SECRET;

    try {
        // ログインしているかどうかの判定
        const token = req.cookies.get("auth_token")?.value;

        if (token === null || token === undefined) {
            return NextResponse.json({ message: "ログインしていない。", success: false }, { status: 500 });
        }

        const data = await jwt.verify(token!, JWT_SECRET!);

        if (!data) {
            return NextResponse.json({ message: "ログインしていません。", success: false }, { status: 404 });
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