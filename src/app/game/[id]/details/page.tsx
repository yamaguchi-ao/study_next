
import { getGame } from "@/app/actions/game-action";
import { Sidebar } from "@/components/layout/sidebar";
import { ReturnButton, UpdateButton } from "@/components/ui/button";

export default async function Detail({ params }: { params: Promise<{ id: Number }> }) {

    const gameId = (await params).id;
    const games = await getGame(gameId);

    return (
        <>
            <title>ゲーム 詳細</title>
            <div className="flex h-main overflow-hidden">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                    <div className="flex flex-col h-full justify-center items-center">
                        <div className="">
                            <div className="flex pb-10">
                                <div className="w-35">ゲームタイトル</div>
                                <h1 className="text-2xl pl20">{games?.name}</h1>
                            </div>
                            <div className="flex pb-10">
                                <div className="w-35">ランク</div>
                                <h1 className="text-2xl pl20">{games?.rank}</h1>
                            </div>
                            <div className="flex justify-around items-end">
                                <ReturnButton type={"/game"} />
                                <UpdateButton type={"game"} id={gameId} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}