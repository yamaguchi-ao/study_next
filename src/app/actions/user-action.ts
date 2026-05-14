import { UserInfo, UserUpdate } from "@/utils/api/user";
import { errorToast, successToast } from "@/utils/toast";
import { UserUpdateSchema } from "@/utils/validation";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getCookies } from "./action";

//　ユーザー詳細
export async function getUserData() {

    // jwt認証
    const cookie = await getCookies();

    // ログインしているか
    if (cookie === null || cookie === undefined) {
        redirect("/login?error=true");
    }

    // やっているゲームとランクを取得
    const res = await UserInfo();

    const success = res?.success;
    const message = res?.message;
    const login = res?.login;
    const data = res?.data;

    if (success) {
        // 成功時
        return data;
    } else {
        errorToast(message!);
        if (!login) {
            redirect("/login?error=true");
        }
    }
}

// ユーザー更新
export async function userDataUpdate(_prevState: any, formData: FormData) {

    // jwt認証
    const cookies = await getCookies();

    // ログインしているか
    if (cookies === null || cookies === undefined) {
        return redirect("/login?error=true");
    }

    const userId = cookies.id;

    // 入力内容の取得
    const userData = {
        username: formData.get("username") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        newPassword: formData.get("newPassword") as string,
        confirm: formData.get("confirm") as string
    };

    // バリデーションチェック
    const issues = UserUpdateSchema.safeParse(userData);

    if (!issues.success) {
        // チェックに引っかかった場合
        const validation = z.flattenError(issues.error);
        return validation.fieldErrors;
    } else {
        // ユーザー情報を更新
        const res = await UserUpdate(userData);

        const success = res?.success;
        const message = res?.message;
        const login = res?.login;

        if (success) {
            // 成功時
            successToast(message!);
            return redirect("/user/" + userId + "/details");
        } else {
            // 失敗時
            successToast(message!);
            if (!login) {
                redirect("/login?error=true");
            }
        }
    }
}