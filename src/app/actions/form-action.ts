// フォーム取得
import { redirect } from "next/navigation";
import { signUp, signIn } from "@/utils/api/auth";
import { userSchema } from "@/utils/validation";
import { z } from "zod";

// ログイン情報取得
export async function LoginAction(formData: FormData) {
    const mailAddress = formData.get("mailAddress");
    const password = formData.get("password");

    if (mailAddress && password) {
        // ログイン処理
        console.log(mailAddress + ":" + password);

        redirect('/list')
    } else {
        // バリデーション処理
        console.log("どっちかないか両方ない");
    }
}

// 登録情報取得
export async function RegisterAction(prevState: any, formData: FormData) {
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirm = formData.get("confirm") as string;

    const test = userSchema.safeParse(formData);

    if (!test.success) {
        console.log(test.error.message);        
    } else {
        // const res = await signUp({ username: username, email: email, password: password });
        // return res;
    }
}