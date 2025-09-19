"use client"

import { Logout } from "@/app/actions/form-action";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import type { NextPage } from "next";
import { useRouter } from "next/navigation";
import { Suspense, useActionState, useEffect, useState } from "react";
import { getCookies } from "../actions/action";
import { GameSearch } from "../actions/game-action";
import Loading from "../loading";

const Game: NextPage = () => {
    const router = useRouter();
    const [username, setUsername] = useState(String);
    const [game, setGame] = useState('');
    const [rank, setRank] = useState('');
    const [search, setSearch] = useState(Array);
    const [state, searchAction, isPending] = useActionState(GetSearch, null);
    
    const data = (async () => {
        const cookies = await getCookies();
        setUsername(cookies.name);
    });

    useEffect(() => {
        data();
    }, [username]);

    // 検索
    async function GetSearch() {
        const getData = await GameSearch(game, rank);
        setSearch(getData!);
    }

    return (
        <>
            <title>ゲーム一覧</title>
            <div className="h-screen flex">
                <div className="flex-1 flex flex-col">
                    <Header title={"ゲーム 一覧"} username={username ? username : ""} onClick={(() => Logout())} />
                    <div className="flex-1 flex overflow-hidden">
                        <Sidebar />
                        <form className="flex-1 flex flex-col" action={searchAction}>
                            <div className="h-full items-center">
                                <div className="flex p-5 justify-center">

                                    <div className="flex items-center pr-5">
                                        <div className="pr-5">ゲーム</div>
                                        <input className="border" name="game" defaultValue={game} onChange={(e) => setGame(e.target.value)}></input>
                                    </div>

                                    <div className="flex items-center pr-5">
                                        <div className="pr-5">ランク</div>
                                        <input className="border" name="rank" defaultValue={rank} onChange={(e) => setRank(e.target.value)}></input>
                                    </div>

                                    <div className="flex">
                                        <div className="pl-5">
                                            <Button type="submit" disabled={isPending}>
                                                {isPending ? "検索中..." : "検索"}
                                            </Button>
                                        </div>

                                        <div className="pl-5">
                                            <Button onClick={(() => router.push("/game/register"))}>新規登録</Button>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full h-full p-10">    
                                    <div className="w-full p-1 bg-gray-600/20 mb-5">{`検索結果：${search !== undefined ? search.length + "件" : "なし"}`}</div>
                                    {search !== undefined ? <SearchTable data={search} /> : <div></div>}
                                    
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Game

function SearchTable({ data } : any) {

    return (
        <Suspense fallback={<Loading />}>
            <table className="w-full">
                <thead>
                    <tr>
                        <th className="w-[500px] bg-blue-700/20 text-center">ゲームタイトル</th>
                        <th className="w-[200px] bg-blue-700/50">ランク</th>
                        <th className="w-[70px] bg-blue-700/30"></th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((value: { rank: String; game: String; }, idx: any) => {
                        return (
                            <tr key={idx}>
                                <th>{value.game}</th>
                                <th>{value.rank}</th>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </Suspense>
    )
}