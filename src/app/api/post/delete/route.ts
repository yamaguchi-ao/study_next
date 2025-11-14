import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
    const { id } = await req.json();

    const JWT_SECRET = process.env.JWT_SECRET;

    try {
        // ログインしているかどうかの判定
        const token = req.cookies.get("auth_token")?.value;
        const data = await jwt.verify(token!, JWT_SECRET!);

        if (!data) {
            return NextResponse.json({ message: "ログインしていない。", success: false }, { status: 500 });
        }

        if (id) {
            await prisma.posts.delete({
                where: { id: id }
            });
            return NextResponse.json({ message: "ゲーム削除", success: true }, { status: 200 });
        } else {
            console.log("対象なし");
            return NextResponse.json({ message: "対象なし", success: false }, { status: 500 });
        }

    } catch (e) {
        return NextResponse.json({ message: "削除失敗", e }, { status: 500 });
    }
}