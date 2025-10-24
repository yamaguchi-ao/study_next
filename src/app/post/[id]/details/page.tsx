import { Sidebar } from "@/components/layout/sidebar";
import { Button, Update } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default async function details({ params }: { params: Promise<{ title:string, post:string, id: number }> }) {
    const postId = (await params).id;
    const title = (await params).title;
    const post = (await params).post;

    return (
        <>
            <title>投稿 詳細</title>
            <div className="flex h-main overflow-hidden">
                <Sidebar />
                <div className="w-full p-7" >
                    <div className="flex">
                        <div className="font-bold">タイトル 入力</div>
                    </div>

                    <div className="flex">
                        <div className="mt-2 mb-2 w-[400px] h-[50px] p-2 border-1">{title}</div>
                    </div>

                    <div className="font-bold">投稿内容</div>
                    <div className="border-1 w-full h-[350px] mt-3 mb-5 p-3">{post}</div>

                    <div className="flex justify-between">
                        <Button onClick={() => redirect('/post')}>戻る</Button>
                        <Update type={"post"} id={postId}></Update>
                    </div>
                </div>
            </div>
        </>
    );
}