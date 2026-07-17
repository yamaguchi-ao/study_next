"use client"

import { GameRegister } from "@/app/actions/game-action";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { gameNameFixed, supportedGames, supportedGamesMap } from "@/constants/context";
import type { NextPage } from "next";
import { redirect } from "next/navigation";
import { useActionState, useEffect, useState } from "react";

const GameRegist: NextPage = () => {
    const [state, Register, isPending] = useActionState(GameRegister, null);
    const [inputGame, setInputGame] = useState<string | null>(null);

    const supportedGameNames = Object.values(supportedGames);

    useEffect(() => {
    }, []);

    // バリデーションエラーメッセージ
    const errorText = (data: string[]) => {
        const list = [];
        for (let i = 0; i < data.length; i++) {
            list.push(<p key={i} className="p-1 text-xs text-red-600">{data[i]}</p>)
        }

        return list;
    }

    // 選択したゲームを対象とする関数
    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        setInputGame(event.target.value);
    }

    return (
        <>
            <title>ゲーム 登録</title>
            <div className="flex h-main overflow-hidden">
                <Sidebar />
                <form className="flex-1 flex flex-col" action={Register}>
                    <div className="flex flex-col h-full justify-center items-center">

                        <div className="flex pb-10 items-center">
                            <div className="w-35">ゲームタイトル</div>
                            <div className="flex flex-col">
                                <input className="border w-64" name="name" value={inputGame ?? ""} onChange={handleInputChange}></input>
                                {state?.name ? errorText(state?.name) : null}
                            </div>
                        </div>
                        <div className="flex pb-10 items-center">
                            <div className="w-35">ランク</div>
                            <div className="flex flex-col">
                                {supportedGameNames.includes(gameNameFixed(inputGame ?? "") ?? "") ? GameRankSelect(inputGame ?? "") :
                                    <input className="border w-64" name="rank"></input>}
                                {state?.rank ? errorText(state?.rank) : null}
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <div className="my-2">ランク画像 添付 </div>
                            <input className="mb-2 ml-5 cursor-pointer file:px-4 file:mr-4 file:pr-4 file:py-1 file:border-r-1 file:bg-cyan-500/30 rounded-md border-1 mt-2 w-140" name="file" type="file"></input>
                            {state?.file ? errorText(state?.file) : null}
                        </div>

                        <div className="flex space-x-20 mt-10">
                            <Button onClick={() => redirect('/game')}>
                                戻る
                            </Button>

                            <Button disabled={isPending} type="submit">
                                {isPending ? "登録中..." : "登録"}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default GameRegist

// 現在登録しているゲームのリストを表示する関数
function GameRankSelect(game: string) {

    // 特定のランクマップを取得
    const rankMap = supportedGamesMap(game);

    return (
        <select name="rank" className="border w-64">
            {rankMap?.map((item) => {
                if (isNaN(Number(item.key))) {
                    return true;
                }
                return (
                    <option key={item.key} value={item.value}>{item.value}</option>
                );
            })}
        </select>
    )
}