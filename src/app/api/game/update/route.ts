import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
    const { rank, gameId } = await req.json();
    const JWT_SECRET = process.env.JWT_SECRET;

    try {
        // ログインしているかどうかの判定
        const token = req.cookies.get("auth_token")?.value;

        const data = jwt.verify(token!, JWT_SECRET!);

        if (!data) {
            return NextResponse.json({ message: "ログインしていません。", success: false }, { status: 404 });
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