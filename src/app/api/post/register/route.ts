import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { loginCheck } from "@/utils/loginCheck";

export async function POST(req: NextRequest) {
    const { title, post, game, id } = await req.json();

    try {
        // ログインできているかの確認
        const isLogin = await loginCheck(req);

        if (!isLogin) {
            return NextResponse.json({message: "ログインしていません。", success: false, login: false}, {status: 401});
        }

        await prisma.posts.create({
            data: {
                title: title,
                content: post.replace(/r?\n/g, "\n"),
                gameTag: game,
                userId: id,
                rankFlg: false,
            }
        })

        return NextResponse.json({ message: "投稿 成功！", success: true }, { status: 200 });

    } catch (e) {
        return NextResponse.json({ message: "投稿 失敗...", e }, { status: 500 });
    }
}