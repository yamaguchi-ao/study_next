"use client"

import { Button } from "../ui/button";

// ヘッダー
export function Header({ title, onClick }: any) {
    return (
        <header>
            <div className="w-auto h-20 bg-cyan-600 flex justify-between">
                <h1 className="p-5 pl-10 text-2xl">{title}</h1>
                <div className="p-5">
                    <Button className="" onClick={onClick} >
                        ログアウト
                    </Button>
                </div>
            </div>
        </header>
    );
}