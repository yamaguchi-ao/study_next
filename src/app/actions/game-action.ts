import { Register, Search, Update } from "@/utils/api/game"
import { errorToast, successToast } from "@/utils/toast";
import { redirect } from "next/navigation";

// ゲームとランク登録
export async function GameRegister(_prevState: any, formData: FormData, id: number) {

    const gameData = {
        name: formData.get("name") as string,
        rank: formData.get("rank") as string,
        id: id
    }

    // やっているゲームとランクを登録
    const res = await Register(gameData);

    const success = res?.success;
    const message = res?.message;

    if (success) {
        // 成功時
        successToast(message);
        redirect("/list/game");

    } else {
        // 失敗時
        errorToast(message);
    }
}

export async function GameSearch(_prevState: any, formData: FormData) {
    // ゲームを検索

    const subject = {
        game: formData.get("game") as string,
        rank: formData.get("rank") as string
    }

    // やっているゲームとランクを登録
    const res = await Search(subject);

    const success = res?.success;
    const message = res?.success;
    const data = res?.data;

    if (success) {
        return data;
    } else {
        errorToast(message);
    }

}

export async function GameUpdate(_prevState: any, formData: FormData, id: number) {
    // ゲームとランクを更新

    const gameData = {
        game: formData.get("name") as string,
        rank: formData.get("rank") as string,
        id: id
    };

    const res = await Update(gameData);

    const success = res?.success;
    const message = res?.message;

    try {



    } catch (e) {

    }
}

export async function GameDelete() {
    // ゲームを削除
    try {

    } catch (e) {

    }
}