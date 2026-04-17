import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { gameNameFixed } from "@/constants/context";
import { GameSchema } from "@/utils/validation";
import z from "zod";
import { loginCheck } from "@/utils/loginCheck";
import { getCookies } from "@/app/actions/action";

export async function POST(req: NextRequest) {
    const { name, rank } = await req.json();

    const cookies = await getCookies();

    if (cookies === null) {
        return NextResponse.json({ message: "ログインしていません。", success: false, login: false }, { status: 401 });
    }

    const userId = cookies.id;

    let game: string | undefined = undefined;

    try {
        // ログインしているかどうかの判定
        const isLogin = await loginCheck(req);

        if (!isLogin) {
            return NextResponse.json({ message: "ログインしていません。", success: false, login: false }, { status: 401 });
        }

        const issue = GameSchema.safeParse({ name, rank, userId });

        if (!issue.success) {
            const validation = z.flattenError(issue.error);
            const message = validation.fieldErrors ?? null;
            return NextResponse.json({ message: message }, { status: 400 });
        }

        // ゲームタイトルの名称修正
        game = gameNameFixed(name);

        // ゲームタイトルの既存確認
        const existingGame = await prisma.games.findMany({
            where: { userId: userId, AND: { name: game } }
        });

        if (existingGame.length > 0) {
            return NextResponse.json({ message: "そのゲームタイトルは既に登録されています。", success: false, login: isLogin }, { status: 500 });
        }

        // ゲームとランクの登録
        await prisma.games.create({
            data: {
                userId: userId,
                name: game as string,
                rank: rank
            }
        });

        return NextResponse.json({ message: "新規登録　成功！", success: true }, { status: 200 });

    } catch (e) {
        return NextResponse.json({ message: "ゲーム 登録失敗...", e }, { status: 500 });
    }
}