import { PostSchema } from "@/utils/validation";
import { getCookies } from "./action";
import { z } from "zod";
import { post } from "@/utils/api/post";
import { errorToast, successToast } from "@/utils/toast";
import { redirect } from "next/navigation";

export async function postRegister(_prevState: any, formData: FormData) {

    const userId = (await getCookies()).id;

    const postData = {
        title: formData.get("title") as string,
        post: formData.get("post") as string,
        userId: userId
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

export async function postUpdate() {

}

export async function postSearch() {

}

export async function postDelete() {

}