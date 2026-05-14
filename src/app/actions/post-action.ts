import { PostSchema } from "@/utils/validation";
import { getCookies } from "./action";
import { z } from "zod";
import { Delete, detailSearch, listSearch, post, Update, updateSearch } from "@/utils/api/post";
import { errorToast, successToast } from "@/utils/toast";
import { redirect } from "next/navigation";
import { PostsWithUsers } from "@/types";
interface PostProps {
    postId?: number;
    gameTag?: string;
    game?: string;
    page?: number;
}

// 投稿 新規登録
export async function postRegister(_prevState: any, formData: FormData) {

    // jwt認証
    const cookie = await getCookies();

    // jwt認証でログインしているかを確認
    if (cookie === null || cookie === undefined) {
        redirect("/login?error=true");
    }

    // 入力内容の取得
    const postData = {
        title: formData.get("title") as string,
        post: formData.get("post") as string,
        game: formData.get("game") as string,
    }

    // バリデーションチェック
    const issue = PostSchema.safeParse(postData);

    if (!issue.success) {
        // チェックに引っかかった場合、エラー内容を返す
        const validation = z.flattenError(issue.error);
        return validation.fieldErrors;
    } else {
        // 投稿成功時の処理
        const res = await post(postData);

        const success = res?.success;
        const message = res?.message;
        const login = res?.login;

        if (success) {
            // 成功時
            successToast(message);
            redirect("/post");
        } else {
            // 失敗時
            errorToast(message);
            if (!login) {
                // ログインしていない場合
                redirect("/login?error=true");
            }
        }
    }
}

// 投稿一覧に表示するリストの取得
export async function getPostList({ game, page }: PostProps) {
    
    // jwt認証
    const cookie = await getCookies();

    // ログインしているか
    if (cookie === null || cookie === undefined) {
        redirect("/login?error=true");
    }

    let res = null;

    if (page) {
        // ページング用
        res = await listSearch(game, page);
    } else {
        // 検索用
        res = await listSearch(game);
    }

    // 取得した内容
    const success: boolean | undefined = res?.success;
    const message = res?.message;
    const login = res?.login;
    const data = res?.data as PostsWithUsers[];
    const totalPage = res?.totalPage;
    const currentPage = res?.currentPage;

    if (success) {
        // 成功時
        return { data: data, totalPage: totalPage!, currentPage: currentPage! };
    } else {
        // 失敗時
        errorToast(message);
        if (!login) {
            redirect("/login?error=true");
        }
    }
}

// 投稿の更新内容の取得
export async function getUpdatePost({ postId }: PostProps) {

    // jwt認証
    const cookie = await getCookies();

    // ログインしているか
    if (cookie === null || cookie === undefined) {
        redirect("/login?error=true");
    }

    // 更新内容の取得
    const res = await updateSearch(postId!);

    const success: boolean | undefined = res?.success;
    const message = res?.message;
    const login = res?.login;
    const data = res?.data;

    if (success) {
        // 成功時
        return data;
    } else {
        // 失敗時
        errorToast(message);
        if (!login) {
            redirect("/login?error=true");
        }
    }
}

// 投稿の詳細内容の取得
export async function getPostDetails({ postId, gameTag, }: PostProps) {

    // jwt認証
    const cookie = await getCookies();

    // ログインしているか
    if (cookie === null || cookie === undefined) {
        redirect("/login?error=true");
    }

    // 詳細内容の取得
    const res = await detailSearch(postId!, gameTag);

    const success: boolean | undefined = res?.success;
    const message = res?.message;
    const login = res?.login;
    const data = res?.data;

    if (success) {
        // 成功時
        return data;
    } else {
        // 失敗時
        errorToast(message);
        if (!login) {
            redirect("/login?error=true");
        }
    }
}

// 投稿の更新
export async function postUpdate(_prevState: any, formData: FormData, postId: number) {

    // jwt認証
    const cookie = await getCookies();

    // ログインしているか
    if (cookie === null || cookie === undefined) {
        redirect("/login?error=true");
    }

    // 入力内容の取得
    const postData = {
        title: formData.get("title") as string,
        post: formData.get("post") as string,
        postId: postId
    }

    //　バリデーションチェック
    const issues = PostSchema.safeParse(postData);

    if (!issues.success) {
        // チェックに引っかかった場合
        const validation = z.flattenError(issues.error);
        return validation.fieldErrors;
    } else {
        // 更新処理
        const res = await Update(postData);

        const success = res?.success;
        const message = res?.message;
        const login = res?.login;

        if (success) {
            // 成功時
            successToast(message);
            redirect("/post");
        } else {
            // 失敗時
            errorToast(message);
            if (!login) {
                redirect("/login?error=true");
            }
        }
    }
}

// 投稿の評価更新
export async function likeUpdate(postId: number, likeCount: number) {

    // jwt認証
    const cookie = await getCookies();

    // ログインしているか
    if (cookie === null || cookie === undefined) {
        redirect("/login?error=true");
    }

    // 更新処理
    const res = await Update({ postId, likeCount });

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

// 投稿削除
export async function postDelete(postId: number) {

    // jwt認証
    const cookie = await getCookies();

    // ログインしているか
    if (cookie === null || cookie === undefined) {
        redirect("/login?error=true");
    }

    // 削除処理
    const res = await Delete(postId);

    const success = res?.success;
    const message = res?.message;
    const login = res?.login;

    if (success) {
        // 成功時
        return { success, message };
    } else {
        // 失敗時
        errorToast(message!);
        if (!login) {
            redirect("/login?error=true");
        }
    }
}