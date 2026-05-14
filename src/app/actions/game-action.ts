import { Register, listSearch, Update, Delete, detail } from "@/utils/api/game"
import { errorToast, successToast } from "@/utils/toast";
import { GameSchema, GameUpdateSchema } from "@/utils/validation";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getCookies } from "./action";
import { GamesWithUsers } from "@/types";

// ゲームとランク登録
export async function GameRegister(_prevState: any, formData: FormData) {

    // jwt認証
    const cookie = await getCookies();

    // ログインしているか
    if (cookie === null || cookie === undefined) {
        redirect("/login?error=true");
    }

    const userId = cookie?.id;

    // 入力内容の取得
    const gameData = {
        name: formData.get("name") as string,
        rank: formData.get("rank") as string,
        id: userId as number
    }

    // バリデーションチェック
    const issues = GameSchema.safeParse(gameData);

    if (!issues.success) {
        // チェックに引っかかった場合
        const validation = z.flattenError(issues.error);
        return validation.fieldErrors;
    } else {
        // ゲームとランクを登録
        const res = await Register(gameData);

        const success = res?.success;
        const message = res?.message;
        const login = res?.login;

        if (success) {
            // 成功時
            successToast(message!);
            redirect("/game");
        } else {
            errorToast(message!);
            if (!login) {
                redirect("/login?error=true");
            }
        }
    }
}

// ゲーム一覧の取得
export async function GameListSearch(game: string, rank: string, page?: number) {

    // jwt認証
    const cookie = await getCookies();

    // ログインしているか
    if (cookie === null || cookie === undefined) {
        redirect("/login?error=true");
    }

    let res = null;

    if (page) {
        // ページング用
        res = await listSearch({ game, rank, page });
    } else {
        // 検索用
        res = await listSearch({ game, rank });
    };

    const success = res?.success;
    const message = res?.message;
    const login = res?.login;
    const data = res?.data as GamesWithUsers[];
    const totalPage = res?.totalPage!;
    const currentPage = res?.currentPage!;

    if (success) {
        // 成功時
        return { data: data, totalPage: totalPage, currentPage: currentPage };
    } else {
        errorToast(message!);
        if (!login) {
            redirect("/login?error=true");
        }
    }
};

// 詳細用
export async function getGame(id: number) {

    // jwt認証
    const cookie = await getCookies();

    // ログインしているか
    if (cookie === null || cookie === undefined) {
        redirect("/login?error=true");
    }

    // やっているゲームとランクを取得
    const res = await detail({ id });

    const success = res?.success;
    const message = res?.message;
    const login = res?.login;
    const data = res?.data;

    if (success) {
        // 成功時
        return data;
    } else {
        // 失敗時
        errorToast(message);
        if (!login) {
            redirect("/login?error=true");
        }
    }
}

// ゲームとランクの更新
export async function GameUpdate(_prevState: any, formData: FormData, id: number) {

    // jwt認証
    const cookie = await getCookies();

    // ログインしているか
    if (cookie === null || cookie === undefined) {
        redirect("/login?error=true");
    }

    // 入力内容の取得
    const gameData = {
        rank: formData.get("rank") as string,
        id: id
    };

    // バリデーションチェック
    const issues = GameUpdateSchema.safeParse(gameData);

    if (!issues.success) {
        // チェックに引っかかった場合
        const validation = z.flattenError(issues.error);
        return validation.fieldErrors;
    } else {
        // やっているゲームとランクを更新
        const res = await Update(gameData);

        const success = res?.success;
        const message = res?.message;
        const login = res?.login;

        if (success) {
            // 成功時
            successToast(message!);
            redirect("/game");
        } else {
            errorToast(message!);
            if (!login) {
                redirect("/login?error=true");
            }
        }
    }
}

// 削除
export async function gameDelete(gameId: number) {

    // jwt認証
    const cookie = await getCookies();

    // ログインしているか
    if (cookie === null || cookie === undefined) {
        redirect("/login?error=true");
    }

    // ゲーム削除処理
    const res = await Delete(gameId);

    const success = res?.success;
    const message = res?.message;
    const login = res?.login;

    if (success) {
        // 成功時
        return { success, message };
    } else {
        errorToast(message!);
        if (!login) {
            redirect("/login?error=true");
        }
    }
}