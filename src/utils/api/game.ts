/**
 * ゲーム用API 
 */

"use server"

import { cookies, headers } from "next/headers";

export const Register = async (gameData: { name: string, rank: string, id: number }) => {

    const baseUrl = await getUrl();
    const url = `${baseUrl}/api/game/register`;
    const cookie = await cookies();
    const data = await fetch(url, {
        method: "POST",
        body: JSON.stringify(gameData),
        headers: {
            Cookie: cookie.toString(),
        },
        credentials: "include"
    });
    return data.json();
}

export const listSearch = async (game: string, rank: string, userId: number) => {

    const baseUrl = await getUrl();
    const url = `${baseUrl}/api/game/search` + "?game=" + game + "&rank=" + rank + "&userId=" + userId;

    const data = await fetch(url, {
        method: "GET",
        credentials: "include"
    });
    return data.json();
}

export const gameSearch = async (gameId: Number) => {

    const baseUrl = await getUrl();
    const url = `${baseUrl}/api/game/search` + "?id=" + gameId;

    const data = await fetch(url, {
        method: "GET",
        credentials: "include"
    });
    return data.json();
}

export const Update = async (subject: { rank: string, gameId: Number }) => {

    const baseUrl = await getUrl();
    const url = `${baseUrl}/api/game/update`;
    const cookie = await cookies();
    const data = await fetch(url, {
        method: "POST",
        body: JSON.stringify(subject),
        headers: {
            Cookie: cookie.toString(),
        },
        credentials: "include"
    });
    return data.json();
}

export const Delete = async (id: number) => {

    const baseUrl = await getUrl();
    const url = `${baseUrl}/api/game/delete`;
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

async function getUrl() {
    const headersData = headers();
    const protocol = (await headersData).get("x-forwarded-proto") || "http";
    const host = (await headersData).get("host");

    const baseUrl = `${protocol}://${host}`;
    return baseUrl;
}