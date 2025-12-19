// コメントのAPI
"use server"
import { getUrl } from "@/constants/getUrl";
import { cookies } from "next/headers";

export const comment = async (commentData: { comment: string, postId: number, userId: number }) => {

    const baseUrl = await getUrl();
    const url = `${baseUrl}/api/comment/register`;
    const cookie =  await cookies();

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