import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

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
            await prisma.posts.delete({
                where: { id: id }
            });
            return NextResponse.json({ message: "投稿は正常に削除されました。", success: true }, { status: 200 });
        } else {
            return NextResponse.json({ message: "対象なし", success: false }, { status: 500 });
        }

    } catch (e) {
        return NextResponse.json({ message: "投稿の削除は失敗しました。", e }, { status: 500 });
    }
}