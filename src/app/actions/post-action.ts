import { CommentSchema, PostSchema } from "@/utils/validation";
import { getCookies } from "./action";
import { z } from "zod";
import { Delete, detailSearch, listSearch, post, Update } from "@/utils/api/post";
import { errorToast, successToast } from "@/utils/toast";
import { redirect } from "next/navigation";

export async function postRegister(_prevState: any, formData: FormData) {

    const cookie = await getCookies();
    const userId = cookie?.id;

    const postData = {
        title: formData.get("title") as string,
        post: formData.get("post") as string,
        game: formData.get("game") as string,
        id: userId as number
    }

    // バリデーションチェック
    const issue = PostSchema.safeParse(postData);

    if (!issue.success) {
        const validation = z.flattenError(issue.error);
        return validation.fieldErrors;
    } else {
        // 投稿成功時の処理
        const res = await post(postData);

        const success = res?.success;
        const message = res?.message;

        if (success) {
            successToast(message);
            redirect("/post");
        } else {
            errorToast(message);
        }
    }
}

export async function postListSearch(game: string) {

    // やっているゲームとランクを検索
    const res = await listSearch(game);

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

export async function getPost(postId: Number) {

    // やっているゲームとランクを取得
    const res = await detailSearch(postId);

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

export async function postUpdate(_prevState: any, formData: FormData, id: number) {

    const postId = id;

    const postData = {
        title: formData.get("title") as string,
        post: formData.get("post") as string,
        id: postId
    }

    const issues = PostSchema.safeParse(postData);

    if (!issues.success) {
        const validation = z.flattenError(issues.error);
        return validation.fieldErrors;
    } else {
        const res = await Update(postData);

        const success = res?.success;
        const message = res?.message;

        if (success) {
            // 成功時
            successToast(message);
            redirect("/post");
        } else {
            // 失敗時
            errorToast(message);
        }
    }

}

export async function postDelete(postId: number) {

    const res = await Delete(postId);

    const success = res?.success;
    const message = res?.message;

    return {success, message};
}