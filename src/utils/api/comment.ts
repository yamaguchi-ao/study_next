// コメント
"use server"
import { getCookies } from "@/app/actions/action";
import { revalidatePath } from "next/cache";
import { CommentSchema, commonErrorMessage, DeleteSchema } from "../validation";
import prisma from "@/lib/prisma";
import z from "zod";

interface CommentProp {
    comment?: string,
    postId: number,
    hiddenFlg?: string,
    postRank?: number,
    yourRank?: number,
    dispRankFlg?: string;
    game?: string;
}

interface CommentUpdateProp {
    postId?: number,
    commentId: number,
    count?: number,
    type?: string
}

// コメント追加
export async function Comment({ ...CommentProp }: CommentProp) {
    const userId = await commonCheck();

    // jwi認証でユーザーIDを取得する
    if (userId === null) {
        return { success: false, message: commonErrorMessage.login, login: false };
    }

    // バリデーションチェック
    const issue = CommentSchema.safeParse({ ...CommentProp, userId });

    if (!issue.success) {
        const validation = z.flattenError(issue.error);
        const message = validation.fieldErrors;
        console.log("エラーメッセージ：", [message.comment, message.postRank, message.yourRank]);
        return { message: message ? commonErrorMessage.valid : null, success: false };
    }

    try {
        // コメント作成
        await prisma.comments.create({
            data: {
                comment: CommentProp.comment!,
                postId: Number(CommentProp.postId),
                userId: Number(userId),
                hiddenFlg: CommentProp.hiddenFlg ? true : false,
                dispRankFlg: CommentProp.dispRankFlg ? true : false,
            }
        });

        return { success: true, message: "コメント 追加成功!", login: userId ? true : false }
    } catch (e) {
        return { success: false, message: "コメント 追加失敗...", login: userId ? true : false };
    }
}

// コメント取得
export async function getComments({ postId, game }: CommentProp) {
    const userId = await commonCheck();

    // jwi認証でユーザーIDを取得する
    if (userId === null) {
        return { success: false, message: commonErrorMessage.login, login: false };
    }

    try {
        // コメントの取得
        let detailData = await commentDetail({ postId, game });

        // 取得したデータから評価が押されているデータを取得
        const pressFlg = await prisma.pressedComments.findMany({
            where: { postId: Number(postId), userId: Number(userId) },
        });

        // すでに押してあるフラグとタイプを取得し、取得したデータに付け加える
        detailData = detailData.map((comment) => {
            const pressedComment = pressFlg.find((press) => press.commentId === comment.id);
            return {
                ...comment,
                pressedFlg: pressedComment ? pressedComment.pressedFlg : false,
                pressedType: pressedComment ? pressedComment.pressedType : false
            };
        });

        // 情報を返す
        return { success: true, data: detailData };
    } catch (e) {
        // エラー時の内容を返す
        console.log("エラー内容：", e);
        return { success: false, message: "コメント取得時に問題が発生いたしました。" };
    }
}

// コメント更新
export async function Update({ ...comment }: CommentUpdateProp) {

    const userId = await commonCheck();

    // jwi認証でユーザーIDを取得する
    if (userId === null) {
        return { success: false, message: commonErrorMessage.login, login: false };
    }

    try {
        // 評価の更新対象の取得
        const pressedComment = await prisma.pressedComments.findFirst({
            where: { commentId: Number(comment.commentId), postId: Number(comment.postId), userId: Number(userId) },
        });

        if (!pressedComment) {
            // 評価の更新対象が取得できなかった場合

            await prisma.comments.update({
                where: { id: Number(comment.commentId) },
                data: comment.type === "like" ? { like: comment.count } : { bad: comment.count }
            });

            await prisma.pressedComments.create({
                data: {
                    commentId: Number(comment.commentId),
                    postId: Number(comment.postId),
                    userId: Number(userId),
                    pressedType: comment.type!,
                    pressedFlg: true
                }
            });
        } else {
            if (pressedComment.pressedFlg === false) {
                // コメントの評価がされていない場合
                await prisma.comments.update({
                    where: { id: Number(comment.commentId) },
                    data: comment.type === "like" ? { like: comment.count } : { bad: comment.count }
                });

                await prisma.pressedComments.update({
                    where: { id: pressedComment.id },
                    data: { pressedFlg: true }
                });

            } else {
                return { message: "既に評価しています。", success: false };
            }
        }
        revalidatePath("/post/" + comment.postId + "/details");
        return { message: "コメント評価の更新 成功！", success: true, login: userId ? true : false };
    } catch (e) {
        console.log("エラー内容：", e);
        return { message: "コメント評価の更新 失敗...", success: false };
    }
}

// コメント削除
export async function deleteComment(id: number) {
    const userId = await commonCheck();

    if (userId === null) {
        return { success: false, message: commonErrorMessage.login, login: false };
    }

    // 削除時バリデーションチェック
    const issue = DeleteSchema.safeParse({ userId, id });

    if (!issue.success) {
        const validation = z.flattenError(issue.error);
        const message = validation.fieldErrors;
        console.log("エラーメッセージ：", [message.id, message.userId]);
        return { message: message ? commonErrorMessage.valid : null, success: false, login: userId ? true : false };
    }

    try {
        if (id && userId) {
            await prisma.comments.delete({
                where: { id: Number(id), userId: Number(userId) }
            });

            return { message: "コメントを削除しました。", success: true, login: userId ? true : false };
        } else {
            return { message: "対象がありません。", success: false, login: userId ? true : false };
        }
    } catch (e) {
        console.log("エラー内容：", e)
        return { message: "コメント削除 失敗...", success: false, login: userId ? true : false };
    }
}

async function commonCheck() {
    const cookie = await getCookies();
    const userId = cookie!.id;

    if (!cookie) {
        return null;
    } else {
        return userId;
    }
}

// 指定のコメント取得
async function commentDetail({ postId, game }: CommentProp) {
    const data = await prisma.comments.findMany({
        where: { postId: Number(postId) },
        select: {
            id: true,
            comment: true,
            createdAt: true,
            hiddenFlg: true,
            dispRankFlg: true,
            like: true,
            bad: true,
            user: {
                select: {
                    name: true,
                    id: true,
                    games: {
                        where: { name: game },
                        select: {
                            rank: true
                        },
                    }
                }
            },
        },
        orderBy: { id: 'asc' }
    });

    return data;
}