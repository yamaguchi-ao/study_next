import { Register, listSearch, Update, gameSearch, Delete } from "@/utils/api/game"
import { errorToast, successToast } from "@/utils/toast";
import { GameSchema, GameUpdateSchema } from "@/utils/validation";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getCookies } from "./action";

// ゲームとランク登録
export async function GameRegister(_prevState: any, formData: FormData) {

    const cookie = await getCookies();

    if (cookie === null || cookie === undefined) {
        redirect("/login?error=true");
    }

    const userId = cookie?.id;

    const gameData = {
        name: formData.get("name") as string,
        rank: formData.get("rank") as string,
        id: userId as number
    }

    const issues = GameSchema.safeParse(gameData);

    if (!issues.success) {
        const validation = z.flattenError(issues.error);
        return validation.fieldErrors;
    } else {
        // やっているゲームとランクを登録
        const res = await Register(gameData);

        const success = res?.success;
        const message = res?.message;
        const login = res?.login;

        if (success) {
            // 成功時
            successToast(message);
            redirect("/game");
        } else {
            if (!login) {
                redirect("/login?error=true");
            } else {
                errorToast(message);
            }
        }
    }
}

export async function GameListSearch(game: string, rank: string, page?: number) {

    const cookie = await getCookies();

    if (cookie === null || cookie === undefined) {
        redirect("/login?error=true");
    }

    let res = null;
    // やっているゲームとランクを検索
    if (page) {
        res = await listSearch(game, rank, page);
    } else {
        res = await listSearch(game, rank);
    }

    const success = res?.success;
    const message = res?.message;
    const login = res?.login;
    const data = { data: res?.data, currentPage: res?.currentPage, totalPage: res?.totalPage };

    if (success) {
        // 成功時
        return data;
    } else {
        if (!login) {
            redirect("/login?error=true");
        } else {
            errorToast(message);
        }
    }
}

export async function getGame(gameId: Number) {

    const cookie = await getCookies();

    if (cookie === null || cookie === undefined) {
        redirect("/login?error=true");
    }

    // やっているゲームとランクを取得
    const res = await gameSearch(gameId);

    const success = res?.success;
    const message = res?.message;
    const login = res?.login;
    const data = res?.data;

    if (success) {
        // 成功時
        return data;
    } else {
        if (!login) {
            redirect("/login?error=true");
        } else {
            errorToast(message);
        }
    }
}

export async function GameUpdate(_prevState: any, formData: FormData, id: Number) {

    const cookie = await getCookies();

    if (cookie === null || cookie === undefined) {
        redirect("/login?error=true");
    }

    // ゲームとランクを更新
    const gameId = id;

    const gameData = {
        rank: formData.get("rank") as string,
        gameId: gameId as unknown as Number
    }

    const issues = GameUpdateSchema.safeParse(gameData);

    if (!issues.success) {
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
            successToast(message);
            redirect("/game");
        } else {
            if (!login) {
                redirect("/login?error=true");
            } else {
                errorToast(message);
            }
        }
    }
}

// 削除
export async function gameDelete(gameId: number) {

    const cookie = await getCookies();

    if (cookie === null || cookie === undefined) {
        redirect("/login?error=true");
    }

    const res = await Delete(gameId);

    const success = res?.success;
    const message = res?.message;
    const login = res?.login;

    if (success) {
        return { success, message };
    } else {
        if (!login) {
            redirect("/login?error=true");
        } else {
            errorToast(message);
        }
    }
}
