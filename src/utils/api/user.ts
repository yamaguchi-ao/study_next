"use server"

import { getUrl } from "@/constants/getUrl";
import { cookies } from "next/headers";

export const UserInfo = async (userId: Number) => {
    const baseUrl = await getUrl();
    const url = `${baseUrl}/api/user/search` + "?id=" + userId;

    const cookie = await cookies();
    const data = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
            Cookie: cookie.toString(),
        },
    });
    return data.json();
}

export const UserUpdate = async (info: { userId: number, username: string, email: string, password: string, newPassword: string, confirm: string }) => {
    const baseUrl = await getUrl();
    const url = `${baseUrl}/api/user/update`;

    const cookie = await cookies();
    const data = await fetch(url, {
        method: "POST",
        body: JSON.stringify(info),
        headers: {
            Cookie: cookie.toString(),
        },
        next: {
            tags: ["users"]
        }
    });
    return data.json();
}

export const deleteUser = async (userId: number) => {
    const baseUrl = await getUrl();
    const url = `${baseUrl}/api/user/delete`;
    const cookie = await cookies();
    const data = await fetch(url, {
        method: "POST",
        body: JSON.stringify({ userId: userId }),
        headers: {
            Cookie: cookie.toString(),
        },
        next: {
            tags: ["users"]
        }
    });
    return data.json();
}