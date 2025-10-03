"use server"

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

export async function getCookies() {
    const JWT_SECRET = process.env.JWT_SECRET;
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    try {
        // jwtの署名の検証
        const userData = jwt.verify(token!, JWT_SECRET!) as {
            id: number;
            name: string
        };

        const { id, name } = userData;

        return { id, name };
    } catch (error) {
        redirect("/login?error=true");
    }
}