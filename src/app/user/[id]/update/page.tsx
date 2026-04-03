"use client"

import { getCookies } from "@/app/actions/action";
import { getUserData, userDataUpdate } from "@/app/actions/user-action";
import { Sidebar } from "@/components/layout/sidebar";
import { Button, ReturnButton } from "@/components/ui/button";
import { errorToast } from "@/utils/toast";
import { redirect } from "next/navigation";
import { use, useActionState, useEffect, useState } from "react";

// ユーザー更新
export default function UserUpdate({ params }: { params: Promise<{ id: number }> }) {
    const [userName, setUserName] = useState(String);
    const [email, setEmail] = useState(String);
    const [loginId, setLoginId] = useState<Number | null>();
    const userId = use(params).id;

    const [state, userUpdateAction, isPending] = useActionState(
        async (_prevState: any, formData: FormData) => {
            return userDataUpdate(_prevState, formData);
        }, null);

    useEffect(() => {
        async function getUser() {
            const data = await getUserData(userId);
            const cookies = await getCookies();
            const loginId = cookies?.id;

            if (loginId !== Number(userId)) {
                errorToast("不正な遷移です。");
                return redirect("/post");
            }

            setLoginId(loginId);
            setUserName(data.name);
            setEmail(data.email);
        }
        getUser();
    }, [params, userId]);

    const errorText = (data: string[]) => {
        const list = [];
        for (let i = 0; i < data.length; i++) {
            list.push(<p key={i} className="p-1 text-xs text-red-600">{data[i]}</p>)
        }
        return list;
    }

    return (
        <>
            <title>ユーザー 更新</title>
            <div className="flex h-main overflow-hidden">
                <Sidebar />
                <div className="w-full p-7 flex justify-center items-center">
                    <form className="" action={userUpdateAction}>
                        <div className="flex pb-5 items-center">
                            <div className="w-56">ユーザー名：</div>
                            <div className="flex flex-col">
                                <input className="w-[325px] h-[50px] p-3 border-1" name="username" defaultValue={userName}
                                    onChange={(e) => setUserName(e.target.value)}></input>
                                {state?.username ? errorText(state?.username) : null}
                            </div>
                        </div>
                        <div className="flex pb-5 items-center">
                            <div className="w-56">メールアドレス：</div>
                            <div className="flex flex-col">
                                <input className="w-[325px] h-[50px] p-3 border-1" name="email" defaultValue={email}
                                    onChange={(e) => setEmail(e.target.value)}></input>
                                {state?.email ? errorText(state?.email) : null}
                            </div>
                        </div>

                        <div className="flex pb-5 items-center">
                            <div className="w-56">現在のパスワード：</div>
                            <div className="flex flex-col">
                                <input className="w-[325px] h-[50px] p-3 border-1" name="password" type="password" placeholder="現在のパスワードを入力"></input>
                                {state?.password ? errorText(state?.password) : null}
                            </div>
                        </div>

                        <div className="flex pb-5 items-center">
                            <div className="w-56">新しいパスワード：</div>
                            <div className="flex flex-col">
                                <input className="w-[325px] h-[50px] p-3 border-1" name="newPassword" type="password" placeholder="新しいパスワードを入力"></input>
                                {state?.newPassword ? errorText(state?.newPassword) : null}
                            </div>
                        </div>

                        <div className="flex pb-10 items-center">
                            <div className="w-56">パスワード確認：</div>
                            <div className="flex flex-col">
                                <input className="w-[325px] h-[50px] p-3 border-1" name="confirm" type="password" placeholder="新しいパスワードを再入力"></input>
                                {state?.confirm ? errorText(state?.confirm) : null}
                            </div>
                        </div>

                        <div className="flex justify-between">
                            <ReturnButton />
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "更新中..." : "更新"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}