// 新規登録のルーティング
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET;

// User Register API
export async function POST(req: NextRequest) {

    const formData = await req.formData();

    const UserData = {
        username: formData.get("username") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        confirm: formData.get("confirm") as string
    }

    try {
        // 取得したメアドの既存確認
        const existingEmail = await prisma.users.findUnique({
            where: {
                email: UserData.email
            }
        });

        // 既存である場合
        if (existingEmail) {
            return NextResponse.json({ existingEmail, error: "メールアドレスが同じでした" }, { status: 500 });
        }

        // パスワードのハッシュ化
        const hashedPassword = await bcrypt.hash(UserData.password, 10);

        // ユーザーの作成
        const user = await prisma.users.create({
            data: {
                name: UserData.username,
                email: UserData.email,
                password: hashedPassword,
            }
        });

        if (JWT_SECRET) {
            const token = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET, { algorithm: "HS256", expiresIn: "1h" });
            return NextResponse.json({ message: "登録成功", user, token }, { status: 200 });
        }
    } catch (e) {
        return NextResponse.json({error: UserData}, { status: 500 });
    }
}