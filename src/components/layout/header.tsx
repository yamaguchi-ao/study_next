"use client"

import { Button } from "../ui/button";
import Image from "next/image";
import icon from "@/public/test_icon.png"

// ヘッダー
export function Header({ title, username, onClick }: any) {
    return (
        <header>
            <div className="w-auto h-15 bg-cyan-500/50 flex justify-between items-center">
                <div className="flex items-center">
                    <Image src={icon} alt="" width={50} height={50} className="pl-5" />
                    <h1 className="pl-5 text-2xl">{title}</h1>
                </div>
                <div className="flex pr-5 items-center">
                    <h2 className="pr-5">{username}</h2>
                    <Button className="" onClick={onClick} >
                        ログアウト
                    </Button>
                </div>
            </div>
        </header>
    );
}