"use client"

import { GameUpdate, getGame } from "@/app/actions/game-action";
import { Sidebar } from "@/components/layout/sidebar";
import { Button, ReturnButton } from "@/components/ui/button";
import { gameNameFixed, supportedGames, supportedGamesMap } from "@/constants/context";
import { errorToast } from "@/utils/toast";
import Image from "next/image";
import { redirect } from "next/navigation";
import { use, useActionState, useEffect, useState } from "react";

export default function UpdatePage({ params }: { params: Promise<{ id: number }> }) {
    const [name, setName] = useState(String);
    const [rank, setRank] = useState(String);
    const [image, setImage] = useState<string | null>(null);

    const gameId = use(params).id;

    // サポートしているゲームの値を取得
    const supportedGameNames = Object.values(supportedGames);

    const [state, gameAction, isPending] = useActionState(
        async (_prevState: any, formData: FormData) => {
            return GameUpdate(_prevState, formData, gameId);
        }, null);

    useEffect(() => {
        async function getGames() {
            const games = await getGame(gameId);
            if (!games) {
                errorToast("不正な遷移です。");
                redirect("/game");
            }
            setName(games?.name);
            setRank(games?.rank ?? "");
            setImage(games?.filePath ?? null);
        }
        getGames();
    }, [params, gameId]);

    // バリデーションエラーメッセージ
    const errorText = (data: string[]) => {
        const list = [];
        for (let i = 0; i < data.length; i++) {
            list.push(<p key={i} className="p-1 text-xs text-red-600">{data[i]}</p>)
        }

        return list;
    }

    return (
        <>
            <title>ゲーム 更新</title>
            <div className="flex h-main overflow-hidden">
                <Sidebar />
                <form className="flex-1" action={gameAction}>
                    <div className="flex p-5 justify-around items-center">
                        <div className="flex flex-col pt-23">
                            <div className="flex pb-10 items-center">
                                <div className="w-35">ゲームタイトル</div>
                                <h1 className="text-2xl pl20">{name}</h1>
                            </div>
                            <div className="flex pb-10 items-center">
                                <div className="w-35">ランク</div>
                                <div className="flex flex-col">
                                    {supportedGameNames.includes(gameNameFixed(name)) ? GameRankSelect(name, rank)
                                        : <input className="border w-64" name="rank" value={rank} onChange={(e) => setRank(e.target.value)}></input>}
                                    {state?.rank ? errorText(state?.rank) : null}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <div className="my-5">ランク画像 変更</div>
                            <input className="mb-5 ml-5 cursor-pointer  file:px-4 file:mr-4 file:py-1 file:border-r-1 file:bg-cyan-500/30 rounded-md border-1 mt-2 w-140" name="file" type="file"></input>
                            {state?.file ? errorText(state?.file) : null}

                            <div className="my-5">現在のランク画像</div>
                            {image ? <Image className="ml-5" src={image} alt="ランク画像" width={300} height={300} ></Image> : <p className="pl-5 text-gray-500">ランク画像はありません</p>}
                        </div>
                    </div>

                    <div className="flex mt-5 justify-around items-end">
                        <ReturnButton />
                        <Button disabled={isPending} type="submit">
                            {isPending ? "更新中..." : "更新"}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    )
}

// 取得したゲームのランクをセレクトボックスする関数
function GameRankSelect(game: string, rank: string) {

    // 特定のランクマップを取得
    const rankMap = supportedGamesMap(game);

    return (
        <select name="rank" className="border w-64" defaultValue={rank}>
            {rankMap?.map((item) => {
                if (isNaN(Number(item.key))) {
                    return true;
                }
                return (
                    <option key={item.key} value={item.value} >{item.value}</option>
                );
            })}
        </select>
    )
}