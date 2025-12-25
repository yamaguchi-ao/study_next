// コメントのAPI
"use server"
import { getUrl } from "@/constants/getUrl";
import { cookies } from "next/headers";

// コメント追加
export const comment = async (commentData: { comment: string, postId: number, userId: number, hiddenFlg: string }) => {

    const baseUrl = await getUrl();
    const url = `${baseUrl}/api/comment/register`;
    const cookie = await cookies();

    const data = await fetch(url, {
        method: "POST",
        body: JSON.stringify(commentData),
        headers: {
            Cookie: cookie.toString(),
        },
        credentials: "include"
    });

    return data.json();
}

// コメント取得
export async function getComments(postId: number, game: string) {
    const baseUrl = await getUrl();
    const url = `${baseUrl}/api/comment/search?postId=${postId}&game=${game}`;
    const cookie = await cookies();
    const data = await fetch(url, {
        method: "GET",
        headers: {
            Cookie: cookie.toString(),
        },
        credentials: "include"
    });

    return data.json();
}

// コメント削除
export async function deleteComment(id: number) {
    const baseUrl = await getUrl();
    const url = `${baseUrl}/api/comment/delete`;
    const cookie = await cookies();
    const data = await fetch(url, {
        method: "POST",
        body: JSON.stringify({ id: id }),
        headers: {
            Cookie: cookie.toString(),
        },
        credentials: "include"
    });
    return data.json();
}