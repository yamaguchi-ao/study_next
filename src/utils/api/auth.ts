// 新規登録API呼び出し
export const signUp = async (userData: { username: string, email: string, password: string }) => {

    const url = "/api/auth/signup";

    const data = await fetch(url, {
        method: "POST",
        body: JSON.stringify(userData),
        credentials: "include"
    });
    return data.json();
}

// ログインAPI呼び出し
export const signIn = async (loginData: { email: string, password: string }) => {

    const url = "/api/auth/signin";

    const data = await fetch(url, {
        method: "POST",
        body: JSON.stringify(loginData),
        credentials: "include"
    });
    return data.json();
}

// ログアウト用
export const logout = async () => {
    const url = "/api/auth/logout";

    const data = await fetch(url, {
        method: "POST",
        credentials: "include"
    });
    return data.json();
}