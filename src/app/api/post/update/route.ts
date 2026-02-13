import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PostSchema } from "@/utils/validation";
import z from "zod";

export async function POST(req: NextRequest) {
    const { title, post, id } = await req.json();
    const JWT_SECRET = process.env.JWT_SECRET;

    try {
        // トークンの取得
        const token = req.cookies.get("auth_token")?.value;

        // トークンのnullチェック
        if (token === null || token === undefined) {
            return NextResponse.json({ message: "ログインしていません", success: false }, { status: 500 });
        }

        // jwtの検証
        const data = await jwt.verify(token!, JWT_SECRET!);

        // jwt
        if (data === null || data === undefined) {
            return NextResponse.json({ message: "ログインしていません", success: false }, { status: 500 });
        }

        // API側のバリデーションチェック
        const issue = PostSchema.safeParse({ title, post, id });

        if (!issue.success) {
            const validation = z.flattenError(issue.error);
            const message = validation.fieldErrors ?? null ;
            return NextResponse.json({ message: message, success: false }, { status: 400 });
        }

        // 更新処理
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