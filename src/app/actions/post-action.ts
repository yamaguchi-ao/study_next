import { PostSchema } from "@/utils/validation";
import { getCookies } from "./action";
import { z } from "zod";
import { Delete, detailSearch, listSearch, post, Update, updateSearch } from "@/utils/api/post";
import { errorToast, successToast } from "@/utils/toast";
import { redirect } from "next/navigation";
interface PostProps {
    postId?: number;
    gameTag?: string;
    game?: string;
}

export async function postRegister(_prevState: any, formData: FormData) {

    const cookie = await getCookies();

    if (cookie === null || cookie === undefined) {
        redirect("/login?error=true");
    }

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
        const login = res?.login;

        if (success) {
            successToast(message);
            redirect("/post");
        } else {
            if (!login) {
                redirect("/login?error=true");
            } else {
                errorToast(message);
            }
        }
    }
}

export async function getPost({ postId, gameTag, game }: PostProps, type?: string) {
    let res = null;
        
    if (game !== null && game !== undefined) {
        // 一覧用
        res = await listSearch(game);
    } else {
        if (postId) {
            if (type === "details") {
                // 詳細
                res = await detailSearch(postId, gameTag);
            } else {
                // 更新
                res = await updateSearch(postId);
            }
        }
    }

    const success = res?.success;
    const message = res?.message;
    const login = res?.login;
    const data = res?.data;

    if (success) {
        // 成功時
        return data;
    } else {
        if (!login) {
            redirect("/login?error=true");
        } else {
            errorToast(message);
        }
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
        const login = res?.login;

        if (success) {
            // 成功時
            successToast(message);
            redirect("/post");
        } else {
            if (!login) {
                redirect("/login?error=true");
            } else {
                errorToast(message);
            }
        }
    }
}

export async function postDelete(postId: number) {

    const res = await Delete(postId);

    const success = res?.success;
    const message = res?.message;
    const login = res?.login;

    if (success) {
        return { success, message };
    } else {
        if (!login) {
            redirect("/login?error=true");
        } else {
            errorToast(message);
        }
    }
}