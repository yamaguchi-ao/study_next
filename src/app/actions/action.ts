"use server"

import { cookies } from "next/headers";

export async function getCookies() {
    const cookieStore = await cookies();
    const jwt = cookieStore.get("auth_token")?.value;

    const payload = jwt?.split('.')[1];
    // JWTをデコード
    const decodePayload = atob(payload!);
    // 元がJSONなのでパース
    const userData = JSON.parse(decodePayload);

    const { id, name } = userData;

    return { id, name };
}