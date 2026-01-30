import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { DeleteSchema } from "@/utils/validation";
import z from "zod";

export async function POST(req: NextRequest) {

    const { userId, id } = await req.json();
    const JWT_SECRET = process.env.JWT_SECRET;

    try {
        // ログインしているかどうかの判定
        const token = req.cookies.get("auth_token")?.value;

        if (token === null || token === undefined) {
            return NextResponse.json({ message: "ログインしていない。", success: false }, { status: 500 });
        }

        const data = await jwt.verify(token!, JWT_SECRET!);

        if (!data) {
            return NextResponse.json({ message: "ログインしていません。", success: false }, { status: 500 });
        }

        // 削除時バリデーションチェック
        const issue = DeleteSchema.safeParse({ userId, id });

        if (!issue.success) {
            const validation = z.flattenError(issue.error);
            const message = validation.fieldErrors ?? null;
            return NextResponse.json({ message: message, success: false }, { status: 400 });
        }

        if (id && userId) {
            await prisma.comments.delete({
                where: { id: Number(id), userId: Number(userId) }
            });
            return NextResponse.json({ message: "コメントを削除しました。", success: true }, { status: 200 });
        } else {
            return NextResponse.json({ message: "対象なし", success: false }, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({ message: "コメント削除 失敗", error }, { status: 500 });
    }
}