import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req: NextRequest) {
    const { name, rank, gameId } = await req.json();

    try {
        // ログインしているかどうかの判定
        const token = req.cookies.get("auth_token")?.value;

        const data = jwt.verify(token!, JWT_SECRET!);

        if (!data) {
            return NextResponse.json({ message: "ログインしていません。", success: false }, { status: 404 });
        }

        // ゲームタイトルの既存確認
        const existingGame = await prisma.games.findUnique({
            where: { name: name },
            select: {
                id: true,
                name: true,
                rank: true
            }
        });

        if (existingGame) {
            return NextResponse.json({ message: "そのゲームタイトルは既に登録されています。", success: false }, { status: 500 });
        }

        // ゲームとランクの更新
        const test = await prisma.games.update({
            where: { id: Number(gameId) },
            data: {
                name: name,
                rank: rank
            },
        });

        console.log("処理来ているか", test);

        return NextResponse.json({ message: "ゲーム更新　成功！", success: true }, { status: 200 });

    } catch (e) {
        return NextResponse.json({ message: "ゲーム 更新失敗...", e }, { status: 500 });
    }
}