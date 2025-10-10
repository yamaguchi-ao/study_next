import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
    const { title, post, gameTag, id } = await req.json();
    const JWT_SECRET = process.env.JWT_SECRET;

    try {
        // ログインできているかの確認
        const token = req.cookies.get("auth_token")?.value;

        const data = await jwt.verify(token!, JWT_SECRET!);

        if (!data) {
            return NextResponse.json({ message: "ログインしていません", success: false }, { status: 500 });
        }

        await prisma.posts.create({
            data: {
                title: title,
                content: post,
                gameTag: gameTag,
                userId: id,
            }
        })

        return NextResponse.json({ message: "投稿 成功！", success: true }, { status: 200 });

    } catch (e) {
        return NextResponse.json({ message: "投稿 失敗...", e }, { status: 500 });
    }
}