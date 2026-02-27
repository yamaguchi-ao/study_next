import { redirect } from "next/navigation";
import { signUp, signIn, logout } from "@/utils/api/auth";
import { LoginSchema, UserSchema } from "@/utils/validation";
import { z } from "zod";
import { errorToast, successToast } from "@/utils/toast";

// ログイン情報取得
export async function LoginAction(_prevState: any, formData: FormData) {

    const loginData = {
        email: formData.get("email") as string,
        password: formData.get("password") as string
    }

    // バリデーションチェック
    const issues = LoginSchema.safeParse(loginData);

    // バリデーションエラー時
    if (!issues.success) {
        const validation = z.flattenError(issues.error);
        return validation.fieldErrors;
    } else {
        // ログイン実行
        const res = await signIn(loginData);
        const success = res?.success;
        const message = res?.message;

        if (success) {
            // ログイン成功時
            successToast(message);
            redirect("/post");
        } else {
            // ログイン失敗時
            errorToast(message);
        }
    }
}

// 登録情報取得
export async function RegisterAction(_prevState: any, formData: FormData) {
    // ユーザ登録の入力値取得
    const userData = {
        username: formData.get("username") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        confirm: formData.get("confirm") as string,
    }

    // バリデーションチェック
    const issues = UserSchema.safeParse(userData);

    // バリデーションエラー時
    if (!issues.success) {
        const validation = z.flattenError(issues.error);
        return validation.fieldErrors;

    } else {
        //　ユーザー登録実施
        const res = await signUp(userData);
        const success = res?.success;
        const message = res?.message;

        // 作成したトークンがある場合
        if (success) {
            successToast(message);
            redirect("/post");
        } else {
            // ない場合
            errorToast(message);
        }
    }
}

export async function Logout() {
    const res = await logout();
    const success = res?.success;
    const message = res?.message;

    // ログアウト
    if (success) {
        successToast(message);
        redirect("/login");
    }
}