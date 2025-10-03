/**
 * ゲーム用API 
 */

export const Register = async (gameData: { name: string, rank: string, id: number }) => {

    const url = "/api/game/register";

    const data = await fetch(url, {
        method: "POST",
        body: JSON.stringify(gameData),
        credentials: "include"
    });
    return data.json();
}

export const listSearch = async (game: string, rank: string) => {

    const url = "/api/game/search" + "?game=" + game + "&rank=" + rank;

    const data = await fetch(url, {
        method: "GET",
        credentials: "include"
    });
    return data.json();
}

export const gameSearch = async (gameId: Number) => {

    const url = "/api/game/search" + "?id=" + gameId;

    const data = await fetch(url, {
        method: "GET",
        credentials: "include"
    });
    return data.json();
}

export const Update = async (subject: { name: string, rank: string, gameId: Number }) => {
    const url = "/api/game/update";

    const data = await fetch(url, {
        method: "POST",
        body: JSON.stringify(subject),
        credentials: "include"
    });
    return data.json();
}

export const Delete = async (id: number) => {
    const url = "/api/game/delete";

    const data = await fetch(url, {
        method: "POST",
        body: JSON.stringify({ id: id }),
        credentials: "include"
    });
    return data.json();
}