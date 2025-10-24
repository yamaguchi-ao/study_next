"use client"

import { Sidebar } from "@/components/layout/sidebar";
import { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { redirect, useRouter } from "next/navigation";
import { postRegister } from "@/app/actions/post-action";
import { GameListSearch } from "@/app/actions/game-action";

export default function List() {
  const [data, setData] = useState(Array);
  const [state, postAction, isPending] = useActionState(postRegister, null);

  useEffect(() => {
    async function getGames() {
      const games = await GameListSearch("", "");
      setData(games);
    }
    getGames();
  }, []);
  
  return (
    <>
      <title>投稿</title>
      <div className="flex h-main overflow-hidden">
        <Sidebar />
        <form className="w-full p-7" action={postAction}>

          <div className="flex">
            <div className="row">
              <div className="font-bold">タイトル 入力</div>
              <input className="mt-2 mb-2 w-[400px] h-[50px] p-2 border-1" name="title"></input>
            </div>

            <div className="row pl-20">
              <div className="font-bold">ゲームタグ</div>
              <select className="mt-2 mb-2 w-[400px] h-[50px] p-2 border-1">
                <option>選択してください。</option>
                <SelectGameTag data={data}></SelectGameTag>
              </select>
            </div>
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

function SelectGameTag({ data }: any) {
  return (
    data.map((value: { name: String; id: number }) => {
      return (
        <option key={value.id}>{value.name}</option>
      )
    })
  );
}