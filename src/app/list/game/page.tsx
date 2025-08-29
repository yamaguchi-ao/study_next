"use client"

import { GameSearch } from "@/app/actions/game-action";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { errorToast, infoToast } from "@/utils/toast";
import type { NextPage } from "next";
import { redirect, useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";

const Game: NextPage = () => {
    const router = useRouter();
    const [token, setToken] = useState(false);
    const [name, setName] = useState(String);

    const [state, Search, isPending] = useActionState(GameSearch, null);

    useEffect(() => {
        // ローカルストレージにある情報取得
        const signIn = localStorage.getItem("access_token");

        if (!signIn) {
            // 無いならログインに戻る
            errorToast("ログインしていません。");
            router.replace('/login');
        } else {
            // JWTからペイロードのみを取得
            const payload = signIn?.split('.')[1];

            // JWTをデコード
            const decodePayload = atob(payload!);

            // 元がJSONなのでパース
            const userData = JSON.parse(decodePayload);

            setName(userData.name);
            setToken(true);
        }
    }, [router]);

    const logout = () => {
        localStorage.removeItem("access_token");
        infoToast("ログアウトしました。");
        router.push("/login");
    }

    return token ? (
        <>
            <title>ゲーム一覧</title>
            <div className="h-screen flex">
                <div className="flex-1 flex flex-col">
                    <Header title={"ゲーム 一覧"} username={name} onClick={(() => logout())} />
                    <div className="flex-1 flex overflow-hidden">
                        <Sidebar />
                        <form className="flex-1 flex flex-col" action={Search}>
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
                                            <Button onClick={(() => router.push("/list/game/register"))}>
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
    ) : (<></>)
}

export default Game