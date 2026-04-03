import { comment, deleteComment, getComments } from "@/utils/api/comment";
import { successToast } from "@/utils/toast";
import { CommentSchema } from "@/utils/validation";
import z from "zod";
import { getCookies } from "./action";
import { redirect } from "next/navigation";

export async function addComment(_prevState: any, formData: FormData, postId: number) {

    const cookie = await getCookies();

    if (cookie === null || cookie === undefined) {
        redirect("/login?error=true");
    }

    const commentData = {
        comment: formData.get("comment") as string,
        postId: postId,
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
        }
    }
}

export async function getCommentList(postId: number, game: string) {

    const cookie = await getCookies();

    if (cookie === null || cookie === undefined) {
        redirect("/login?error=true");
    }

    // コメント取得処理
    const res = await getComments(postId, game);

    const success = res?.success;
    const data = res?.data;

    if (success) {
        // 成功時
        return data;
    } else {
        return null;
    }
}

export async function commentDelete(commentId: number) {
    // コメント削除処理
    const res = await deleteComment(commentId);

    const success = res?.success;
    const message = res?.message;
    const login = res?.login;

    return { success, message, login };
}