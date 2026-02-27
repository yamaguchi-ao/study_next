import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { loginCheck } from "@/utils/loginCheck";

// ゲームとランクの検索
export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const postIdParams = searchParams.get('postId');
    const gameParams = searchParams.get('game');

    try {
        // ログインしているかどうかの判定
        const isLogin = await loginCheck(req);

        if (!isLogin) {
            return NextResponse.json({ message: "ログインしていません。", success: false, login: false }, { status: 401 });
        }

        if (searchParams.toString().includes("postId")) {
            const detailData = await getDetail(postIdParams!, gameParams!);
            return NextResponse.json({ message: "取得成功", success: true, data: detailData }, { status: 200 });
        } else {
            return NextResponse.json({ message: "パラメータが不正です。", success: false }, { status: 400 });
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