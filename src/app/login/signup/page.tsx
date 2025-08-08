"use client"

import { RegisterAction } from "@/app/actions/form-action";
import { Button } from "@/components/ui/button";
import type { NextPage } from "next";
import { redirect } from "next/navigation";
import { useActionState } from "react";

const Register: NextPage = () => {
    const [state, register, isPending] = useActionState(RegisterAction, null);

    // バリデーションメッセージ表示
    const errorText = (data: string[]) => {
        const list = [];
        for (let i = 0; i < data.length; i++) {
            list.push(<p key={i} className="p-1 text-xs text-red-600">{data[i]}</p>)
        }

        return list;
    }

    return (
        <>
            <title>新規登録</title>
            <div>
                <form className="flex flex-col justify-center items-center min-h-screen mx-10" action={register}>
                    <div className="bg-cyan-50 p-15">
                        <div>
                            <h1 className="text-3xl">ユーザー 登録</h1>
                        </div>

                        <div className="h-85px mb-5">
                            <div className="">
                                <h1>ユーザーネーム</h1>
                            </div>
                            <input className={`border ${state?.username ? "border-red-600" : ""} w-64`} name="username"></input>
                            {state?.username ? errorText(state?.username) : null}
                        </div>

                        <div className="h-85px mb-5">
                            <div className="">
                                <h1>メールアドレス</h1>
                            </div>
                            <input className={`border ${state?.email ? "border-red-600" : ""} w-64`} name="email"></input>
                            {state?.email && state?.email.length > 1 ? errorText(state?.email) : null}
                        </div>

                        <div className="h-85px mt-5">
                            <div>
                                <h1>パスワード</h1>
                            </div>
                            <input type="password" className={`border ${state?.password ? "border-red-600" : ""} w-64`} name="password"></input>
                            {state?.password ? errorText(state?.password) : null}
                        </div>

                        <div className="h-85px mt-5 mb-10">
                            <div>
                                <h1>パスワード 再確認</h1>
                            </div>
                            <input type="password" className={`border ${state?.confirm ? "border-red-600" : ""} w-64`} name="confirm"></input>
                            {state?.confirm ? errorText(state?.confirm) : null}
                        </div>

                        <div className="flex justify-center items-center gap-10 ">
                            <Button className="mt-4" type="submit" disabled={isPending}>
                                {isPending ? "登録中..." : "登録"}
                            </Button>

                            <Button className={`${isPending ? "bg-blue-400" : ""} mt-4`} onClick={() => redirect('/login')}>
                                戻る
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

export default Register