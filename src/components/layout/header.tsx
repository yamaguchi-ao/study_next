"use client"

import { Button } from "../ui/button";
import Image from "next/image";
import icon from "@/public/test_icon.png"
import { Username } from "../ui/username";
import { LogOutIcon } from "../ui/icons";
import { UserNameType } from "@/types";
import { Logout } from "@/app/actions/form-action";
import { usePathname } from "next/navigation";

// ヘッダー
export function Header({ username, userId }: UserNameType) {

    const pathname = usePathname();
    let title = null;
    let pagename = null;

    if (pathname === "/") {
        title = pagename;
    } else if (pathname.startsWith("/game")) {
        title = "ゲーム";
    } else if (pathname.startsWith("/post")) {
        title = "投稿";
    } else if (pathname.startsWith("/user")) {
        title = "ユーザー";
    }

    if (pathname.includes("details")) {
        pagename = title + " 詳細";
    } else if (pathname.includes("update")) {
        pagename = title + " 更新";
    } else if (pathname.includes("register")) {
        pagename = title + " 登録";
    } else {
        pagename = title + " 一覧";
    }

    return (
        <header>
            <div className="w-auto h-15 bg-cyan-500/50 flex justify-between items-center">
                <div className="flex items-center">
                    <Image src={icon} alt="" width={50} height={50} className="pl-5" />
                    <h1 className="pl-5 text-2xl">{pagename}</h1>
                </div>
                <div className="flex pr-5 items-center">
                    <Username username={username} userId={userId} />
                    <Button onClick={() => Logout()}>ログアウト
                        <LogOutIcon className="ml-[5px] size-4" />
                    </Button>
                </div>
            </div>
        </header>
    );
}