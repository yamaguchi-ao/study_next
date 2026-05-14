import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getCookies } from "@/app/actions/action";

export async function POST(req: NextRequest) {
    const { title, post, game } = await req.json();
    
    const cookie = await getCookies();
    const userId = cookie!.id;

    try {

        await prisma.posts.create({
            data: {
                title: title,
                content: post.replace(/r?\n/g, "\n"),
                gameTag: game,
                userId: userId,
                rankFlg: false,
            }
        })

        return NextResponse.json({ message: "投稿 成功！", success: true }, { status: 200 });

    } catch (e) {
        return NextResponse.json({ message: "投稿 失敗...", e }, { status: 500 });
    }
}