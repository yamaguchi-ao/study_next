import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import jwt from "jsonwebtoken";

// ゲームとランクの検索
export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const gameParams = searchParams.get('game');
    const postIdParams = searchParams.get('id');
    const JWT_SECRET = process.env.JWT_SECRET;

    try {
        // ログインしているかどうかの判定
        const token = req.cookies.get("auth_token")?.value;
        const data = await jwt.verify(token!, JWT_SECRET!);
        if (!data) {
            return NextResponse.json({ message: "ログインしていません。", success: false }, { status: 404 });
        }
        
        if (searchParams.toString().includes("id")) {
            const detailData = await getDetail(postIdParams!);
            return NextResponse.json({ message: "取得成功", success: true, data: detailData }, { status: 200 });
        } else {
            const listData = await getList(gameParams!);
            return NextResponse.json({ message: "検索成功", success: true, data: listData }, { status: 200 });
        }
    } catch (e) {
        return NextResponse.json({ message: "ゲームデータ 取得失敗...", e }, { status: 500 });
    }
}

// 一覧用検索
async function getList(gameParams: string) {
    const whereConditions: Prisma.PostsWhereInput = {};

    if (gameParams) {
        whereConditions.gameTag = { contains: gameParams };
    }

    const data = await prisma.posts.findMany({
        where: whereConditions,
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
            comments: true
        },
    });

    return data;
}

//　詳細用検索
async function getDetail(postId: string) {

    const gameTag = await prisma.posts.findUnique({
        where: { id: Number(postId) },
        select: { gameTag: true }
    });

    const data = await prisma.posts.findUnique({
        where: { id: Number(postId) },
        select: {
            id: true,
            title: true,
            content: true,
            gameTag: true,
            userId: true,
            user: {
                select: {
                    name: true,
                    games: {
                        where: {
                            name: gameTag?.gameTag || ""
                        },
                    }
                }
            }
        }
    });

    return data;
}