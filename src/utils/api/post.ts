export async function post(postData: { title: String, post: String }) {
    const url = "api/post/register";

    const data = await fetch(url, {
        method: "POST",
        body: JSON.stringify(postData),
        credentials: "include"
    });
    return data.json();
}

export async function postDelete() {

    const url = "api/post/delete";
    const data = await fetch(url, {
        method: "POST",
        credentials: "include"
    });
    return data.json();
}

export async function Search(searchData: { game: string }) {
    const url = "api/post/search";

    const data = await fetch(url, {
        method: "GET",
        body: JSON.stringify(searchData),
        credentials: "include"
    });
}