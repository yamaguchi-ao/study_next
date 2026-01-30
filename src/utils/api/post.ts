"use server"

import { getUrl } from "@/constants/getUrl";
import { cookies } from "next/headers";

export async function post(postData: { title: string, post: string, game: string }) {

    const baseUrl = await getUrl();
    const url = `${baseUrl}/api/post/register`;
    const cookie = await cookies();
    const data = await fetch(url, {
        method: "POST",
        body: JSON.stringify(postData),
        headers: {
            Cookie: cookie.toString(),
        },
        credentials: "include"
    });
    return data.json();
}

export const listSearch = async (game: string) => {

    const baseUrl = await getUrl();
    const url = `${baseUrl}/api/post/search` + "?game=" + game;
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

export const detailSearch = async (postId: Number) => {

    const baseurl = await getUrl();
    const url = `${baseurl}/api/post/search` + "?id=" + postId;
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

export async function Update(postData: { title: string, post: string, id: number }) {

    const baseUrl = await getUrl();
    const url = `${baseUrl}/api/post/update`;
    const cookie = await cookies();
    const data = await fetch(url, {
        method: "POST",
        body: JSON.stringify(postData),
        headers: {
            Cookie: cookie.toString(),
        },
        credentials: "include"
    });
    return data.json();
}

export async function Delete(postId: number, userId: number) {

    const baseUrl = await getUrl();
    const url = `${baseUrl}/api/post/delete`;
    const cookie = await cookies();
    const data = await fetch(url, {
        method: "POST",
        body: JSON.stringify({ id: postId, userId: userId }),
        headers: {
            Cookie: cookie.toString(),
        },
        credentials: "include",
        next: {
            tags: ['posts']
        }
    });
    return data.json();
}