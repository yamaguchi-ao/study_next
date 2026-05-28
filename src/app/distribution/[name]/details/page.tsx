"use client"

import { supportedGamesMap } from "@/constants/context";
import { useEffect } from "react";

interface DetailDistributionData {
    name?: string;
    rank?: string | null;
    user?: {
        id: number;
    };
}

// ランクの表示用
export default function DisplayData({ id, name, data }: { id: number, name: string; data: DetailDistributionData[] }) {

    // enumで設定しているランク表を取得
    const rankMap = supportedGamesMap(name!);
    // データから自身のランクを取得
    const myRank = data.find((item) => item.user?.id === Number(id))?.rank;

    // ランク表の表示用
    const diff = 17;
    const size = 60;

    useEffect(() => {
        // 該当する自分のランクの位置にスクロールする
        const myRank = document.getElementById("myRank");
        myRank?.scrollIntoView({
            behavior: 'smooth',
            block: "center"
        })
    });

    return (
        <div className={`flex h-full overflow-y-scroll ${rankMap ? "flex-col-reverse" : "flex-col items-center"}`}>
            {rankMap ? rankMap?.map((item, idx) => {
                if (isNaN(Number(item.key))) {
                    return null;
                }
                // ランク表のwidth
                const width = (idx - size) * -diff;
                // 自身のランクのboolean
                const isMyRank = item.value === myRank;
                // 各ランクに属するユーザー数
                const userCount = data.filter((result) => result.rank === item.value).length

                return (
                    <div key={idx} style={{ width: `${width}px`, animationIterationCount: 3 }} className={`p-2 m-1 rounded-md w-200`
                        + (isMyRank ? " bg-blue-400 text-white pulse" : " bg-gray-200")}>
                        <div className="flex justify-between items-center">
                            <p className={`text-lg font-bold`} id={`${isMyRank ? "myRank" : ""}`}>{item.value}{isMyRank ? " (あなたのランク)" : ""}</p>
                            <p className="text-sm">ユーザー数: {userCount}人</p>
                        </div>
                    </div>
                );
            }) : <p>ランクの分布が見つかりませんでした。</p>}
        </div>
    );
}
