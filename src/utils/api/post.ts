"use server"

import { getUrl } from "@/constants/getUrl";
import { revalidatePath } from "next/cache";
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
    revalidatePath("/post");
    return data.json();
}

export const listSearch = async (game: string, page?: number) => {

    const baseUrl = await getUrl();
    const url = `${baseUrl}/api/post/search` + "?game=" + game;
    const currentPage = page ? "&page=" + page : '';
    const cookie = await cookies();
    const data = await fetch(url + currentPage, {
        method: "GET",
        credentials: "include",
        headers: {
            Cookie: cookie.toString(),
        },
    });
    return data.json();
}

export const detailSearch = async (postId: Number, gameTag?: string) => {

    const baseurl = await getUrl();
    const url = `${baseurl}/api/post/search` + "?id=" + postId + "&gameTag=" + gameTag;
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

export const updateSearch = async (postId: Number) => {

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

export async function Update(postData: { title?: string, post?: string, id: number, likeCount?: number }) {

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
    revalidatePath("/post/" + postData.id + "/details");
    return data.json();
}

export async function Delete(postId: number) {

    const baseUrl = await getUrl();
    const url = `${baseUrl}/api/post/delete`;
    const cookie = await cookies();
    const data = await fetch(url, {
        method: "POST",
        body: JSON.stringify({ id: postId }),
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