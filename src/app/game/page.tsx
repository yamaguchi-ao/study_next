"use client"

import { Logout } from "@/app/actions/form-action";
import { GameSearch } from "@/app/actions/game-action";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import type { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCookies } from "../actions/action";

const Game: NextPage = () => {
    const router = useRouter();
    const [username, setUsername] = useState(String);

    const data = (async () => {
        const cookies = await getCookies();
        setUsername(cookies.name);
    });

    useEffect(() => {
        data();
    }, [username]);

    return (
        <>
            <title>ゲーム一覧</title>
            <div className="h-screen flex">
                <div className="flex-1 flex flex-col">
                    <Header title={"ゲーム 一覧"} username={username ? username : ""} onClick={(() => Logout())} />
                    <div className="flex-1 flex overflow-hidden">
                        <Sidebar />
                        <form className="flex-1 flex flex-col" action={GameSearch}>
                            <div className="h-full items-center">
                                <div className="flex p-5 justify-center">

                                    <div className="flex items-center pr-5">
                                        <div className="pr-5">ゲーム</div>
                                        <input className="border" name="game"></input>
                                    </div>

                                    <div className="flex items-center pr-5">
                                        <div className="pr-5">ランク</div>
                                        <input className="border" name="rank"></input>
                                    </div>

                                    <div className="flex">
                                        <div className="pl-5">
                                            <Button>
                                                検索
                                            </Button>
                                        </div>

                                        <div className="pl-5">
                                            <Button onClick={(() => router.push("/game/register"))}>
                                                新規登録
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-center items-center">
                                    <p>test</p>
                                </div>
                                <table>
                                    <caption>

                                    </caption>
                                </table>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Game