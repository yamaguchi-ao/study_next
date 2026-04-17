import { getCookies } from "@/app/actions/action";
import prisma from "@/lib/prisma";
import { loginCheck } from "@/utils/loginCheck";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { postId, commentId, count, type } = await req.json();

    const cookie = await getCookies();

    if (cookie === null || cookie === undefined) {
        return NextResponse.json({ message: "ログインしていません。", success: false, login: false }, { status: 401 });
    }

    const userId = cookie.id;

    try {
        const isLogin = await loginCheck(req);

        if (!isLogin) {
            return NextResponse.json({ message: "ログインしていません。", success: false, login: false }, { status: 401 });
        }

        // 評価の更新
        const pressedComment = await prisma.pressedComments.findFirst({
            where: { commentId: Number(commentId), postId: Number(postId), userId: Number(userId) },
        });

        if (!pressedComment) {

            await prisma.comments.update({
                where: { id: Number(commentId) },
                data: type === "like" ? { like: count } : { bad: count }
            });

            await prisma.pressedComments.create({
                data: {
                    commentId: Number(commentId),
                    postId: Number(postId),
                    userId: Number(userId),
                    pressedType: type,
                    pressedFlg: true
                }
            });
        } else {
            if (pressedComment.pressedFlg === false) {

                await prisma.comments.update({
                    where: { id: Number(commentId) },
                    data: type === "like" ? { like: count } : { bad: count }
                });

                await prisma.pressedComments.update({
                    where: { id: pressedComment.id },
                    data: { pressedFlg: true }
                });

            } else {
                return NextResponse.json({ message: "既に評価しています。", success: false, login: isLogin }, { status: 400 });
            }
        }
        return NextResponse.json({ message: "コメント評価の更新 成功！", success: true, login: isLogin }, { status: 200 });
    } catch (e) {
        console.error("エラー内容：", e);
        return NextResponse.json({ message: "コメント評価の更新 失敗...", e }, { status: 500 });
    }
}