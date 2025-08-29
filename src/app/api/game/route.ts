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
        const game = await prisma.games.create({
            data: {
                userId: id,
                name: name,
                rank: rank
            }
        });

        return NextResponse.json({ message: "新規登録　成功！", success: true, game }, { status: 200 });

    } catch (e) {
        return NextResponse.json({ message: "ゲーム 登録失敗...", e }, { status: 500 });
    }
}

// ゲームとランクの集計
export async function GET(req: NextRequest) {
    const { name, rank } = await req.json();

    try {

        if (name && !rank) {
            // ゲームのみを検索している場合
        } else if (!name && rank) {
            // ランクのみを検索している場合
        } else {
            // 両方検索
        }


    } catch (e) {

        return NextResponse.json({ message: "ゲームデータ 取得失敗...", e }, { status: 500 })
    }
}