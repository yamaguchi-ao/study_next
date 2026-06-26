"use server"

import { getCookies } from "@/app/actions/action";
import { commonErrorMessage } from "../validation";
import prisma from "@/lib/prisma";

interface distributionProp {
    name: string
}

// 分布取得
export async function getDistribution() {
    // jwt認証でユーザーIDを取得する
    const userId = await commonCheck();

    // ログインしているか
    if (!userId) {
        return { message: commonErrorMessage.login, success: false, login: false };
    }

    try {
        // 現在登録されているゲームタイトルをすべて取得
        const totalGame = await prisma.games.findMany({
            select: {
                name: true,
            },
            distinct: ["name"]
        });

        if (!totalGame) {
            return { message: "現在登録されているゲームタイトルはありません。", success: false, login: true };
        }

        // 取得したゲームタイトルに対して、ユーザー数をカウント
        const games = await Promise.all(
            totalGame.map(async (game) => ({
                ...game,
                userCount: await prisma.games.groupBy({
                    by: ["name"],
                    _count: true,
                    where: { name: game.name }
                }).then(result => result[0] ? result[0]._count : 0),
                hasGame: await prisma.games.groupBy({
                    by: ["userId"],
                    where: { name: game.name, userId: userId }
                }).then(result => result.length > 0) ? true : false
            }))
        );

        if (!games) {
            return { message: "登録されたゲームに対してユーザーがいません。", success: false, login: true };
        }

        return { success: true, data: games, login: true };
    } catch (e) {
        console.log("エラー内容", e);
        return { message: "分布の取得に失敗しました。", success: false, login: true };
    }
}

// ゲームの分布詳細
export async function getDetailDistribution({ ...data }: distributionProp) {
    // jwt認証でユーザーIDを取得する
    const userId = await commonCheck();

    // ログインしているか
    if (!userId) {
        return { message: commonErrorMessage.login, success: false, login: false };
    }

    // ゲームタイトルの空白をデコード
    data.name = decodeURIComponent(data.name);

    try {
        // 取得したゲームタイトルに対して、ランクを取得
        const detail = await prisma.games.findMany({
            where: { name: data.name },
            select: {
                name: true,
                rank: true,
                user: {
                    select: {
                        id: true
                    }
                }
            },
        });

        if (!detail) {
            return { message: "分布の詳細が見つかりません。", success: false, login: true };
        }

        return { success: true, game: data.name, data: detail, login: true }

    } catch (e) {
        console.log("エラー内容", e);
        return { message: "分布の詳細の取得に失敗しました。", success: false, login: true };
    }
}

// 共通チェック
async function commonCheck() {
    const cookie = await getCookies();
    if (!cookie) {
        return null;
    } else {
        return cookie.id
    }
}