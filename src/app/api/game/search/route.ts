import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { loginCheck } from "@/utils/loginCheck";
import { getCookies } from "@/app/actions/action";

// ゲームとランクの検索
export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const gameParams = searchParams.get('game');
    const rankParams = searchParams.get('rank');
    const gameIdParams = searchParams.get('id');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 10;

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

        if (searchParams.toString().includes("id")) {
            const detailData = await getDetail(gameIdParams!, userId);
            return NextResponse.json({ message: "取得成功", success: true, data: detailData }, { status: 200 });
        } else {
            const offset = (page - 1) * limit;
            const listData = await getList(gameParams!, rankParams!, userId, offset, limit);
            const totalData = await getTotalPage(gameParams!, rankParams!, userId);
            const totalPage = Math.ceil(totalData / limit);

            return NextResponse.json({ message: "検索成功", success: true, data: listData, totalPage: totalPage, currentPage: page }, { status: 200 });
        }
    } catch (e) {
        return NextResponse.json({ message: "ゲームデータ 取得失敗...", e }, { status: 500 });
    }
}

// 一覧用検索
async function getList(gameParams: string, rankParams: string, userId: number, offset?: number, take?: number) {
    const whereConditions: Prisma.GamesWhereInput = {};
    whereConditions.userId = { equals: Number(userId) };

    if (gameParams) {
        whereConditions.name = { contains: gameParams };
    }

    if (rankParams) {
        whereConditions.rank = { contains: rankParams };
    }

    const data = await prisma.games.findMany({
        where: whereConditions,
        skip: offset,
        take: take,
        select: {
            id: true,
            name: true,
            rank: true
        },
    });

    return data;
}

// 合計ページ数を取得
async function getTotalPage(gameParams: string, rankParams: string, userId: number) {
    const whereConditions: Prisma.GamesWhereInput = {};
    whereConditions.userId = { equals: Number(userId) };

    if (gameParams) {
        whereConditions.name = { contains: gameParams };
    }

    if (rankParams) {
        whereConditions.rank = { contains: rankParams };
    }

    const totalData = await prisma.games.count({ where: whereConditions });
    return totalData;
}

//　詳細用検索
async function getDetail(gameId: string, userId: number) {

    const data = await prisma.games.findUnique({
        where: { id: Number(gameId), userId: Number(userId) },
        select: {
            id: true,
            name: true,
            rank: true
        }
    });

    return data;
}