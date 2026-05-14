"use server"

import { cookies } from "next/headers";
import { commonErrorMessage, LoginSchema, UserSchema } from "../validation";
import z from "zod";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

interface userData {
    username?: string,
    email: string,
    password: string,
    confirm?: string
}

const JWT_SECRET = process.env.JWT_SECRET;

// ユーザー新規登録
export async function signUp({ ...userData }: userData) {

    // バリデーションチェック
    const issue = UserSchema.safeParse(userData);
    const cookieStore = await cookies();

    if (!issue.success) {
        // チェックに引っかかった場合
        const validation = z.flattenError(issue.error);
        const message = validation.fieldErrors;
        console.log("エラーメッセージ：", [message.username, message.email, message.password, message.confirm]);
        return { message: message ? commonErrorMessage.valid : null, success: false };
    }

    try {
        // 取得したメアドの既存確認
        const existingEmail = await prisma.users.findUnique({
            where: { email: userData.email }
        });

        // 既存である場合
        if (existingEmail) {
            return { message: "そのメールアドレスは既に登録済みです。", success: false };
        }

        // パスワードのハッシュ化
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        // ユーザーの作成
        const user = await prisma.users.create({
            data: {
                name: userData.username!,
                email: userData.email,
                password: hashedPassword,
            }
        });

        // cookiesへの設定及び登録
        if (JWT_SECRET) {
            const token = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET, { algorithm: "HS256", expiresIn: "1h" });
            const response = { message: "新規登録 成功！", success: true };

            cookieStore.set("auth_token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 3600
            });

            return response;
        } else {
            return { message: "新規登録 失敗...", success: false };
        }
    } catch (e) {
        console.log("エラー内容：", e);
        return { message: "新規登録時にエラーが発生しました。", success: false };
    }
}

// ログイン呼び出し
export async function signIn({ email, password }: userData) {

    const cookieStore = await cookies();
    const hasToken = cookieStore.has("auth_token");

    // ログイン情報を持っている場合
    if (hasToken) {
        redirect("/post");
    }

    try {
        // リクエストで取得した値をAPI側でも検証
        const issue = LoginSchema.safeParse({ email, password });

        if (!issue.success) {
            // チェックに引っかかった場合
            const validation = z.flattenError(issue.error);
            const message = validation.fieldErrors ?? null;
            console.log("エラーメッセージ：", [message.email, message.password]);
            return { message: message ? commonErrorMessage.valid : null, success: false };
        }
        // DBから特定のユーザを検索 
        const user = await prisma.users.findUnique({
            where: { email: email },
        });

        // ユーザーが存在しない場合
        if (!user) {
            return { message: "ユーザーが存在しません。", success: false };
        }

        // ハッシュ化されたパスワードの比較
        const passwordMatch = await bcrypt.compare(password, user.password);

        // パスワードがあっている場合
        if (!passwordMatch) {
            // 間違っている場合
            return { message: "メールアドレス、またはパスワードが違います。", success: false };
        } else {
            if (JWT_SECRET) {
                const token = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET, { algorithm: "HS256", expiresIn: "1h" });
                const response = { message: "ログイン 成功！", success: true };

                // Cookieに登録
                cookieStore.set("auth_token", token,
                    {
                        httpOnly: true,
                        secure: true,
                        sameSite: "strict",
                        maxAge: 3600
                    }
                )
                return response;
            } else {
                return { message: "ログイン 失敗...", success: false };
            }
        }
    } catch (e) {
        console.log("エラー内容：", e);
        return { message: "ログイン 失敗...", success: false };
    }
}

// ログアウト用
export async function Logout() {
    const cookieStore = await cookies();

    if (cookieStore === null || cookieStore === undefined) {
        return { message: "cookieが取得できませんでした。", success: false };
    }

    const hasCookies = cookieStore.has("auth_token");

    if (hasCookies) {
        cookieStore.delete("auth_token");
    }
    return { message: "ログアウトしました。", success: true };
}