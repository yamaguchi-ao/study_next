"use client"

import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Logout } from "@/app/actions/form-action";
import { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { redirect, useRouter } from "next/navigation";
import { getCookies } from "@/app/actions/action";
import { postRegister } from "@/app/actions/post-action";

export default function List() {
  const router = useRouter();
  const [username, setUsername] = useState(String);

  const [state, postAction, isPending] = useActionState(postRegister, null);

  const data = (async () => {
    const cookies = await getCookies();
    setUsername(cookies.name);
  });

  useEffect(() => {
    data();
  }, [username]);

  return (
    <>
      <title>投稿</title>
      <div className="flex h-main overflow-hidden">
        <Sidebar />
        <form className="w-full p-7" action={postAction}>
          <div className="flex">
            <div className="font-bold">タイトル 入力</div>
          </div>

          <div className="flex">
            <input className="mt-2 mb-2 w-[400px] h-[50px] p-2 border-1" name="title"></input>
          </div>

          <div className="font-bold">投稿内容</div>
          <textarea name="post" placeholder="投稿の内容を入力..." className="border-1 w-full h-[350px] mt-3 mb-5 p-3"></textarea>

          <div className="flex justify-between">
            <Button onClick={() => redirect('/post')}>戻る</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "投稿中..." : "投稿"}
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}