
import Image from "next/image";
import { getGame } from "@/app/actions/game-action";
import { Sidebar } from "@/components/layout/sidebar";
import { ReturnButton, UpdateButton } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default async function Detail({ params }: { params: Promise<{ id: number }> }) {

    const gameId = (await params).id;
    const games = await getGame(gameId);

    if (!games) {
        redirect("/game");
    }

    return (
        <>
            <title>ゲーム 詳細</title>
            <div className="flex h-main overflow-hidden">
                <Sidebar />
                <div className="flex flex-1 flex-col h-full p-5 justify-center">
                    <div className="flex justify-around items-center">
                        <div className="flex pb-10 items-center">
                            <div className="w-35">ランク画像</div>
                            {games?.filePath ? <Image className="mt-3" alt="ランクの証拠画像" src={games.filePath} width={300} height={300} />
                                : <p className="text-gray-500">画像なし</p>}
                        </div>
                        <div className="flex flex-col justify-center items-center pr-23">
                            <div className="flex pb-10 items-center">
                                <div className="w-35">ゲームタイトル</div>
                                <h1 className="text-2xl pl20">{games?.name}</h1>
                            </div>
                            <div className="flex pb-10 items-center">
                                <div className="w-35">ランク</div>
                                <h1 className="text-2xl pl20">{games?.rank}</h1>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-around items-end">
                        <ReturnButton />
                        <UpdateButton type={"game"} id={gameId} />
                    </div>
                </div>
            </div>
        </>
    )
}