"use server"

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

interface userData {
    id: number,
    name: string
}

export async function getCookies() {
    const JWT_SECRET = process.env.JWT_SECRET;
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    try {
        if (token) {
            // jwtの署名の検証
            const data = jwt.verify(token!, JWT_SECRET!) as userData;
            const { id, name } = data;

            // ここでIDとusernameを持つことは可能
            return { id, name };
        } else {
            return null;
        }
    } catch (error) {
        // verifyが正常に処理できなかった
        console.log("エラー内容：", error);
        return null;
    }
}