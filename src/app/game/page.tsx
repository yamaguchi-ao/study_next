"use client"

import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import type { NextPage } from "next";
import { useRouter } from "next/navigation";
import { Suspense, useActionState, useEffect, useState } from "react";
import { getCookies } from "../actions/action";
import { GameListSearch } from "../actions/game-action";
import Loading from "../loading";
import Link from "next/link";
import { Delete } from "@/utils/api/game";
import { errorToast, successToast } from "@/utils/toast";

const Game: NextPage = () => {
    const router = useRouter();
    
    const [game, setGame] = useState('');
    const [rank, setRank] = useState('');
    const [search, setSearch] = useState(Array);
    const [state, searchAction, isPending] = useActionState(GetSearch, null);

    useEffect(() => {
        router.refresh();
    }, [router, search]);

    // 検索
    async function GetSearch() {
        const getData = await GameListSearch(game, rank);
        setSearch(getData!);
    }

    // 削除
    async function onDelete(gameId: number) {

        const res = await Delete(gameId);

        const success = res?.success;
        const message = res?.success;

        if (success) {
            // 成功時
            successToast(message);
            await GetSearch();
        } else {
            // 失敗時
            errorToast(message);
        }
    }

    return (
        <>
            <title>ゲーム一覧</title>
            <div className="flex h-main overflow-hidden">
                <Sidebar />
                <form className="flex-1 flex flex-col" action={searchAction}>
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
                    <div className="w-full p-5">
                        <div className="p-1 bg-gray-600/20 mb-5">{`検索結果：${search !== undefined ? search.length + "件" : "0件"}`}</div>
                        <Suspense fallback={<Loading />}>
                            <SearchTable data={search} onClick={onDelete} />
                        </Suspense>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Game

function SearchTable({ data, onClick }: any) {
    // 削除処理
    return (
        <table className="w-full">
            <thead>
                <tr className="border-1">
                    <th className="border-1 w-[50px] bg-blue-700/10">番号</th>
                    <th className="border-1 w-[500px] bg-blue-700/20 text-center">ゲームタイトル</th>
                    <th className="border-1 w-[200px] bg-blue-700/50">ランク</th>
                    <th className="border-1 w-[100px] bg-blue-700/30"></th>
                </tr>
            </thead>
            <tbody>
                {data !== undefined ? data.map((value: { rank: String; name: String; id: number }, idx: any) => {
                    return (
                        <tr key={value.id} className="border-1">
                            <td className="text-center">{idx + 1}</td>
                            <td className="text-center text-blue-400"><Link href={`game/${value.id}/details`} className="underline underline-offset-1">{value.name}</Link></td>
                            <td className="text-center">{value.rank}</td>
                            <td className="justify-items-center"><Button onClick={() => onClick(value.id)}>削除</Button></td>
                        </tr>
                    )
                }) : <></>}
            </tbody>
        </table>
    );
}