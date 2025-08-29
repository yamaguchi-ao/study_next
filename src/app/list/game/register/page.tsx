"use client"

import { GameRegister } from "@/app/actions/game-action";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { errorToast, infoToast } from "@/utils/toast";
import type { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";

const GameRegist: NextPage = () => {
    const router = useRouter();
    const [token, setToken] = useState(false);
    const [name, setName] = useState(String);
    const [id, setId] = useState(Number);

    const [state, Register, isPending] = useActionState(
        async (_prev: any, formData: FormData) => {
            await GameRegister(_prev, formData, id);
        },
        null,
    );

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
            setId(userData.id);
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
            <title>ゲーム 登録</title>
            <div className="h-screen flex">
                <div className="flex-1 flex flex-col">
                    <Header title={"ゲーム 登録"} username={name} onClick={(() => logout())} />
                    <div className="flex-1 flex overflow-hidden">
                        <Sidebar />
                        <form className="flex-1 flex flex-col" action={Register}>
                            <div className="flex flex-col h-full justify-center items-center">
                                <div className="">
                                    <div className="flex pb-10">
                                        <div className="w-35">ゲームタイトル</div>
                                        <input className="border w-64" name="name"></input>
                                    </div>
                                    <div className="flex pb-10">
                                        <div className="w-35">ランク</div>
                                        <input className="border w-64" name="rank"></input>
                                    </div>
                                    <div className="flex justify-end items-end">
                                        <Button disabled={isPending} type="submit">
                                            {isPending ? "登録中..." : "登録"}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    ) : (<></>)
}

export default GameRegist