"use client"

import { getUpdatePost, postUpdate } from "@/app/actions/post-action";
import { Sidebar } from "@/components/layout/sidebar";
import { Button, ReturnButton } from "@/components/ui/button";
import { errorToast } from "@/utils/toast";
import { redirect } from "next/navigation";
import { use, useActionState, useEffect, useState } from "react";
import img from "@/public/uploads/61917552-e141-406b-a673-6074f33886b6.png"
import Image from "next/image";

export default function UpdatePage({ params }: { params: Promise<{ id: number }> }) {
    const [title, setTitle] = useState(String);
    const [post, setPost] = useState(String);
    const [gameTag, setGameTag] = useState(String);
    const postId = use(params).id;

    const [state, postAction, isPending] = useActionState(
        async (_prevState: any, formData: FormData) => {
            return postUpdate(_prevState, formData, postId);
        }, null);

    useEffect(() => {
        // 更新する投稿内容の取得
        async function getPosts() {
            const posts = await getUpdatePost({ postId: postId });
            if (!posts) {
                errorToast("不正な遷移です。");
                redirect("/post");
            }
            setTitle(posts?.title);
            setPost(posts?.content!);
            setGameTag(posts?.gameTag!);
        }
        getPosts();
    }, [params, postId]);

    // バリデーションエラーメッセージ
    const errorText = (data: string[]) => {
        const list = [];
        for (let i = 0; i < data.length; i++) {
            list.push(<p key={i} className="p-1 text-xs text-red-600">{data[i]}</p>)
        }

        return list;
    }

    return (
        <>
            <title>投稿 更新</title>
            <div className="flex h-main overflow-hidden">
                <Sidebar />
                <form className="w-full p-7" action={postAction}>
                    <div className="flex">
                        <div className="row">
                            <div className="font-bold">タイトル 編集</div>
                            <input className="mt-3 mb-3 w-[400px] h-[50px] p-3 border-1" name="title" defaultValue={title}
                                onChange={(e) => setTitle(e.target.value)}></input>
                            {state?.title ? errorText(state?.title) : null}
                        </div>
                        <div className="row pl-20">
                            <div className="font-bold">画像 再添付</div>
                            <input className="cursor-pointer file:px-4 file:mr-4 file:pr-4 file:py-1 file:border-r-1 file:bg-cyan-500/30 rounded-md border-1 mt-3 w-140" name="file" type="file"></input>
                            {state?.file ? errorText(state?.file) : null}
                        </div>
                    </div>

                    <div className="font-bold pt-3">投稿内容 編集</div>
                    <textarea name="post" placeholder="投稿の内容を入力..." className="border-1 w-full h-[290px] mt-3 mb-3 p-3 resize-none leading-4"
                        defaultValue={post} onChange={(e) => setPost(e.target.value)}></textarea>
                    {state?.post ? errorText(state?.post) : null}

                    <div className="flex text-sm text-gray-500 justify-end">
                        <div className="row pl-3">ゲーム: {gameTag}</div>
                    </div>

                    <div className="border-t w-full mt-3 mb-5"></div>

                    <Image alt="" src={'/test_icon.png'} width={50} height={50}/>

                    <div className="flex justify-between">
                        <ReturnButton />
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "投稿更新中..." : "更新"}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    )
}