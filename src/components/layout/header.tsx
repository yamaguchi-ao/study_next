"use client"

import { Button } from "../ui/button";
import Image from "next/image";
import icon from "@/public/test_icon.png"
import { Username } from "../ui/username";
import { LogOutIcon } from "../ui/icons";
import { UserNameType } from "@/types";
import { Logout } from "@/app/actions/form-action";

// ヘッダー
export function Header({ title, username }: UserNameType) {

    return (
        <header>
            <div className="w-auto h-15 bg-cyan-500/50 flex justify-between items-center">
                <div className="flex items-center">
                    <Image src={icon} alt="" width={50} height={50} className="pl-5" />
                    <h1 className="pl-5 text-2xl">{title}</h1>
                </div>
                <div className="flex pr-5 items-center">
                    <Username username={username} />
                    <Button onClick={() => Logout()}>ログアウト
                        <LogOutIcon className="ml-[5px] size-4" />
                    </Button>
                </div>
            </div>
        </header>
    );
}