import { Comment, deleteComment, getComments, Update } from "@/utils/api/comment";
import { errorToast, successToast } from "@/utils/toast";
import { CommentSchema } from "@/utils/validation";
import z from "zod";
import { getCookies } from "./action";
import { redirect } from "next/navigation";
import { CommentsWithUsers } from "@/types";

export async function addComment(_prevState: any, formData: FormData, postId: number) {

    // jwt認証
    const cookie = await getCookies();

    //　ログインしているか
    if (cookie === null || cookie === undefined) {
        redirect("/login?error=true");
    }

    // 入力内容の取得
    const commentData = {
        comment: formData.get("comment") as string,
        postId: postId,
        hiddenFlg: formData.get("anonymous") as string,
        dispRankFlg: formData.get("dispRank") as string,
        postRank: Number(formData.get("postRank")),
        yourRank: Number(formData.get("yourRank")),
    }

    // バリデーションチェック
    const issues = CommentSchema.safeParse(commentData);

    if (!issues.success) {
        // チェックに引っかかった場合
        const validation = z.flattenError(issues.error);
        return validation.fieldErrors;
    } else {
        // コメント追加処理
        const res = await Comment(commentData);

        const success = res?.success;
        const message = res?.message;

        if (success) {
            // 成功時
            successToast(message!);
        } else {
            // 失敗時
            errorToast(message!);
        }
    }
}

// コメントのリスト取得
export async function getCommentList(postId: number, game: string) {

    // jwt認証
    const cookie = await getCookies();

    // ログインしているか
    if (cookie === null || cookie === undefined) {
        redirect("/login?error=true");
    }

    // コメント取得処理
    const res = await getComments({ postId, game });

    const success = res?.success;
    const message = res?.message;
    const data = res?.data as unknown as CommentsWithUsers[];

    if (success) {
        // 成功時
        return data;
    } else {
        errorToast(message!);
    }
}

// コメント評価の更新
export async function commentUpdate(postId: number, commentId: number, count: number, type: string) {

    // jwt認証
    const cookie = await getCookies();

    // ログインしているか
    if (cookie === null || cookie === undefined) {
        redirect("/login?error=true");
    }

    // コメントの評価更新
    const res = await Update({ postId, commentId, count, type });

    const success = res?.success;
    const message = res?.message;
    const login = res?.login;

    // 失敗時のみ
    if (!success) {
        errorToast(message);
        if (!login) {
            redirect("/login?error=true");
        }
    }
}

// コメント削除
export async function commentDelete(commentId: number) {
    // コメント削除処理
    const res = await deleteComment(commentId);

    const success = res?.success;
    const message = res?.message;
    const login = res?.login;

    return { success, message, login };
}