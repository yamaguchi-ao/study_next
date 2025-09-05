import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// 登録or更新
export async function POST(req: NextRequest) {
    const { name, rank, id } = await req.json();

    try {
        // ゲームタイトルの既存確認
        const existingGame = await prisma.games.findUnique({
            where: { name: name, id: id }
        });

        if (existingGame) {
            return NextResponse.json({ message: "そのゲームタイトルは既に登録されています。", success: false }, { status: 500 });
        }

        // ゲームとランクの登録
        await prisma.games.create({
            data: {
                userId: id,
                name: name,
                rank: rank
            }
        });

        return NextResponse.json({ message: "新規登録　成功！", success: true }, { status: 200 });

    } catch (e) {
        return NextResponse.json({ message: "ゲーム 登録失敗...", e }, { status: 500 });
    }
}

// ゲームとランクの集計
export async function GET(req: NextRequest) {
    const { name, rank } = await req.json();
    let data = null;
    try {

        if (name && !rank) {
            // ゲームのみを検索している場合
            data = await prisma.games.findMany({
                where: { name: name }
            });
        } else if (!name && rank) {
            // ランクのみを検索している場合
            data = await prisma.games.findMany({
                where: { rank: rank }
            });
        } else if (name && rank) {
            // 両方検索
            data = await prisma.games.findMany({
                where: { name: name, rank: rank }
            });
        } else {
            data = await prisma.games.findMany();
        }

        return NextResponse.json({ message: "検索成功", success: true, data: data }, { status: 200 });

    } catch (e) {

        return NextResponse.json({ message: "ゲームデータ 取得失敗...", e }, { status: 500 })
    }
}