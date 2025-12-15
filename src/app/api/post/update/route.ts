import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
    const { title, post, id } = await req.json();
    const JWT_SECRET = process.env.JWT_SECRET;

    try {
        // ログインできているかの確認
        const token = req.cookies.get("auth_token")?.value;

        console.log("取得されるべき対象：" ,[token!, JWT_SECRET!]);
        
        const data = await jwt.verify(token!, JWT_SECRET!);

        if (!data) {
            return NextResponse.json({ message: "ログインしていません", success: false }, { status: 500 });
        }

        await prisma.posts.update({
            where: { id: Number(id) },
            data: {
                title: title,
                content: post
            }
        })

        return NextResponse.json({ message: "投稿 更新成功！", success: true }, { status: 200 });

    } catch (e) {
        return NextResponse.json({ message: "投稿 更新失敗...", e }, { status: 500 });
    }
}