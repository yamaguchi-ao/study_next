import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
    const { name, rank, id } = await req.json();
    const JWT_SECRET = process.env.JWT_SECRET;

    try {
        // ログインしているかどうかの判定
        const token = req.cookies.get("auth_token")?.value;

        const data = await jwt.verify(token!, JWT_SECRET!);

        if (!data) {
            return NextResponse.json({ message: "ログインしていません。", success: false }, { status: 404 });
        }

        // ゲームタイトルの既存確認
        const existingGame = await prisma.games.findMany({
            where: { userId: id, AND: { name: name } }
        });

        if (existingGame.length > 0) {
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
        console.log("error", e);
        return NextResponse.json({ message: "ゲーム 登録失敗...", e }, { status: 500 });
    }
}