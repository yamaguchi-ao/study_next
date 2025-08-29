// 

export const Register = async (gameData: { name: string, rank: string, id: number }) => {

    const url = "/api/game";

    const data = await fetch(url, {
        method: "POST",
        body: JSON.stringify(gameData)
    });
    return data.json();
}

export const Search = async (subject: { game: string, rank: string }) => {
    const url = "/api/game";

    const data = await fetch(url, {
        method: "GET",
        body: JSON.stringify(subject)
    });
    return data.json();
}

export const Update = async (subject: { game: string, rank: string, id: number }) => {
    const url = "/api/game";

    const data = await fetch(url, {
        method: "POST",
        body: JSON.stringify(subject)
    });
    return data.json();
}