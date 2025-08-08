// ログイン用API
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

// ログイン呼び出しAPI
export async function POST(req: NextRequest) {

    const formData = await req.formData();

    const loginData = {
        email: formData.get("email") as string,
        password: formData.get("password") as string
    }

    try {
        // DBから特定のユーザを検索 
        const user = await prisma.users.findUnique({
            where: { email: loginData.email },
        });

        // ユーザーが存在しない場合
        if (!user) {
            return NextResponse.json({ status: 404 });
        }

        // ハッシュ化されたパスワードの比較
        const passwordMatch = await bcrypt.compare(loginData.password, user.password);

        // パスワードがあっている場合
        if (!passwordMatch) {
            // 間違っている場合
            return NextResponse.json({ status: 401 });
        } else {
            if (JWT_SECRET) {
                const token = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET, { algorithm: "HS256", expiresIn: "1h" });
                return NextResponse.json({ message: "ログイン成功", user, token }, { status: 200 });
            }
        }
    } catch (e) {
        return NextResponse.json({error: loginData}, { status: 500 });
    }
}