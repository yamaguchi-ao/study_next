// 新規登録のルーティング
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

// User Register API
export async function POST(req: NextResponse) {
    const { username, email, password } = await req.json();

    try {
        const user = prisma.user.create({
            data: {
                name: username,
                email: email,
                password: password
            }
        });

        if (JWT_SECRET) {
            const token = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET, { algorithm: "RS256", expiresIn: "1h" });
            return NextResponse.json({ message: "登録成功", user, token }, { status: 200 });
        }
        return NextResponse.json(user);
    } catch (e) {
        return NextResponse.json(e, {status: 500});
    }
}