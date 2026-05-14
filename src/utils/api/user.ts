"use server"

import { getCookies } from "@/app/actions/action";
import prisma from "@/lib/prisma";
import { commonErrorMessage, DeleteSchema, UserUpdateSchema } from "../validation";
import z from "zod";
import bcrypt from 'bcrypt';

interface updateProp {
    username: string,
    email: string,
    password: string,
    newPassword: string,
    confirm: string
}

// ユーザー取得
export async function UserInfo() {

    // jwt認証でユーザーIdを取得
    const userId = await commonCheck();

    if (userId === null) {
        return { success: false, message: commonErrorMessage.login, login: false };
    }

    try {
        const data = await prisma.users.findUnique({
            where: { id: Number(userId) },
            select: {
                name: true,
                email: true,
                posts: {
                    select: {
                        id: true,
                        title: true,
                        createdAt: true,
                        updatedAt: true,
                    }
                },
                comments: {
                    select: {
                        id: true,
                        comment: true,
                        createdAt: true,
                        post: {
                            select: {
                                title: true,
                            }
                        }
                    }
                }
            }
        });

        if (!data) {
            return { message: "ユーザーが見つかりません。", success: false, login: userId ? true : false };
        }

        return { data: data, success: true };

    } catch (e) {
        console.log("エラー内容：", e);
        return { message: "ユーザ 取得失敗...", success: false, login: userId ? true : false };
    }
}

//　ユーザー更新
export async function UserUpdate({ ...info }: updateProp) {

    // jwt認証でユーザーIdを取得
    const userId = await commonCheck();

    if (userId === null) {
        return { success: false, message: commonErrorMessage.login, login: false };
    }

    //　API側のバリデーションチェック
    const issue = UserUpdateSchema.safeParse({ ...info });

    if (!issue.success) {
        const validation = z.flattenError(issue.error);
        const message = validation.fieldErrors;
        console.log("エラーメッセージ：", [message.username, message.email, message.password, message.newPassword, message.confirm]);
        return { message: message ? commonErrorMessage.valid : null, success: false };
    }

    try {
        // 更新を行うユーザー情報の取得
        const user = await prisma.users.findUnique({
            where: { id: Number(userId) },
        });

        if (!user) {
            return { message: "ユーザーが見つかりません。", success: false };
        }

        // 既存のメールアドレス確認
        if (user.email !== info.email) {
            const existingEmail = await prisma.users.findUnique({
                where: { email: info.email },
            });

            if (existingEmail) {
                return { message: "このメールアドレスは既に使用されています。", success: false };
            }
        }

        // パスワード更新なし状態での更新
        if (!info.password && !info.newPassword && !info.confirm) {
            await prisma.users.update({
                where: { id: Number(userId) },
                data: {
                    name: info.username,
                    email: info.email,
                }
            });
            return { message: "ユーザー情報を更新しました。", success: true }
        }

        // パスワードの照合
        const isPasswordValid = await bcrypt.compare(info.password, user.password);

        if (!isPasswordValid) {
            return { message: "現在のパスワードが違います。", success: false };
        }

        // パスワードのハッシュ化
        const hashedPassword = await bcrypt.hash(info.newPassword, 10);

        await prisma.users.update({
            where: { id: Number(userId) },
            data: {
                name: info.username,
                email: info.email,
                password: hashedPassword,
            }
        });

        return { message: "ユーザー情報を更新しました。", success: true };

    } catch (e) {
        console.log("エラー内容：", e);
        return { message: "ユーザ更新 失敗...", success: false };
    }
}

// ユーザー削除
export async function deleteUser(id: number) {

    // jwt認証でユーザーIdを取得
    const userId = await commonCheck();

    if (userId === null) {
        return { success: false, message: commonErrorMessage.login, login: false };
    }

    try {

        //　API側のバリデーションチェック
        const issue = DeleteSchema.safeParse({ userId, id });

        if (!issue.success) {
            const validation = z.flattenError(issue.error);
            const message = validation.fieldErrors;
            console.log("エラーメッセージ：", [message.userId, message.id]);
            return { message: message ? commonErrorMessage.valid : null, success: false };
        }

        // 削除するユーザーとログインしているユーザーの比較
        if (Number(userId) !== Number(id)) {
            return { message: "権限がありません。", success: false };
        }

        // ユーザー削除
        await prisma.users.delete({
            where: { id: Number(id) }
        });

        return { message: "ユーザーを削除しました。", success: true };
    } catch (e) {
        console.log("エラー内容：", e);
        return { message: "ユーザー削除 失敗...", success: false };
    }
}

async function commonCheck() {
    const cookie = await getCookies();
    const userId = cookie!.id;

    if (!cookie) {
        return null;
    } else {
        return userId;
    }
}