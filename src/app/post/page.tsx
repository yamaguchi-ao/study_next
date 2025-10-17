"use client"

import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Logout } from "../actions/form-action";
import { useEffect, useState } from "react";
import { getCookies } from "../actions/action";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


export default function List() {
  const router = useRouter();
  const [username, setUsername] = useState(String);
  const [game, setGame] = useState(String);

  const data = (async () => {
    const cookies = await getCookies();
    setUsername(cookies.name);
  });

  useEffect(() => {
    data();
  }, [username]);

  return (
    <>
      <title>投稿 一覧</title>
      <div className="flex h-main overflow-hidden">
        <Sidebar />
        <form className="flex-1 flex flex-col">
          <div className="flex p-5 justify-center">
            <div className="flex items-center pr-5">
              <div className="pr-5">ゲーム</div>
              <input className="border" name="game" defaultValue={game} onChange={(e) => setGame(e.target.value)}></input>
            </div>

            <div className="flex">
              <div className="pl-5">
                <Button type="submit">検索</Button>
              </div>

              <div className="pl-5">
                <Button onClick={(() => router.push("/post/register"))}>新規登録</Button>
              </div>
            </div>
          </div>

          <div className="w-full p-5">
            <div className="p-1 bg-gray-600/20 mb-5">検索結果：0件</div>

            <table className="w-full">
              <thead>
                <tr className="border-1">
                  <th className="border-1 w-[50px] bg-blue-700/10">番号</th>
                  <th className="border-1 w-[100px] bg-blue-700/20">ゲームタイトル</th>
                  <th className="border-1 w-[300px] bg-blue-700/30 text-center">投稿タイトル</th>
                  <th className="border-1 w-[200px] bg-blue-700/40">作成者</th>
                  <th className="border-1 w-[200px] bg-blue-700/50">投稿日時</th>
                  <th className="border-1 w-[100px] bg-blue-700/60"></th>
                </tr>
              </thead>
              <tbody>

              </tbody>
            </table>
          </div>
        </form>
      </div>
    </>
  )
}

async function postTable() {
  
}