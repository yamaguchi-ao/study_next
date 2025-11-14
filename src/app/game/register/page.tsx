"use client"

import { GameRegister } from "@/app/actions/game-action";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import type { NextPage } from "next";
import { redirect } from "next/navigation";
import { useActionState, useEffect } from "react";

const GameRegist: NextPage = () => {
    
    useEffect(() => {
    }, []);

    const [state, Register, isPending] = useActionState(GameRegister, null);

    const errorText = (data: string[]) => {
        const list = [];
        for (let i = 0; i < data.length; i++) {
            list.push(<p key={i} className="p-1 text-xs text-red-600">{data[i]}</p>)
        }

        return list;
    }

    return (
        <>
            <title>ゲーム 登録</title>
            <div className="flex h-main overflow-hidden">
                <Sidebar />
                <form className="flex-1 flex flex-col" action={Register}>
                    <div className="flex flex-col h-full justify-center items-center">
                        <div className="">
                            <div className="flex pb-10">
                                <div className="w-35">ゲームタイトル</div>
                                <input className="border w-64" name="name"></input>
                                {state?.name ? errorText(state?.name) : null}
                            </div>
                            <div className="flex pb-10">
                                <div className="w-35">ランク</div>
                                <input className="border w-64" name="rank"></input>
                                {state?.rank ? errorText(state?.rank) : null}
                            </div>
                            <div className="flex justify-around items-end">
                                <Button onClick={() => redirect('/game')}>
                                    戻る
                                </Button>

                                <Button disabled={isPending} type="submit">
                                    {isPending ? "登録中..." : "登録"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default GameRegist