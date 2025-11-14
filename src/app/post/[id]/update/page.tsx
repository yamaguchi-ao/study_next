"use client"

import { getPost, postUpdate } from "@/app/actions/post-action";
import { Sidebar } from "@/components/layout/sidebar";
import { Button, ReturnButton } from "@/components/ui/button";
import { use, useActionState, useEffect, useState } from "react";

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
        async function getPosts() {
            const posts = await getPost(postId);
            setTitle(posts.title);
            setPost(posts.content);
            setGameTag(posts.gameTag);
        }
        getPosts();
    }, [params, postId]);

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
                            <div className="font-bold">タイトル 入力</div>
                            <input className="mt-2 mb-2 w-[400px] h-[50px] p-2 border-1" name="title" defaultValue={title}
                                onChange={(e) => setTitle(e.target.value)}></input>
                            {state?.title ? errorText(state?.title) : null}
                        </div>

                        <div className="row pl-20">
                            <div className="font-bold">ゲームタグ</div>
                            <h1 className="text-2xl pl-20 m-3">{gameTag}</h1>
                        </div>
                    </div>

                    <div className="font-bold">投稿内容</div>
                    <textarea name="post" placeholder="投稿の内容を入力..." className="border-1 w-full h-[350px] mt-3 mb-5 p-3"
                        defaultValue={post} onChange={(e) => setPost(e.target.value)}></textarea>
                    {state?.post ? errorText(state?.post) : null}

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