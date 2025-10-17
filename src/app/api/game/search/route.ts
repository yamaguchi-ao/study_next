import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

// ゲームとランクの検索
export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const gameParams = searchParams.get('game');
    const rankParams = searchParams.get('rank');
    const gameIdParams = searchParams.get('id');

    try {
        if (searchParams.toString().includes("id")) {
            const test = await getDetail(gameIdParams!);
            return NextResponse.json({ message: "取得成功", success: true, data: test }, { status: 200 });
        } else {
            const test = await getList(gameParams!, rankParams!);
            return NextResponse.json({ message: "検索成功", success: true, data: test }, { status: 200 });
        }
    } catch (e) {
        return NextResponse.json({ message: "ゲームデータ 取得失敗...", e }, { status: 500 });
    }
}

// 一覧用検索
async function getList(gameParams: string, rankParams: string) {
    const whereConditions: Prisma.GamesWhereInput = {};

    if (gameParams) {
        whereConditions.name = { contains: gameParams };
    }

    if (rankParams) {
        whereConditions.rank = { contains: rankParams };
    }

    const data = await prisma.games.findMany({
        where: whereConditions,
        select: {
            id: true,
            name: true,
            rank: true
        },
    });
    
    return data;
}

//　詳細用検索
async function getDetail(gameId: string) {

    const data = await prisma.games.findUnique({
        where: { id: Number(gameId) },
        select: {
            id: true,
            name: true,
            rank: true
        }
    });

    return data;
}