"use server"

import { getCookies } from "@/app/actions/action";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { commonErrorMessage, DeleteSchema, PostSchema } from "../validation";
import z from "zod";
import { Prisma } from "@prisma/client";

interface PostProps {
    userId?: number;
    postId?: number;
    game?: string;
    likeCount?: number;
    page?: number;
    title?: string;
    post?: string;
}

// 投稿新規登録
export async function post({ title, post, game }: PostProps) {

    const userId = await commonCheck();

    if (!userId) {
        return { message: commonErrorMessage.W001, success: false, login: false };
    }

    // バリデーションチェック
    const issue = PostSchema.safeParse({ title, post, game });

    if (!issue.success) {
        // チェックに引っかかった場合
        const validation = z.flattenError(issue.error);
        const message = validation.fieldErrors;
        console.log("エラーメッセージ：", [message.title, message.post, message.game]);
        return { success: false, message: commonErrorMessage.valid, login: userId ? true : false };
    }

    try {
        // 投稿の新規作成
        await prisma.posts.create({
            data: {
                title: title!,
                content: post?.replace(/r?\n/g, "\n"),
                gameTag: game,
                userId: userId,
                rankFlg: false,
            }
        });

        revalidatePath("/post");

        return { message: "投稿 成功！", success: true, login: true };
    } catch (e) {
        console.log("エラー内容：", e);
        return { message: "投稿 失敗...", success: false, login: true };
    }
}

// 投稿の一覧取得
export async function listSearch(game?: string, page?: number) {
    // ログインユーザの取得
    const userId = await commonCheck();

    // 表示数とページ位置
    const limit = 9;
    const offset = (page! - 1) * limit;

    try {
        // ログインしているか
        if (!userId) {
            return { message: commonErrorMessage.login, success: false, login: false };
        }

        // 投稿一覧での検索
        const whereConditions: Prisma.PostsWhereInput = {};

        if (game) {
            // 検索内容がある場合
            whereConditions.gameTag = { contains: game };
        }

        // 投稿一覧データ取得
        const listData = await prisma.posts.findMany({
            where: whereConditions,
            skip: offset,
            take: limit,
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
                comments: true,
                like: true,
            },
        });

        // 全体データと全体の数
        const totalData = await prisma.posts.count({ where: whereConditions });
        const totalPage = Math.ceil(totalData / limit);

        return { message: "投稿 取得成功", success: true, data: listData, totalPage: totalPage, currentPage: page, login: true };

    } catch (e) {
        console.log("エラー内容：", e);
        return { message: "投稿 取得失敗...", success: false, login: true };
    }
}

// 投稿の詳細取得
export async function detailSearch(postId: Number, gameTag?: string) {

    // jwt認証
    const userId = await commonCheck();

    try {
        if (!userId) {
            // ログインしているか
            return { message: commonErrorMessage.login, success: false, login: false };
        }

        // 投稿の詳細データ取得
        const data = await prisma.posts.findUnique({
            where: { id: Number(postId) },
            select: {
                id: true,
                title: true,
                content: true,
                gameTag: true,
                userId: true,
                createdAt: true,
                updatedAt: true,
                rankFlg: true,
                like: true,
                pressedPosts: {
                    where: { postId: Number(postId), userId: Number(userId) },
                    select: { pressFlg: true }
                },
                user: {
                    select: {
                        name: true,
                        games: {
                            where: { name: gameTag },
                            select: {
                                rank: true
                            },
                        }
                    }
                }
            }
        });
        return { message: "取得成功", success: true, data: data, login: true };
    } catch (e) {
        console.log("エラー内容：", e);
        return { message: "投稿 取得失敗...", success: false, login: true };
    }
}

// 投稿の更新用データ取得
export async function updateSearch(postId: Number) {

    // jwt認証用
    const userId = await commonCheck();

    // ログインしているか
    if (!userId) {
        return { message: commonErrorMessage.login, success: false, login: false };
    }

    try {
        // 更新データ取得
        const data = await prisma.posts.findUnique({
            where: { id: Number(postId), userId: Number(userId) },
            select: {
                id: true,
                title: true,
                content: true,
                gameTag: true,
            }
        });

        return { message: "取得成功", success: true, data: data, currentPage: null, totalPage: null, login: true };
    } catch (e) {
        console.log("エラー内容：", e);
        return { message: "投稿 取得失敗...", success: false, login: true };
    }
}

// 投稿更新
export async function Update({ ...postData }: PostProps) {

    // jwt認証用
    const userId = await commonCheck();

    // ログインしているか
    if (!userId) {
        return { message: commonErrorMessage.login, success: false, login: false };
    }

    try {
        if (postData.likeCount === null || postData.likeCount === undefined) {
            // 投稿の更新をした場合

            // バリデーションチェック
            const issue = PostSchema.safeParse(postData);

            if (!issue.success) {
                // チェックに引っかかった場合
                const validation = z.flattenError(issue.error);
                const message = validation.fieldErrors;
                console.log("エラーメッセージ", [message.title, message.post, message.game]);
                return { success: false, message: commonErrorMessage.valid, login: userId ? true : false };
            }

            // 投稿自体の更新
            await PostUpdate(postData.title!, postData.post!, postData.postId!);

        } else {
            // 評価した場合
            const pressedPost = await prisma.pressedPosts.findFirst({
                where: { postId: Number(postData.postId), userId: Number(userId) },
            });

            if (!pressedPost || pressedPost.pressFlg === false) {
                //　評価の更新
                await likeUpdate(postData.postId!, userId, postData.likeCount);
            }
        }

        revalidatePath("/post" + (postData.postId ? "/" + postData.postId : "") + "/details");

        return { message: "更新成功！", success: true, login: true };
    } catch (e) {
        console.log("エラー内容：", e);
        return { message: "投稿 更新失敗...", success: false, login: true };
    }
}

// 投稿削除
export async function Delete(postId: number) {

    const userId = await commonCheck();

    try {
        if (!userId) {
            return { message: commonErrorMessage.login, success: false, login: false };
        }

        // バリデーションチェック
        const issue = DeleteSchema.safeParse({ userId, id: postId });

        if (!issue.success) {
            const validation = z.flattenError(issue.error);
            const message = validation.fieldErrors;
            console.log("エラーメッセージ：", [message.userId, message.id]);
            return { message: message ? commonErrorMessage.valid : null, success: false, login: true };
        }

        // 投稿の削除
        if (postId && userId) {
            await prisma.posts.delete({
                where: { id: postId, userId: userId }
            });
        } else {
            return { message: "対象なし", success: false, login: true };
        }
        revalidatePath("/post");
        return { message: "投稿は正常に削除されました。", success: true, login: true };
    } catch (e) {
        console.log("エラー内容：", e);
        return { message: "投稿の削除は失敗しました。", success: false, login: true };
    }
}

// 投稿の更新
async function PostUpdate(title: string, post: string, postId: number) {
    try {
        // バリデーションチェック
        const issue = PostSchema.safeParse({ title: title, post: post, id: postId });

        if (!issue.success) {
            // チェックに引っかかった場合
            const validation = z.flattenError(issue.error);
            const message = validation.fieldErrors;
            console.log("エラーメッセージ：", [message.title, message.game, message.post]);
            return { message: message ? commonErrorMessage.valid : null, success: false, login: true };
        }

        try {
            // 更新処理
            await prisma.posts.update({
                where: { id: Number(postId) },
                data: {
                    title: title,
                    content: post
                }
            });
        } catch (e) {
            console.log("エラー内容：", e);
            return { message: "投稿の更新に失敗しました。", success: false, login: true };
        }
    } catch (e) {
        console.log("エラー内容：", e);
        return { message: "投稿の更新に失敗しました。", success: false, login: true };
    }
}

// 投稿の評価更新
async function likeUpdate(postId: number, userId: number, likeCount: number, pressedPostId?: number) {

    try {
        // 評価の更新
        await prisma.posts.update({
            where: { id: Number(postId) },
            data: {
                like: likeCount
            }
        });

        // 対象の投稿の評価ボタンを押下しているか
        if (pressedPostId === null || pressedPostId === undefined) {
            // 評価の作成
            await prisma.pressedPosts.create({
                data: {
                    postId: Number(postId),
                    userId: Number(userId),
                    pressFlg: true
                }
            });
        } else {
            // 評価の更新
            await prisma.pressedPosts.update({
                where: { id: pressedPostId },
                data: { pressFlg: true }
            });
        }
    } catch (e) {
        console.log("エラー内容：", e);
        return { message: "エラーが発生しました。", success: false, login: true };
    }
}

// ユーザーIDを取得専用
async function commonCheck() {
    const cookie = await getCookies();
    const userId = cookie!.id;

    if (!cookie) {
        return null;
    } else {
        return userId;
    }
}