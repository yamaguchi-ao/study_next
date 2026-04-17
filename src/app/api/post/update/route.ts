import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { PostSchema } from "@/utils/validation";
import z from "zod";
import { loginCheck } from "@/utils/loginCheck";
import { getCookies } from "@/app/actions/action";

export async function POST(req: NextRequest) {
    const { title, post, id, likeCount } = await req.json();

    const cookies = await getCookies();
    const userId = cookies!.id;

    try {
        // ログインしているかの判定
        const isLogin = await loginCheck(req);

        if (!isLogin) {
            return NextResponse.json({ message: "ログインしていません。", success: false, login: false }, { status: 401 });
        }

        // 更新処理の分岐
        if (likeCount === null || likeCount === undefined) {
            // 投稿自体の更新
            await dataUpdate(title, post, id);
        } else {
            // 押下されているかの確認
            const pressedPost = await prisma.pressedPosts.findFirst({
                where: { postId: Number(id), userId: Number(userId) },
            });

            if (!pressedPost) {
                // 評価の更新
                await likeUpdate(id, likeCount);

                // 評価をしていない場合は新規作成
                await prisma.pressedPosts.create({
                    data: {
                        postId: Number(id),
                        userId: Number(userId),
                        pressFlg: true
                    }
                });

            } else {
                if (pressedPost.pressFlg === false) {
                    //　評価の更新
                    await likeUpdate(id, likeCount);

                    // 評価履歴の更新
                    await prisma.pressedPosts.update({
                        where: { id: pressedPost.id },
                        data: { pressFlg: true }
                    });
                    
                } else {
                    return NextResponse.json({ message: "既に評価しています。", success: false, login: true }, { status: 400 });
                }
            }
        }

        return NextResponse.json({ message: "更新成功！", success: true, login: true }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ message: "投稿 更新失敗...", e }, { status: 500 });
    }
}

async function dataUpdate(title: string, post: string, id: number) {
    // API側のバリデーションチェック
    const issue = PostSchema.safeParse({ title, post, id });

    if (!issue.success) {
        const validation = z.flattenError(issue.error);
        const message = validation.fieldErrors ?? null;
        return NextResponse.json({ message: message, success: false }, { status: 400 });
    }

    try {
        // 更新処理
        await prisma.posts.update({
            where: { id: Number(id) },
            data: {
                title: title,
                content: post
            }
        });
        return NextResponse.json({ message: "投稿 更新成功！", success: true, login: true }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ message: "投稿 更新失敗...", e }, { status: 500 });
    }
}

async function likeUpdate(id: number, likeCount: number) {
    try {

        await prisma.posts.update({
            where: { id: Number(id) },
            data: {
                like: likeCount
            }
        });

        return NextResponse.json({ message: "いいねの更新成功！", success: true, login: true }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ message: "いいねの更新に失敗...", e }, { status: 500 });
    }
}