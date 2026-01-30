import { getCookies } from "@/app/actions/action";
import { getCommentList } from "@/app/actions/comment-action";
import { GameListSearch } from "@/app/actions/game-action";
import { getPost } from "@/app/actions/post-action";
import { Sidebar } from "@/components/layout/sidebar";
import { DeleteButton, ModalButton, ReturnButton, UpdateButton } from "@/components/ui/button";
import { dateformat } from "@/constants/dateFormat";
import type { CommentsWithUsers } from "@/types";

interface CommentProps {
    data: CommentsWithUsers[],
    userId: number;
}

export default async function details({ params }: { params: Promise<{ id: number }> }) {
    const postId = (await params).id;
    const posts = await getPost(postId);

    const cookies = await getCookies();
    const userId = cookies?.id;

    // 投稿のゲームで自身のランクを取得
    const myGames = await GameListSearch(posts!.gameTag, "");
    const game = myGames ? myGames[0]?.name : "";
    const rank = myGames ? myGames[0]?.rank : "";

    // 投稿に紐づいているコメントすべて取得
    const comments = await getCommentList(postId, posts!.gameTag);

    return (
        <>
            <title>投稿 詳細</title>
            <div className="flex h-main overflow-hidden">
                <Sidebar />
                <div className="w-full p-7 overflow-y-scroll">
                    <div className="flex flex-row justify-between">
                        <h1 className="text-3xl">{posts.title}</h1>

                        <div className="flex flex-col justify-end items-end mb-3">
                            <h1 className="text-[13px] text-gray-500">投稿日：{dateformat(posts.createdAt)}</h1>
                            <h1 className="text-[13px] text-gray-500">投稿更新日：{dateformat(posts.updatedAt)}</h1>
                        </div>
                    </div>

                    <div className="w-full mt-3 mb-5 p-3 leading-6 whitespace-pre-wrap">{posts.content}</div>

                    <div className="flex text-sm text-gray-500 justify-end">
                        <div className="row">投稿者: {posts.user.name}</div>
                        <div className="row pl-3">ゲーム: {posts.gameTag}</div>
                        <div className="row pl-3">ランク: {posts.user.games[0].rank}</div>
                    </div>

                    <div className="border-t w-full mt-3 mb-5"></div>

                    <h1 className="font-bold mb-5">コメント</h1>

                    <div className="border-1 h-[280px] p-3 overflow-y-scroll">
                        <Comment data={comments} userId={userId!} />
                    </div>

                    <div className="flex mt-7">
                        <div className="flex-1"><ReturnButton type="post" role="back" /></div>
                        <div className="flex justify-end">
                            {game === posts.gameTag ? <ModalButton className={userId == posts.userId ? "mr-5" : ""}
                                data={{ id: postId, userId: userId, postRank: posts.user.games[0].rank, yourRank: rank, game: game }} type={"comment"} /> : ""}
                            {userId == posts.userId ? <UpdateButton type={"post"} id={postId} role="update" /> : ""}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function Comment({ data, userId }: CommentProps) {
    return (
        <>
            {data.length > 0 ? data.map((value: any, idx: any) => {

                const date = dateformat(value.createdAt);

                return (
                    <div key={idx}>
                        <div className="flex text-xs p-3" >
                            <div className="row">ユーザ名：{value.hiddenFlg ? "匿名ユーザー" : value.user.name}</div>
                            <div className="row pl-3">コメント日：{date}</div>
                            <div className="row pl-3">ランク：{value.dispRankFlg ? "非表示" : value.user.games[0].rank}</div>
                        </div>
                        <div className="pl-7">{value.comment}</div>
                        <div className="flex justify-end mb-3">
                            {userId == value.user.id ? <DeleteButton type={"comment"} id={value.id} userId={userId} /> : ""}
                        </div>
                    </div>
                )
            }) :
                <>
                    <div className="text-center p-5 text-gray-500">コメントはまだありません。</div>
                </>}
        </>
    )
}