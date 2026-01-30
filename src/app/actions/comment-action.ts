import { comment, deleteComment, getComments } from "@/utils/api/comment";
import { errorToast, successToast } from "@/utils/toast";
import { CommentSchema } from "@/utils/validation";
import z from "zod";

export async function addComment(_prevState: any, formData: FormData, postId: number, userId: number) {

    const commentData = {
        comment: formData.get("comment") as string,
        postId: postId,
        userId: userId,
        hiddenFlg: formData.get("anonymous") as string,
        dispRankFlg: formData.get("dispRank") as string,
        postRank: Number(formData.get("postRank")),
        yourRank: Number(formData.get("yourRank")),
    }

    const issues = CommentSchema.safeParse(commentData);

    if (!issues.success) {
        const validation = z.flattenError(issues.error);
        return validation.fieldErrors;
    } else {
        // コメント追加処理
        const res = await comment(commentData);

        const success = res?.success;
        const message = res?.message;

        if (success) {
            successToast(message);
        } else {
            errorToast(message);
        }
    }
}

export async function getCommentList(postId: number, game: string) {
    // コメント取得処理
    const res = await getComments(postId, game);

    const success = res?.success;
    const message = res?.message;
    const data = res?.data;

    if (success) {
        // 成功時
        return data;
    } else {
        // 失敗時
        errorToast(message);
    }
}

export async function commentDelete(commentId: number, userId: number) {
    // コメント削除処理
    const res = await deleteComment(commentId, userId);

    const success = res?.success;
    const message = res?.message;

    return { success, message };
}