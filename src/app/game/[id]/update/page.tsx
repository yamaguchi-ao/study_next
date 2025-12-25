"use client"

import { GameUpdate, getGame } from "@/app/actions/game-action";
import { Sidebar } from "@/components/layout/sidebar";
import { Button, ReturnButton } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { use, useActionState, useEffect, useState } from "react";

export default function UpdatePage({ params }: { params: Promise<{ id: number }> }) {
    const [name, setName] = useState(String);
    const [rank, setRank] = useState(String);
    const gameId = use(params).id;

    const [state, gameAction, isPending] = useActionState(
        async (_prevState: any, formData: FormData) => {
            return GameUpdate(_prevState, formData, gameId);
        }, null);

    useEffect(() => {
        async function getGames() {
            const games = await getGame(gameId);
            setName(games?.name);
            setRank(games?.rank);
        }
        getGames();
    }, [params, gameId]);

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
                <form className="flex-1 flex flex-col" action={gameAction}>
                    <div className="flex flex-col h-full justify-center items-center">
                        <div className="">
                            <div className="flex pb-10">
                                <div className="w-35">ゲームタイトル</div>
                                <h1 className="text-2xl pl20">{name}</h1>
                            </div>
                            <div className="flex pb-10">
                                <div className="w-35">ランク</div>
                                <input className="border w-64" name="rank" value={rank} onChange={(e) => setRank(e.target.value)}></input>
                                {state?.rank ? errorText(state?.rank) : null}
                            </div>
                            <div className="flex justify-around items-end">
                                <ReturnButton />
                                <Button disabled={isPending} type="submit">
                                    {isPending ? "更新中..." : "更新"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}