/**
 * ゲーム用API 
 */

"use server"

import { getCookies } from "@/app/actions/action";
import { commonErrorMessage, DeleteSchema, GameSchema, GameUpdateSchema } from "../validation";
import z from "zod";
import prisma from "@/lib/prisma";
import { gameNameFixed } from "@/constants/context";
import { Prisma } from "@prisma/client";
import { imageUpload, imageRemove } from "@/utils/imgUpload";

interface gamesProp {
    id?: number,
    name?: string,
    game?: string,
    rank?: string,
    page?: number,
    file?: File | null
}

export async function Register({ name, rank, file }: gamesProp) {

    const userId = await commonCheck();

    if (!userId) {
        return { message: commonErrorMessage.login, success: false, login: false };
    }

    let game: string | undefined = undefined;

    try {

        const issue = GameSchema.safeParse({ name, rank, file });

        if (!issue.success) {
            const validation = z.flattenError(issue.error);
            const message = validation.fieldErrors;
            console.log("エラーメッセージ：", [message.name, message.rank, message.file]);
            return { message: message ? commonErrorMessage.valid : null, success: false };
        }

        // ゲームタイトルの名称修正
        game = gameNameFixed(name!);

        // ゲームタイトルの既存確認
        const existingGame = await prisma.games.findMany({
            where: { userId: userId!, AND: { name: game } }
        });

        if (existingGame.length > 0) {
            return { message: "そのゲームタイトルは既に登録されています。", success: false, login: true };
        }

        // 画像のアップロード
        if (file) {
            const filePath = await imageUpload(userId!, file, "rank");

            if (!filePath) {
                return { message: "画像のアップロードに失敗しました。", success: false, login: true };
            }

            // ゲームとランクの登録
            await prisma.games.create({
                data: {
                    userId: userId!,
                    name: game as string,
                    rank: rank,
                    filePath: filePath
                }
            });
        } else {
            // ゲームとランクの登録
            await prisma.games.create({
                data: {
                    userId: userId!,
                    name: game as string,
                    rank: rank,
                }
            });
        }

        return { message: "新規登録 成功！", success: true };

    } catch (e) {
        console.log("エラー内容：", e);
        return { message: "ゲーム 登録失敗...", success: false };
    }
}

export async function listSearch({ game, rank, page }: gamesProp) {
    const userId = await commonCheck();

    if (!userId) {
        return { message: commonErrorMessage.login, success: false, login: false };
    }

    // 表示上限
    const limit = 10;
    // ページ数
    const offset = (page! - 1) * limit;

    try {
        // 検索内容
        const whereConditions: Prisma.GamesWhereInput = {};
        whereConditions.userId = { equals: Number(userId) };

        // ゲームタイトル
        if (game) {
            whereConditions.name = { contains: game };
        }

        // ランク
        if (rank) {
            whereConditions.rank = { contains: rank };
        }

        // 一覧に表示するデータの取得
        const listData = await prisma.games.findMany({
            where: whereConditions,
            skip: page ? offset : undefined,
            take: page ? limit : undefined,
            select: {
                id: true,
                name: true,
                rank: true,
                filePath: true,
            },
        });

        // 全体のデータとその数
        const totalData = await prisma.games.count({ where: whereConditions });
        const totalPage = Math.ceil(totalData / limit);

        return { message: null, success: true, data: listData, totalPage: totalPage, currentPage: page, login: true };

    } catch (e) {
        console.log("エラー内容：", e);
        return { message: "ゲーム 取得失敗...", success: false }
    }
}

export async function detail({ id }: gamesProp) {

    // jwtでユーザーIdの取得
    const userId = await commonCheck();

    // ログインしているか
    if (!userId) {
        return { message: commonErrorMessage.login, success: false, login: false };
    }

    try {
        // 詳細用データ取得
        const data = await prisma.games.findUnique({
            where: { id: Number(id), userId: Number(userId) },
            select: {
                id: true,
                name: true,
                rank: true,
                filePath: true,
            }
        });

        return { message: "取得成功", success: true, data: data, login: userId ? true : false }
    } catch (e) {
        console.log("エラー内容：", e);
        return { message: "取得失敗", success: false, login: userId ? true : false }
    }
}

// ゲーム更新
export async function Update({ rank, id, file }: gamesProp) {

    // ユーザーIDの取得
    const userId = await commonCheck();

    // ログインしているか
    if (!userId) {
        return { message: commonErrorMessage.login, success: false, login: false };
    }

    try {
        // バリデーションチェック
        const issue = GameUpdateSchema.safeParse({ rank, id, file });

        if (!issue.success) {
            // チェックに引っかかった場合
            const validation = z.flattenError(issue.error);
            const message = validation.fieldErrors;
            console.log("エラーメッセージ：", message.rank, message.file);
            return { message: message ? commonErrorMessage.valid : null, success: false, login: userId ? true : false };
        }

        // 画像のアップロード
        if (file && file.size > 0) {
            // 既存のファイルパスを取得
            const existingFile = await prisma.games.findUnique({
                where: { id: Number(id), userId: Number(userId) },
                select: { filePath: true }
            });

            if (existingFile?.filePath) {
                // 既存の画像を削除
                await imageRemove(userId, existingFile.filePath, "rank");
            } else {
                console.log("既存の画像が存在しません。");
            }

            console.log("確認：", existingFile?.filePath);

            // 新しい画像をアップロード
            const filePath = await imageUpload(userId, file, "rank");

            if (filePath) {

                // ゲームとランクの更新
                await prisma.games.update({
                    where: { id: Number(id) },
                    data: {
                        rank: rank,
                        filePath: filePath
                    },
                });
            }
        } else {

            // ゲームとランクの更新
            await prisma.games.update({
                where: { id: Number(id) },
                data: {
                    rank: rank
                },
            });
        }

        return { message: "ゲーム 更新成功", success: true, login: userId ? true : false };
    } catch (e) {
        console.log("エラー内容：", e);
        return { message: "ゲーム 更新失敗...", success: false, login: userId ? true : false };
    }
}

export async function Delete(id: number) {

    // jwt認証
    const userId = await commonCheck();

    // ログインしているか
    if (!userId) {
        return { message: commonErrorMessage.login, success: false, login: false };
    }

    try {
        // バリデーションチェック
        const issue = DeleteSchema.safeParse({ userId, id });

        if (!issue.success) {
            // チェックに引っかかった場合
            const validation = z.flattenError(issue.error);
            const message = validation.fieldErrors;
            console.log("エラーメッセージ：", [message.userId, message.id]);
            return { message: message ? commonErrorMessage.valid : null, success: false };
        }

        if (id && userId) {
            // ゲーム更新処理
            await prisma.games.delete({
                where: { id: id, userId: userId }
            });
            return { message: "登録したゲームは正常に削除されました。", success: true, login: true };
        } else {
            return { message: "対象なし", success: false };
        }
    } catch (e) {
        console.log("エラー内容：", e);
        return { message: "ゲーム削除時にエラーが発生しました。", success: false };
    }
}

// jwt認証をしてログインしているユーザーIDを取得
async function commonCheck() {
    const cookie = await getCookies();
    const userId = cookie!.id;

    if (!cookie) {
        return null;
    } else {
        return userId;
    }
}