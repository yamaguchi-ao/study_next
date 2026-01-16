import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

// ゲームとランクの検索
export async function POST(req: NextRequest) {
    const { id } = await req.json();

    const JWT_SECRET = process.env.JWT_SECRET;

    try {
        // ログインしているかどうかの判定
        const token = req.cookies.get("auth_token")?.value;

        const data = await jwt.verify(token!, JWT_SECRET!);

        if (!data) {
            return NextResponse.json({ message: "ログインしていない。", success: false }, { status: 500 });
        }

        if (id) {
            await prisma.games.delete({
                where: { id: id }
            });
            return NextResponse.json({ message: "登録したゲームは正常に削除されました。", success: true }, { status: 200 });
        } else {
            return NextResponse.json({ message: "対象なし", success: false }, { status: 500 });
        }
    } catch (e) {
        return NextResponse.json({ message: "登録したゲームの削除は失敗しました。", e }, { status: 500 })
    }
}