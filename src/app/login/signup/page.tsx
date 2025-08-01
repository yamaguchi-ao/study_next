'use client'

import { RegisterAction } from "@/app/actions/form-action";
import { Button } from "@/components/ui/button";
import type { NextPage } from "next";
import { redirect } from "next/navigation";
import { useActionState } from "react";
import { useEffect } from "react";
import { errorToast, successToast } from "@/utils/toast";


const Register: NextPage = () => {
    const [state, formAction, isPending] = useActionState(RegisterAction, null);

    return (
        <div>
            <form className="flex flex-col justify-center items-center min-h-screen mx-10" action={formAction}>
                <div className="bg-cyan-50 p-22">
                    <div>
                        <h1 className="text-3xl">ユーザー 登録</h1>
                    </div>

                    <div className="mb-5">
                        <div className="">
                            <h1>ユーザーネーム</h1>
                        </div>
                        <input className="rounded-lg border-2 bg-white w-64 p-1" name="username"></input>
                    </div>

                    <div className="mb-5">
                        <div className="">
                            <h1>メールアドレス</h1>
                        </div>
                        <input className="rounded-lg border-2 bg-white w-64 p-1" name="email"></input>
                    </div>

                    <div className="mt-5">
                        <div>
                            <h1>パスワード</h1>
                        </div>
                        <input type="password" className="rounded-lg outline-2 bg-white w-64 p-1" name="password"></input>
                    </div>

                    <div className="mt-5 mb-20">
                        <div>
                            <h1>パスワード 再確認</h1>
                        </div>
                        <input type="password" className="rounded-lg outline-2 bg-white w-64 p-1" name="confirm"></input>

                    </div>

                    <div className="flex flex-row ">
                        <Button className="mt-4">
                            登録
                        </Button>

                        <Button className="mt-4" onClick={() => redirect('/login')}>
                            戻る
                        </Button>
                    </div>
                </div>

            </form>
        </div>
    );
}

export default Register