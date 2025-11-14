import { getCookies } from "@/app/actions/action";
import { getPost } from "@/app/actions/post-action";
import { Sidebar } from "@/components/layout/sidebar";
import { ReturnButton, UpdateButton } from "@/components/ui/button";

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
                <div className="w-full p-7" >
                    <div className="flex">
                        <div className="row">
                            <div className="font-bold">タイトル</div>
                            <h1 className="text-2xl pl-20 m-3">{posts.title}</h1>
                        </div>

                        <div className="row pl-20">
                            <div className="font-bold">ゲームタグ</div>
                            <h1 className="text-2xl pl-20 m-3">{posts.gameTag}</h1>
                        </div>
                    </div>

                    <div className="font-bold">投稿内容</div>
                    <div className="border-1 w-full h-[350px] mt-3 mb-5 p-3">{posts.content}</div>

                    <div className="flex justify-between">
                        <ReturnButton type={"/post"} />
                        { userId == posts.userId ? <UpdateButton type={"post"} id={postId} /> : ""}
                    </div>
                </div>
            </div>
        </>
    );
}