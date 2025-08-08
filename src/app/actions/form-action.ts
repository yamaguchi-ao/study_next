// フォーム取得
import { redirect } from "next/navigation";
import { signUp, signIn } from "@/utils/api/auth";
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
        const error = z.flattenError(issues.error);
        return error.fieldErrors;
    } else {
        // ログイン実行
        const res = await signIn(loginData);
        const token = res?.token;
        const status = res?.status;

        if (token) {
            localStorage.setItem("access_token", token);
            successToast("ログイン 成功！");
            redirect("/list");
        } else {
            if (status === 404) {
                errorToast("ユーザーが存在しません。")
            } else if (status === 401) {
                errorToast("メールアドレス、またはパスワードが違います。")
            }
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
        const test = z.flattenError(issues.error);
        return test.fieldErrors;

    } else {
        //　ユーザー登録実施
        const res = await signUp(userData);
        const token = res?.token;
        const existingEmail = res?.existingEmail;

        // 作成したトークンがある場合
        if (token) {
            localStorage.setItem("access_token", token);
            successToast("新規登録 成功！");
            redirect("/list");
        } else {
            // ない場合
            if (existingEmail) {
                errorToast("そのメールアドレスは既に登録済みです。");
            } else {
                errorToast("新規登録 失敗...");
            }
        }
    }
}