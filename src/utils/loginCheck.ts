import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function loginCheck(req: NextRequest) {
    const JWT_SECRET = process.env.JWT_SECRET;
    const token = req.cookies.get("auth_token")?.value;

    if (token === undefined || token === null) {
        return false;
    } else {
        try {
            // jwt署名の検証
            const data = jwt.verify(token, JWT_SECRET!);
            if (data === null || data === undefined) {
                return false;
            } else {
                return true;
            }
        } catch (e) {
            console.log("エラー内容：", e);
            return false;
        }
    }
}