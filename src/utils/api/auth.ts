// 新規登録API呼び出し
export const signUp = async (userData: { username: string, email: string, password: string }) => {
    const url = "https://yamaguchi-ao.github.io/study_next/api/auth/signup";

    const data = await fetch(url, {
        method: "POST",
        body: JSON.stringify(userData)
    });
    return data.json();
}

// ログインAPI呼び出し
export const signIn = async (loginData: { email: string, password: string }) => {
    const url = "https://yamaguchi-ao.github.io/study_next/api/auth/signin";

    const data = await fetch(url, {
        method: "POST",
        body: JSON.stringify(loginData)
    });
    return data.json();
}