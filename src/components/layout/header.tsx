"use client"

import { Button } from "../ui/button";
import Image from "next/image";
import icon from "@/public/test_icon.png"
import { Username } from "../ui/username";
import { LogOutIcon } from "../ui/icons";
import { UserNameType } from "@/types";
import { redirect, usePathname } from "next/navigation";
import { Logout } from "@/utils/api/auth";
import { successToast } from "@/utils/toast";
import { navigation, pageName } from "@/constants/context";

// ヘッダー
export function Header({ username, userId }: UserNameType) {

    const pathname = usePathname();
    const title = navigation.find((item) => pathname.startsWith(item.href))?.name;
    const pagename = pageName.find((item) => pathname.endsWith(item.physics!))?.logical ?? "一覧";

    async function logoutButton() {
        const res = await Logout();
        const success = res?.success;
        const message = res?.message;

        // ログアウト
        if (success) {
            successToast(message);
            redirect("/login");
        }
    }

    return (
        <header>
            <div className="w-auto h-15 bg-cyan-500/50 flex justify-between items-center">
                <div className="flex items-center">
                    <Image src={icon} alt="" width={50} height={50} className="pl-5" />
                    <h1 className="pl-5 text-2xl">{title + " " + pagename}</h1>
                </div>
                <div className="flex pr-5 items-center">
                    <Username username={username} userId={userId} />
                    <Button onClick={() => logoutButton()}>ログアウト
                        <LogOutIcon className="ml-[5px] size-4" />
                    </Button>
                </div>
            </div>
        </header>
    );
}