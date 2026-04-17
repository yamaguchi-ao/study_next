import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { loginCheck } from "@/utils/loginCheck";
import { getCookies } from "@/app/actions/action";

// ゲームとランクの検索
export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const gameParams = searchParams.get('game');
    const postIdParams = searchParams.get('id');
    const gameTagParams = searchParams.get('gameTag');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 9;

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

        if (searchParams.toString().includes("id") && searchParams.toString().includes("gameTag")) {
            // 詳細用
            let detailData = await getDetail(Number(userId), postIdParams!, gameTagParams!);

            return NextResponse.json({ message: "取得成功", success: true, data: detailData }, { status: 200 });
        } else if (searchParams.toString().includes("id") && !searchParams.toString().includes("gameTag")) {
            // 更新用
            const updateData = await getUpdate(postIdParams!, userId);
            return NextResponse.json({ message: "取得成功", success: true, data: updateData }, { status: 200 });
        } else {
            // 一覧用
            const offset = (page - 1) * limit;
            const listData = await getList(gameParams!, offset, limit);
            const totalData = await prisma.posts.count({ where: gameParams ? { gameTag: { contains: gameParams } } : {} });
            const totalPage = Math.ceil(totalData / limit);

            return NextResponse.json({ message: "検索成功", success: true, data: listData, totalPage: totalPage, currentPage: page }, { status: 200 });
        }
    } catch (e) {
        return NextResponse.json({ message: "ゲームデータ 取得失敗...", e }, { status: 500 });
    }
}

// 一覧用検索
async function getList(gameParams: string, offset?: number, take?: number) {
    const whereConditions: Prisma.PostsWhereInput = {};

    if (gameParams) {
        whereConditions.gameTag = { contains: gameParams };
    }

    const data = await prisma.posts.findMany({
        where: whereConditions,
        skip: offset,
        take: take,
        select: {
            id: true,
            title: true,
            gameTag: true,
            userId: true,
            user: {
                select: {
                    name: true,
                }
            },
            comments: true,
            like: true,
        },
    });

    return data;
}

//　詳細用検索
async function getDetail(userId: number, postId: string, gameTag: string) {

    const data = await prisma.posts.findUnique({
        where: { id: Number(postId) },
        select: {
            id: true,
            title: true,
            content: true,
            gameTag: true,
            userId: true,
            createdAt: true,
            updatedAt: true,
            rankFlg: true,
            like: true,
            pressedPosts: {
                where: { postId: Number(postId), userId: Number(userId) },
                select: { pressFlg: true }
            },
            user: {
                select: {
                    name: true,
                    games: {
                        where: { name: gameTag },
                        select: {
                            rank: true
                        },
                    }
                }
            }
        }
    });

    return data;
}

//　更新用検索
async function getUpdate(postId: string, userId: number) {

    const data = await prisma.posts.findUnique({
        where: { id: Number(postId), userId: Number(userId) },
        select: {
            id: true,
            title: true,
            content: true,
            gameTag: true,
        }
    });

    return data;
}