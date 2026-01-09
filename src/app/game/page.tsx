"use client"

import { Sidebar } from "@/components/layout/sidebar";
import { Button, SearchButton } from "@/components/ui/button";
import type { NextPage } from "next";
import { useRouter } from "next/navigation";
import { Suspense, useActionState, useEffect, useState } from "react";
import { GameListSearch } from "../actions/game-action";
import Loading from "../loading";
import Link from "next/link";
import { Delete } from "@/utils/api/game";
import { errorToast, successToast } from "@/utils/toast";
import { CancelIcon } from "@/components/ui/icons";
import Modal from "@/components/ui/modal";

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
        const message = res?.message;

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
                                <SearchButton type="submit" disabled={isPending}></SearchButton>
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
    const [isOpen, setIsOpen] = useState(false);

    // 削除処理
    return (
        <>
            <Modal isOpen={isOpen} data={data} setIsOpenAction={setIsOpen} type="confirm"></Modal>
            <div className="grid grid-cols-5 justify-items-center gap-y-10">
                {data !== undefined ? data.map((value: { rank: String; name: String; id: number }, idx: any) => {
                    return (
                        <div key={value.id} className="flex-wrap transition delay-70 duration-300 hover:scale-110">
                            <div className="w-[11em] h-[8em] rounded-t-lg bg-sky-300">
                                <div className="relative -top-[5px] left-[150px] size-8 rounded-full bg-white">
                                    <CancelIcon className="relative size-7 rounded-full bg-gray-300 top-[2px] left-[2px] hover:fill-current hover:text-red-500" color="white"
                                        onClick={() => setIsOpen(true)} />
                                </div>
                            </div>{/* そのゲームに対応する画像みたいなのにする */}
                            <Link href={`game/${value.id}/details`} >
                                <div className="w-[11em] h-25 p-[13px] rounded-b-lg bg-gray-200 text-wrap">
                                    <p className="h-[50px] font-bold truncate">{value.name}</p>
                                    <p className="h-[50px] font-bold">{value.rank}</p>
                                </div>
                            </Link>
                        </div>
                    )
                }) : <></>}
            </div>
        </>
    );
}