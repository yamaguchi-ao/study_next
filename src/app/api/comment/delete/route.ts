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
            return NextResponse.json({ message: "ログインしていません。", success: false }, { status: 500 });
        }

        if (id) {
            await prisma.comments.delete({
                where: { id: id }
            });
            return NextResponse.json({ message: "コメントを削除しました。", success: true }, { status: 200 });
        } else {
            return NextResponse.json({ message: "対象なし", success: false }, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({ message: "コメント削除 失敗", error }, { status: 500 });
    }
}