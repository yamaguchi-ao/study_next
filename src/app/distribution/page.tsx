"use client"

import { Sidebar } from "@/components/layout/sidebar";
import { getDistribution } from "@/utils/api/distribution";
import { errorToast } from "@/utils/toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type GameDistributionData = {
    name: string;
    userCount: number;
    hasGame: boolean;
}[];

/** 分布ページ */
export default function Distribution() {
    const router = useRouter();
    const [game, setGame] = useState<GameDistributionData | null>(null);

    useEffect(() => {
        getGames();
    }, []);

    // 登録されているゲームを取得
    async function getGames() {
        const data = await getDistribution();

        if (data.success && data?.data) {
            // 取得出来た場合且つデータがある場合
            setGame(data.data);
        } else {
            // それ以外の場合
            errorToast(data.message ?? "分布の取得に失敗しました。");
            router.push("/login?error=true");
        }
    }

    return (
        <div>
            <title>全体の分布</title>
            <div className="flex h-main overflow-hidden">
                <Sidebar />
                <div className="flex-1 p-4 overflow-y-scroll">
                    <div>
                        <h1 className="text-2xl font-bold mb-4">現在登録されているゲームタイトル：{game?.length ? `${game.length}タイトル` : ""}</h1>
                    </div>
                    {game ? <GameDistribution data={game} /> : <p>現在登録されているゲームタイトルはありません。</p>}
                </div>
            </div>
        </div>
    );
}

/** 各ゲームの分布 */
function GameDistribution({ data }: { data: GameDistributionData }) {
    const router = useRouter();

    return (
        <>
            {data.map((game, idx) => {
                return (
                    <div key={idx} className="border-b border-gray-200 h-20 flex hover:bg-gray-100 items-center cursor-pointer"
                        onClick={() => router.push(`/distribution/${game.name}/details`)}>
                        <div className="flex items-center">
                            {game.hasGame ? <p className="pl-2 text-2xl text-yellow-500">☆</p> : null}
                            <p className="text-2xl pl-2">{game.name}</p>
                            <p className="pl-2">総ユーザー数: {game.userCount}人</p>
                        </div>
                    </div>
                );
            })}
        </>
    );
}