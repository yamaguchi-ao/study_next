import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { name, rank, id } = await req.json();

    try {
        // ログインしているかどうかの判定
        const hasCookies = req.cookies.has("auth_token");

        if (!hasCookies) {
            return NextResponse.json({ message: "ログインしていません。", success: false }, { status: 404 });
        }

        // ゲームタイトルの既存確認
        const existingGame = await prisma.games.findUnique({
            where: { userId: id, name: name }
        });

        if (existingGame) {
            return NextResponse.json({ message: "そのゲームタイトルは既に登録されています。", success: false }, { status: 500 });
        }

        // ゲームとランクの登録
        await prisma.games.create({
            data: {
                userId: id,
                name: name,
                rank: rank
            }
        });

        return NextResponse.json({ message: "新規登録　成功！", success: true }, { status: 200 });

    } catch (e) {
        return NextResponse.json({ message: "ゲーム 登録失敗...", e }, { status: 500 });
    }
}