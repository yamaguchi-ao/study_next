import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

// ゲームとランクの検索
export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const postIdParams = searchParams.get('postId');    

    try {
        if (searchParams.toString().includes("postId")) {
            const detailData = await getDetail(postIdParams!);
            return NextResponse.json({ message: "取得成功", success: true, data: detailData }, { status: 200 });
        } else {
            return NextResponse.json({ message: "パラメータが不正です。", success: false }, { status: 400 });
        }
    } catch (e) {
        return NextResponse.json({ message: "ゲームデータ 取得失敗...", e }, { status: 500 });
    }
}

//　詳細用検索
async function getDetail(postId: string) {

    const data = await prisma.comments.findUnique({
        where: { id: Number(postId) },
        select: {
            id: true,
            comment: true,
            user:{
                select: {
                    name: true
                }
            },
        }
    });

    return data;
}