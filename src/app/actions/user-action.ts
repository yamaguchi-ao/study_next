import { deleteUser, UserInfo, UserUpdate } from "@/utils/api/user";
import { errorToast, successToast } from "@/utils/toast";
import { UserUpdateSchema } from "@/utils/validation";
import { redirect } from "next/navigation";
import { z } from "zod";

//　ユーザー詳細
export async function getUserData(userId: Number) {

    // やっているゲームとランクを取得
    const res = await UserInfo(userId);

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

// ユーザー更新
export async function userDataUpdate(_prevState: any, formData: FormData, userId: Number) {

    const userData = {
        userId: userId as number,
        username: formData.get("username") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        newPassword: formData.get("newPassword") as string,
        confirm: formData.get("confirm") as string
    };

    const issues = UserUpdateSchema.safeParse(userData);

    if (!issues.success) {
        const validation = z.flattenError(issues.error);
        return validation.fieldErrors;
    } else {
        // ユーザー情報を更新
        const res = await UserUpdate(userData);

        const success = res?.success;
        const message = res?.message;
        const login = res?.login;

        if (success) {
            successToast(message);
            return redirect("/user/" + userId + "/details");
        } else {
            if (!login) {
                redirect("/login?error=true");
            } else {
                errorToast(message);
            }
        }
    }
}

// ユーザー削除
export async function UserDelete(userId: number) {

    const res = await deleteUser(userId);

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