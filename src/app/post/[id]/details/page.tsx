import { getCookies } from "@/app/actions/action";
import { getCommentList } from "@/app/actions/comment-action";
import { GameListSearch } from "@/app/actions/game-action";
import { getPost } from "@/app/actions/post-action";
import { Sidebar } from "@/components/layout/sidebar";
import { DeleteButton, ModalButton, ReturnButton, UpdateButton } from "@/components/ui/button";
import { dateformat } from "@/constants/dateFormat";
import type { CommentsWithUsers } from "@/types";
import { redirect } from "next/navigation";

interface CommentProps {
    data: CommentsWithUsers[],
    userId: number;
}

interface detailsProp {
    params: Promise<{ id: number }>,
    searchParams: Promise<{ gameTag: string }>
}

export default async function details({ params, searchParams }: detailsProp) {
    const postId = (await params).id;
    const gameTag = (await searchParams).gameTag;

    // 投稿の詳細取得
    const posts = await getPost(postId, gameTag);

    if (posts === null) {
        return redirect("/post");
    }

    // 投稿のランク取得
    const postRank = posts.user.games ? posts.user.games[0]?.rank : "";

    // ログインユーザー取得
    const cookies = await getCookies();
    const userId = cookies?.id;

    // 投稿のゲームで自身のランクを取得
    const myGames = await GameListSearch(gameTag, "");
    const game = myGames ? myGames[0]?.name : "";
    const rank = myGames ? myGames[0]?.rank : "";

    // 投稿に紐づいているコメントすべて取得
    const comments = await getCommentList(postId, gameTag);

    return (
        <>
            <title>投稿 詳細</title>
            <div className="flex h-main overflow-hidden">
                <Sidebar />
                <div className="w-full p-7 overflow-y-scroll">
                    <div className="flex flex-row justify-between">
                        <h1 className="text-3xl w-[850px]">{posts.title}</h1>

                        <div className="flex flex-col justify-end items-end ">
                            <h1 className="text-[13px] text-gray-500">投稿日：{dateformat(posts.createdAt)}</h1>
                            <h1 className="text-[13px] text-gray-500">投稿更新日：{dateformat(posts.updatedAt)}</h1>
                        </div>
                    </div>

                    <div className="w-full mt-3 mb-5 p-3 leading-6 whitespace-pre-wrap">{posts.content}</div>

                    <div className="flex text-sm text-gray-500 justify-end">
                        <div className="row">投稿者: {posts.user.name}</div>
                        <div className="row pl-3">ゲーム: {posts.gameTag}</div>
                        {postRank === undefined ? <div className="row pl-3">ランク: 表示なし</div> :
                            <div className="row pl-3">ランク: {postRank}</div>}

                    </div>

                    <div className="border-t w-full mt-3 mb-5"></div>

                    <h1 className="font-bold mb-5">コメント</h1>

                    <div className="border-1 h-[280px] p-3 overflow-y-scroll">
                        <Comment data={comments} userId={userId!} />
                    </div>

                    <div className="flex mt-7">
                        <div className="flex-1"><ReturnButton type={"post"} /></div>
                        <div className="flex justify-end">
                            {game === gameTag ? <ModalButton className={userId == posts.userId ? "mr-5" : ""}
                                data={{ id: postId, userId: userId!, postRank: postRank, yourRank: rank, game: game }} /> : ""}
                            {userId == posts.userId ? <UpdateButton type={"post"} id={Number(postId)} /> : ""}
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
            {data.length > 0 ? data.map((value: any, idx: number) => {

                const date = dateformat(value.createdAt);
                const commentGames = value.user.games;

                return (
                    <div key={idx}>
                        <div className="flex text-xs p-3" >
                            <div className="row">ユーザ名：{value.hiddenFlg ? "匿名ユーザー" : value.user.name}</div>
                            <div className="row pl-3">コメント日：{date}</div>
                            <div className="row pl-3">ランク：{value.dispRankFlg ? "非表示" : commentGames.length != 0 ? commentGames[0].rank : "表示なし" }</div>
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