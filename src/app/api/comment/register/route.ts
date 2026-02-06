import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { CommentSchema } from "@/utils/validation";
import z from "zod";

const JWT_SECRET = process.env.JWT_SECRET;

// コメント追加API
export async function POST(req: NextRequest) {

    const { comment, postId, userId, hiddenFlg, dispRankFlg, postRank, yourRank } = await req.json();

    try {
        // ログインしているかどうかの判定
        const token = req.cookies.get("auth_token")?.value;

        if (token === null || token === undefined) {
            return NextResponse.json({ message: "ログインしていない。", success: false }, { status: 500 });
        }

        const data = await jwt.verify(token!, JWT_SECRET!);

        if (data === null || data === undefined) {
            return NextResponse.json({ message: "ログインしていません。", success: false }, { status: 500 });
        }

        //API側バリデーションチェック
        const issue = CommentSchema.safeParse({ comment, postId, userId, hiddenFlg, dispRankFlg, postRank, yourRank });

        if (!issue.success) {
            const validation = z.flattenError(issue.error);
            const message = validation.fieldErrors;
            console.log("エラーメッセージ：", message);
            return NextResponse.json({ message: message, success: false }, { status: 400 });
        }

        // コメントの追加
        await prisma.comments.create({
            data: {
                comment: comment,
                postId: Number(postId),
                userId: Number(userId),
                hiddenFlg: hiddenFlg ? true : false,
                dispRankFlg: dispRankFlg ? true : false,
            }
        });

        return NextResponse.json({ message: "コメント 追加成功！", success: true }, { status: 200 });

    } catch (e) {
        return NextResponse.json({ message: "コメント 失敗...", e }, { status: 500 });
    }
}