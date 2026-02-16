import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PostSchema } from "@/utils/validation";
import z from "zod";
import { loginCheck } from "@/utils/loginCheck";

export async function POST(req: NextRequest) {
    const { title, post, id } = await req.json();

    try {
        // ログインしているかの判定
        const isLogin = await loginCheck(req);

        if (!isLogin) {
            return NextResponse.json({message: "ログインしていません。", success: false, login: false}, {status: 401});
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