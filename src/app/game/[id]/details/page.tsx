"use client"

import { GameUpdate } from "@/app/actions/game-action";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { gameSearch } from "@/utils/api/game";
import { redirect } from "next/navigation";
import { use, useActionState, useEffect, useState } from "react";

export default function Detail({ params }: { params: Promise<{ id: Number }> }) {

    const [rank, setRank] = useState(String);
    const gameId = use(params).id;

    const [state, updataAction, isPending] = useActionState(
        async (_prevState: any, formData: FormData) => {
            return await GameUpdate(_prevState, formData, gameId);
        },
        null
    );

    useEffect(() => {
    }, [gameId]);

    const errorText = (data: string[]) => {
        const list = [];
        for (let i = 0; i < data.length; i++) {
            list.push(<p key={i} className="p-1 text-xs text-red-600">{data[i]}</p>)
        }

        return list;
    }

    return (
        <>
            <title>ゲーム 詳細</title>
            <div className="flex h-main overflow-hidden">
                <Sidebar />
                <form className="flex-1 flex flex-col" action={updataAction}>
                    <div className="flex flex-col h-full justify-center items-center">
                        <div className="">
                            <div className="flex pb-10">
                                <div className="w-35">ゲームタイトル</div>
                                <TestGame gameId={gameId}></TestGame>
                                {state?.name ? errorText(state?.name) : null}
                            </div>
                            <div className="flex pb-10">
                                <div className="w-35">ランク</div>
                                <input className="border w-64" name="rank" value={rank} onChange={(e) => setRank(e.target.value)}></input>
                                {state?.rank ? errorText(state?.rank) : null}
                            </div>
                            <div className="flex justify-around items-end">
                                <Button onClick={() => redirect('/game')}>戻る</Button>
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

function TestGame({ gameId }: any) {
    const [game, setGame] = useState(String);

    useEffect(() => {
        gameSearch(gameId).then(data => {
            setGame(data?.data.name);
        });
    }, [gameId]);

    return <input className="border w-64" name="name" value={game} onChange={(e) => setGame(e.target.value)}></input>
}