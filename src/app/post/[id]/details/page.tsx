import { getCookies } from "@/app/actions/action";
import { getPost } from "@/app/actions/post-action";
import { Sidebar } from "@/components/layout/sidebar";
import { Button, ModalButton, ReturnButton, UpdateButton } from "@/components/ui/button";

export default async function details({ params }: { params: Promise<{ id: number }> }) {
    const postId = (await params).id;
    const posts = await getPost(postId);

    const cookies = await getCookies();
    const userId = cookies?.id;

    return (
        <>
            <title>投稿 詳細</title>
            <div className="flex h-main overflow-hidden">
                <Sidebar />
                <div className="w-full p-7 overflow-y-scroll">
                    <div className="flex">
                        <div className="row">
                            <h1 className="text-3xl">{posts.title}</h1>
                        </div>
                    </div>

                    <div className="w-full mt-3 mb-5 p-3">{posts.content}</div>

                    <div className="flex text-sm text-gray-500 justify-end">
                        <div className="row">投稿者: {posts.user.name}</div>
                        <div className="row pl-3">ゲーム: {posts.gameTag}</div>
                        <div className="row pl-3">ランク: {posts.user.games[0].rank}</div>
                    </div>

                    <div className="border-t w-full mt-3 mb-5"></div>

                    <h1 className="font-bold mb-5">コメント</h1>

                    <div className="border-1 p-3">
                        <div className="flex text-xs p-3">
                            <div className="row">ユーザ名：test</div>
                            <div className="row pl-3">コメント日：2025/12/16 10:52:35</div>
                            <div className="row pl-3">ランク：ROOKIE</div>
                        </div>
                        <div className="pl-7">てすとだよ～</div>

                        <div className="flex justify-end">
                            {userId == posts.userId ? <Button className="mt-3">返信</Button> : ""}
                        </div>
                    </div>

                    <div className="flex">
                        <div className="flex-1 mt-5"><ReturnButton type="post" role="back" /></div>
                        <div className="flex justify-end mt-5">
                            <ModalButton className={userId == posts.userId ? "mr-5" : ""} data={{ postId, userId }} />
                            {userId == posts.userId ? <UpdateButton type={"post"} id={postId} role="update" /> : ""}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function comment() {
    

    return (
        <>
        </>
    )
}