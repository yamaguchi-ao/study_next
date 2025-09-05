// ログイン用API
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

// ログイン呼び出しAPI
export async function POST(req: NextRequest) {

    const { email, password } = await req.json();

    try {
        // DBから特定のユーザを検索 
        const user = await prisma.users.findUnique({
            where: { email: email },
        });

        // ユーザーが存在しない場合
        if (!user) {
            return NextResponse.json({ message: "ユーザーが存在しません。" }, { status: 404 });
        }

        // ハッシュ化されたパスワードの比較
        const passwordMatch = await bcrypt.compare(password, user.password);

        // パスワードがあっている場合
        if (!passwordMatch) {
            // 間違っている場合
            return NextResponse.json({ message: "メールアドレス、またはパスワードが違います。" }, { status: 401 });
        } else {
            if (JWT_SECRET) {
                const token = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET, { algorithm: "HS256", expiresIn: "1h" });
                const response = NextResponse.json({ message: "ログイン　成功！", success: true }, { status: 200 });

                // Cookieに登録
                response.cookies.set("auth_token", token,
                    {
                        httpOnly: true,
                        secure: true,
                        sameSite: "strict",
                        maxAge: 3600
                    }
                )

                return response;
            }
        }
    } catch (e) {
        return NextResponse.json({ message: "ログイン　失敗...", e }, { status: 500 });
    }
}