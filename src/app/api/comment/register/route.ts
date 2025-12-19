import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

// コメント追加API
export async function POST(req: NextRequest) {

    const { comment, postId, userId } = await req.json();

    console.log("取得対象：", comment, postId, userId);

    try {
        // ログインしているかどうかの判定
        const token = req.cookies.get("auth_token")?.value;
        const data = await jwt.verify(token!, JWT_SECRET!);

        if (!data) {
            return NextResponse.json({ message: "ログインしていません。", success: false }, { status: 500 });
        }

        // コメントの追加
        await prisma.comments.create({
            data: {
                comment: comment,
                postId: Number(postId),
                userId: Number(userId)
            }
        });

        return NextResponse.json({ message: "コメント 追加成功！", success: true }, { status: 200 });

    } catch (e) {
        return NextResponse.json({ message: "コメント 失敗...", e }, { status: 500 });
    }
}