import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { loginCheck } from "@/utils/loginCheck";
import { getCookies } from "@/app/actions/action";

// ゲームとランクの検索
export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const postIdParams = searchParams.get('postId');
    const gameParams = searchParams.get('game');

    const cookies = await getCookies();

    if (cookies === null) {
        return NextResponse.json({ message: "ログインしていません。", success: false, login: false }, { status: 401 });
    }

    const userId = cookies.id;

    try {
        // ログインしているかどうかの判定
        const isLogin = await loginCheck(req);

        if (!isLogin) {
            return NextResponse.json({ message: "ログインしていません。", success: false, login: false }, { status: 401 });
        }

        if (searchParams.toString().includes("postId")) {
            let detailData = await getDetail(postIdParams!, gameParams!);

            const pressFlg = await prisma.pressedComments.findMany({
                where: { postId: Number(postIdParams), userId: Number(userId) },
            });
            detailData = detailData.map((comment) => {
                const pressedComment = pressFlg.find((press) => press.commentId === comment.id);
                return {
                    ...comment,
                    pressedFlg: pressedComment ? pressedComment.pressedFlg : false,
                    pressedType: pressedComment ? pressedComment.pressedType : false
                };
            }
            );
            return NextResponse.json({ message: "取得成功", success: true, data: detailData, login: isLogin }, { status: 200 });
        } else {
            return NextResponse.json({ message: "パラメータが不正です。", success: false, login: isLogin }, { status: 400 });
        }
    } catch (e) {
        return NextResponse.json({ message: "ゲームデータ 取得失敗...", e }, { status: 500 });
    }
}

//　投稿に記載されているコメント全検索
async function getDetail(postId: string, game: string) {

    const data = await prisma.comments.findMany({
        where: { postId: Number(postId) },
        select: {
            id: true,
            comment: true,
            createdAt: true,
            hiddenFlg: true,
            dispRankFlg: true,
            like: true,
            bad: true,
            user: {
                select: {
                    name: true,
                    id: true,
                    games: {
                        where: { name: game },
                        select: {
                            rank: true
                        },
                    }
                }
            },
        }
    });

    return data;
}