import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ゲームとランクの集計
export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const gameParams = searchParams.get('game');
    const rankParams = searchParams.get('rank');

    let data = null;
    const dataList: { game: string; rank: string; }[] = [];

    try {

        if (gameParams && !rankParams) {
            // ゲームのみを検索している場合
            data = await prisma.games.findMany({
                where: { name: gameParams }
            });
        } else if (!gameParams && rankParams) {
            // ランクのみを検索している場合
            data = await prisma.games.findMany({
                where: { rank: rankParams }
            });
        } else if (gameParams && rankParams) {
            // 両方検索
            data = await prisma.games.findMany({
                where: { name: gameParams, rank: rankParams }
            });
        } else {
            data = await prisma.games.findMany();
        }

        // 取得したデータをMap化
        if (data.length !== 0) {
            for (let i = 0; i < data.length; i++) {
                const list = { game: "", rank: "" };

                list.game = data[i].name;
                list.rank = data[i].rank!;

                dataList.push(list);
            }

            return NextResponse.json({ message: "検索成功", success: true, data: dataList }, { status: 200 });
        } else {
            return NextResponse.json({ message: "検索結果なし", success: true }, { status: 200 });
        }

    } catch (e) {
        return NextResponse.json({ message: "ゲームデータ 取得失敗...", e }, { status: 500 })
    }
}