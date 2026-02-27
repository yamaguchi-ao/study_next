import prisma from "@/lib/prisma";
import { loginCheck } from "@/utils/loginCheck";
import { UserUpdateSchema } from "@/utils/validation";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import bcrypt from 'bcrypt';

// ユーザー更新
export async function POST(req: NextRequest) {
    const { userId, username, email, password, newPassword, confirm } = await req.json();

    try {
        // ログイン判定
        const isLogin = await loginCheck(req);

        if (!isLogin) {
            return NextResponse.json({ message: "ログインしていません。", success: false, login: false }, { status: 401 });
        }

        //　API側のバリデーションチェック
        const issue = UserUpdateSchema.safeParse({ userId, username, email, password, newPassword, confirm });

        if (!issue.success) {
            const validation = z.flattenError(issue.error);
            const message = validation.fieldErrors ?? null;
            return NextResponse.json({ message: message, success: false, login: isLogin }, { status: 400 });
        }

        // 更新を行うユーザー情報の取得
        const user = await prisma.users.findUnique({
            where: { id: Number(userId) },
        });

        if (!user) {
            return NextResponse.json({ message: "ユーザーが見つかりません。", success: false, login: isLogin }, { status: 404 });
        }

        if (user.email !== email) {
            const existingEmail = await prisma.users.findUnique({
                where: { email: email },
            });

            if (existingEmail) {
                return NextResponse.json({ message: "このメールアドレスは既に使用されています。", success: false, login: isLogin }, { status: 400 });
            }
        }

        if (!password && !newPassword && !confirm) {
            // パスワード変更なしでユーザー情報のみ更新
            await prisma.users.update({
                where: { id: Number(userId) },
                data: {
                    name: username,
                    email: email,
                }
            });

            return NextResponse.json({ message: "ユーザー情報を更新しました。", success: true, login: isLogin }, { status: 200 });
        }

        // パスワードの照合
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json({ message: "現在のパスワードが違います。", success: false, login: isLogin }, { status: 400 });
        }

        // パスワードのハッシュ化
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.users.update({
            where: { id: Number(userId) },
            data: {
                name: username,
                email: email,
                password: hashedPassword,
            }
        });

        return NextResponse.json({ message: "ユーザー情報を更新しました。", success: true, login: isLogin }, { status: 200 });

    } catch (e) {
        console.log("エラー確認：", e);
        return NextResponse.json({ message: "ユーザー更新 失敗...", e }, { status: 500 })
    }
}