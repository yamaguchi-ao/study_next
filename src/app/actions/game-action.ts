import { Register, listSearch, Update, gameSearch } from "@/utils/api/game"
import { errorToast, successToast } from "@/utils/toast";
import { GameSchema } from "@/utils/validation";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getCookies } from "./action";

// ゲームとランク登録
export async function GameRegister(_prevState: any, formData: FormData) {

    const cookie = await getCookies();
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

        if (success) {
            // 成功時
            successToast(message);
            redirect("/game");
        } else {
            // 失敗時
            errorToast(message);
        }
    }
}

export async function GameListSearch(game: string, rank: string) {

    // やっているゲームとランクを検索
    const res = await listSearch(game, rank);

    const success = res?.success;
    const message = res?.success;
    const data = res?.data;

    if (success) {
        // 成功時
        return data;
    } else {
        // 失敗時
        errorToast(message);
    }
}

export async function getGame(gameId: Number) {

    // やっているゲームとランクを取得
    const res = await gameSearch(gameId);

    const success = res?.success;
    const message = res?.success;
    const data = res?.data;
    const { name, rank } = data;

    if (success) {
        // 成功時
        return { name, rank };
    } else {
        // 失敗時
        errorToast(message);
    }
}

export async function GameUpdate(_prevState: any, formData: FormData, id: Number) {

    // ゲームとランクを更新
    const gameId = id;

    const gameData = {
        name: formData.get("name") as string,
        rank: formData.get("rank") as string,
        gameId: gameId as unknown as Number
    }

    const issues = GameSchema.safeParse(gameData);

    if (!issues.success) {
        const validation = z.flattenError(issues.error);
        return validation.fieldErrors;
    } else {
        // やっているゲームとランクを更新
        const res = await Update(gameData);

        const success = res?.success;
        const message = res?.message;

        if (success) {
            // 成功時
            successToast(message);
            redirect("/game");
        } else {
            // 失敗時
            errorToast(message);
        }
    }
}
