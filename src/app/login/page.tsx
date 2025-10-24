"use client"

import { Button } from "@/components/ui/button";
import type { NextPage } from "next";
import { LoginAction } from "@/app/actions/form-action";
import { useRouter, useSearchParams } from "next/navigation";
import { useActionState, useEffect } from "react";
import { errorToast } from "@/utils/toast";

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
            <div>
                <form className="flex flex-col justify-center items-center min-h-screen mx-10" action={Login}>
                    <div className="bg-cyan-50 p-22">
                        <div>
                            <h1 className="text-5xl">ログイン</h1>
                        </div>

                        <div className="mb-5">
                            <div className="">
                                <h1>メールアドレス</h1>
                            </div>
                            <input className={`border ${state?.email ? "border-red-600" : ""} w-64`} name="email"></input>
                            {state?.email ? errorText(state?.email) : null}
                        </div>

                        <div className="mt-5 mb-10">
                            <div>
                                <h1>パスワード</h1>
                            </div>
                            <input className={`border ${state?.password ? "border-red-600" : ""} w-64`} name="password" type="password"></input>
                            {state?.password ? errorText(state?.password) : null}
                        </div>

                        <div className="flex justify-center items-center gap-10">
                            <Button className="mt-4" type="submit" disabled={isPending}>
                                {isPending ? "ログイン中..." : "ログイン"}
                            </Button>

                            <Button className="mt-4" onClick={() => router.push('/login/signup')}>
                                新規登録
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

export default Login