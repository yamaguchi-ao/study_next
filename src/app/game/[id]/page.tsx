"use client"

import { getCookies } from "@/app/actions/action";
import { Logout } from "@/app/actions/form-action";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import type { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Detail: NextPage = () => {
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
            <title></title><div className="h-screen flex">
                <div className="flex-1 flex flex-col">
                    <Header title={"ゲーム 一覧"} username={username ? username : ""} onClick={(() => Logout())} />
                    <div className="flex-1 flex overflow-hidden">
                        <Sidebar />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Detail