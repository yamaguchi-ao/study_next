import { redirect } from "next/navigation";
import { signUp, signIn } from "@/utils/api/auth";
import { LoginSchema, UserSchema } from "@/utils/validation";
import { z } from "zod";
import { errorToast, successToast } from "@/utils/toast";

// ログイン情報取得
export async function LoginAction(_prevState: any, formData: FormData) {

    // 入力内容の取得
    const loginData = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    }

    // バリデーションチェック
    const issues = LoginSchema.safeParse(loginData);

    // バリデーションエラー時
    if (!issues.success) {
        // チェックに引っかかった場合
        const validation = z.flattenError(issues.error);
        return validation.fieldErrors;
    } else {
        // ログイン処理
        const res = await signIn(loginData);
        const success = res?.success;
        const message = res?.message;

        if (success) {
            // 成功時
            successToast(message!);
            redirect("/post");
        } else {
            // 失敗時
            errorToast(message!);
        }
    }
}

// ユーザー新規登録
export async function RegisterAction(_prevState: any, formData: FormData) {

    // 入力内容取得
    const userData = {
        username: formData.get("username") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        confirm: formData.get("confirm") as string,
    }

    // バリデーションチェック
    const issues = UserSchema.safeParse(userData);

    if (!issues.success) {
        // チェックに引っかかった場合
        const validation = z.flattenError(issues.error);
        return validation.fieldErrors;
    } else {
        //　ユーザー登録処理
        const res = await signUp(userData);
        const success = res?.success;
        const message = res?.message;

        // 作成したトークンがある場合
        if (success) {
            successToast(message!);
            redirect("/post");
        } else {
            // ない場合
            errorToast(message!);
        }
    }
}