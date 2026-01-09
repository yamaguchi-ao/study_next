"use client"

import { Button } from "@/components/ui/button";
import type { NextPage } from "next";
import { LoginAction } from "@/app/actions/form-action";
import { useRouter, useSearchParams } from "next/navigation";
import { useActionState, useEffect } from "react";
import { errorToast } from "@/utils/toast";
import Image from "next/image";
import icon from "@/public/test_icon.png"
import Link from "next/link";

const Login: NextPage = () => {
    const router = useRouter();
    const [state, Login, isPending] = useActionState(LoginAction, null);
    const param = useSearchParams();
    const errorCode = param.get("error");

    // バリデーションメッセージ表示
    const errorText = (data: string[]) => {
        const list = [];
        for (let i = 0; i < data.length; i++) {
            list.push(<p key={i} className="p-1 text-xs text-red-600">{data[i]}</p>)
        }

        return list;
    }

    useEffect(() => {
        if (errorCode) {
            errorToast("ログインしていません。");
        }

        const newSearchParams = new URLSearchParams(window.location.search);
        newSearchParams.delete("error");
        router.replace(
            `${window.location.pathname}?${newSearchParams.toString()}`);

        router.refresh();
    }, [errorCode, router]);

    return (
        <>
            <title>ログイン</title>
            <div className="flex h-full overflow-hidden">
                <form className="flex w-full bg-linear-to-bl from-sky-300 to-indigo-500" action={Login}>
                    {/* 左側ののレイアウト */}
                    <div className="flex-1 p-10 bg-white">
                        <div className="flex flex-col">

                            <div className="flex flex-col justify-center items-center mb-10">
                                <Image src={icon} alt="" width={50} height={0} className="mb-10" />
                                <h1 className="text-3xl">ログイン</h1>
                            </div>

                            <div className="ml-5 mb-7">
                                <div className="mb-2">
                                    <h1>メールアドレス</h1>
                                </div>
                                <input className={`border ${state?.email ? "border-red-600" : ""} w-64`} name="email"></input>
                                {state?.email ? errorText(state?.email) : null}
                            </div>

                            <div className="ml-5 mb-7">
                                <div className="mb-2">
                                    <h1>パスワード</h1>
                                </div>
                                <input className={`border ${state?.password ? "border-red-600" : ""} w-64`} name="password" type="password"></input>
                                {state?.password ? errorText(state?.password) : null}
                            </div>

                            <div className="flex justify-center">
                                <Button className="mt-5" type="submit" disabled={isPending}>
                                    {isPending ? "ログイン中..." : "ログイン"}
                                </Button>
                            </div>

                            <div className="mt-10 border-t border-x-50 border-gray-400 "></div>

                            <p className="flex justify-center items-center mt-10">新規会員登録は
                                <Link href={"/login/signup"} className="underline underline-offset-1 text-blue-500">こちら</Link>から</p>
                        </div>
                    </div>

                    {/* 右側のレイアウト */}
                    <div className="flex-3 bg-black/20 blur-[5px]">
                        <Image src={icon} alt="" width={192} height={0} className="absolute w-[200px] h-[200px] bottom-0 right-0" />
                        <div className="flex justify-center items-center">
                            
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

export default Login