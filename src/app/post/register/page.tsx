"use client"

import { Sidebar } from "@/components/layout/sidebar";
import { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { postRegister } from "@/app/actions/post-action";
import { GameListSearch } from "@/app/actions/game-action";

export default function List() {
  const [gameData, setGameData] = useState(Array);
  const [state, postAction, isPending] = useActionState(postRegister, null);

  useEffect(() => {
    async function getGames() {
      const games = await GameListSearch("", "");
      setGameData(games);
    }
    getGames();
  }, []);

  const errorText = (data: string[]) => {
    const list = [];
    for (let i = 0; i < data.length; i++) {
      list.push(<p key={i} className="p-1 text-xs text-red-600">{data[i]}</p>)
    }

    return list;
  }

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
              {state?.title ? errorText(state?.title) : null}
            </div>

            <div className="row pl-20">
              <div className="font-bold">ゲームタグ</div>
              <select className="mt-2 mb-2 w-[400px] h-[50px] p-2 border-1" name="game">
                <SelectGameTag data={gameData}></SelectGameTag>
              </select>
              {state?.game ? errorText(state?.game) : null}
            </div>
          </div>

          <div className="font-bold">投稿内容</div>
          <textarea name="post" placeholder="投稿の内容を入力..." className="border-1 w-full h-[350px] mt-3 mb-5 p-3"></textarea>
          {state?.post ? errorText(state?.post) : null}

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
    data.map((games: { name: string; id: number }) => {
      return (
        <option key={games.id} value={games.name}>{games.name}</option>
      )
    })
  );
}