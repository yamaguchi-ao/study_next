// 新規登録のルーティング
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET;

// User Register API
export async function POST(req: NextRequest) {

    const { username, email, password } = await req.json();

    try {
        // 取得したメアドの既存確認
        const existingEmail = await prisma.users.findUnique({
            where: { email: email }
        });

        // 既存である場合
        if (existingEmail) {
            return NextResponse.json({ message: "そのメールアドレスは既に登録済みです。", success: false }, { status: 500 });
        }

        // パスワードのハッシュ化
        const hashedPassword = await bcrypt.hash(password, 10);

        // ユーザーの作成
        const user = await prisma.users.create({
            data: {
                name: username,
                email: email,
                password: hashedPassword,
            }
        });

        if (JWT_SECRET) {
            const token = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET, { algorithm: "HS256", expiresIn: "1h" });
            const response = NextResponse.json({ message: "新規登録　成功！", success: true }, { status: 200 });

            response.cookies.set("auth_token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 3600
            })

            return response;
        } else {
            return NextResponse.json({ message: "新規登録　失敗...", success: false }, { status: 500 });
        }
    } catch (e) {
        return NextResponse.json({ message: "新規登録　失敗...", success: false, e }, { status: 500 });
    }
}