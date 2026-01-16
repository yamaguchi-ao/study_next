"use client"

import { RegisterAction } from "@/app/actions/form-action";
import { Button } from "@/components/ui/button";
import type { NextPage } from "next";
import { redirect } from "next/navigation";
import { useActionState } from "react";
import Image from "next/image";
import icon from "@/public/test_icon.png"

const Register: NextPage = () => {
    const [state, register, isPending] = useActionState(RegisterAction, null);

    // バリデーションメッセージ表示
    const errorText = (data: string[]) => {
        const list = [];
        for (let i = 0; i < data.length; i++) {
            list.push(<p key={i} className="pt-1 text-xs text-red-600">{data[i]}</p>)
        }

        return list;
    }

    return (
        <>
            <title>新規登録</title>
            <div className="flex h-full overflow-hidden">
                <form className="flex w-full bg-linear-to-tr from-violet-500 to-orange-300" action={register}>
                    <div className="flex-1 bg-black/20 blur-[5px]">
                        <Image src={icon} alt="" width={192} height={0} className="absolute w-[200px] h-[200px] bottom-0 left-0" />
                    </div>
                    <div className="flex justify-center items-center flex-col flex-1 px-7 pb-7 bg-white">
                        <div className="flex justify-center items-center flex-col mb-7">
                            <Image src={icon} alt="" width={50} height={0} className="mb-10" />
                            <h1 className="text-3xl">新規会員登録</h1>
                        </div>

                        <div className="h-85px mb-5">
                            <div className="mb-1">
                                <h1>ユーザーネーム</h1>
                            </div>
                            <input className={`border ${state?.username ? "border-red-600" : ""} w-64`} name="username"></input>
                            {state?.username ? errorText(state?.username) : null}
                        </div>

                        <div className="h-85px mb-5">
                            <div className="mb-1">
                                <h1>メールアドレス</h1>
                            </div>
                            <input className={`border ${state?.email ? "border-red-600" : ""} w-64`} name="email"></input>
                            {state?.email && state?.email.length > 1 ? errorText(state?.email) : null}
                        </div>

                        <div className="h-85px mb-5">
                            <div className="mb-1">
                                <h1>パスワード</h1>
                            </div>
                            <input type="password" className={`border ${state?.password ? "border-red-600" : ""} w-64`} name="password" autoComplete="new-password"></input>
                            {state?.password ? errorText(state?.password) : null}
                        </div>

                        <div className="h-85px mb-7">
                            <div className="mb-1">
                                <h1>パスワード 再確認</h1>
                            </div>
                            <input type="password" className={`border ${state?.confirm ? "border-red-600" : ""} w-64`} name="confirm" autoComplete="new-password"></input>
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
                    <div className="flex-1 bg-black/20 blur-[5px]"></div>
                </form>
            </div>
        </>
    );
}

export default Register