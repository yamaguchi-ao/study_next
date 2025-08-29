"use client"

import { Button } from "../ui/button";

// ヘッダー
export function Header({ title, username, onClick }: any) {
    return (
        <header>
            <div className="w-auto h-15 bg-cyan-600 flex justify-between items-center">
                <h1 className="p-5 pl-10 text-2xl">{title}</h1>
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