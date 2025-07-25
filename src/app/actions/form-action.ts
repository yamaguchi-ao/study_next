// フォーム取得
import { redirect } from "next/navigation";

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
export async function RegisterAction(formData: FormData) {
    const account = formData.get("account");
    const mailAddress = formData.get("mailAddress");
    const password = formData.get("password");

    if (account) {
        if (mailAddress) {
            if (password) {
                // DBに登録後
                redirect("/login");
            }
        }
    } else {
        // バリデーション
    }   
}