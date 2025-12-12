"use client"

import { Sidebar } from "@/components/layout/sidebar";
import { Suspense, useActionState, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Loading from "../loading";
import { postDelete, postListSearch } from "../actions/post-action";
import { getCookies } from "../actions/action";

export default function List() {
  const router = useRouter();
  const [game, setGame] = useState(String);
  const [userId, setUserId] = useState(Number);
  const [search, setSearch] = useState(Array);
  const [state, searchAction, isPending] = useActionState(GetSearch, null);

  useEffect(() => {
    getUserId();
    router.refresh();
  }, [router]);

  // 検索
  async function GetSearch() {
    const getData = await postListSearch(game);
    setSearch(getData);
  }

  // ログインユーザー取得用
  async function getUserId() {
    const cookies = await getCookies();
    const userId = cookies?.id;
    setUserId(userId!);
  }

  // 削除
  async function onDelete(postId: number) {
    await postDelete(postId);
    // 再検索
    await GetSearch();
  }

  return (
    <>
      <title>投稿 一覧</title>
      <div className="flex h-main overflow-hidden">
        <Sidebar />
        <form className="flex-1 flex flex-col" action={searchAction}>
          <div className="flex p-5 justify-center">
            <div className="flex items-center pr-5">
              <div className="pr-5">ゲーム</div>
              <input className="border" name="game" defaultValue={game} onChange={(e) => setGame(e.target.value)}></input>
            </div>

            <div className="flex">
              <div className="pl-5">
                <Button type="submit" disabled={isPending}>
                  {isPending ? "検索中..." : "検索"}
                  </Button>
              </div>

              <div className="pl-5">
                <Button onClick={(() => router.push("/post/register"))}>新規登録</Button>
              </div>
            </div>
          </div>

          <div className="w-full p-5">
            <div className="p-1 bg-gray-600/20 mb-5">{`検索結果：${search !== undefined ? search.length + "件" : "0件"}`}</div>
            <Suspense fallback={<Loading />}>
              <PostTable userId={userId} data={search} onClick={onDelete}></PostTable>
            </Suspense>
          </div>
        </form>
      </div>
    </>
  )
}

function PostTable({ userId, data, onClick }: any) {

  // 投稿一覧取得
  return (
    <table className="w-full">
      <thead>
        <tr className="border-1">
          <th className="border-1 w-[50px] bg-blue-700/10">番号</th>
          <th className="border-1 w-[500px] bg-blue-700/20 text-center">投稿タイトル</th>
          <th className="border-1 w-[200px] bg-blue-700/50">ゲームタイトル</th>
          <th className="border-1 w-[200px] bg-blue-700/40">投稿者</th>
          <th className="border-1 w-[100px] bg-blue-700/30"></th>
        </tr>
      </thead>

      <tbody>
        {data !== undefined ? data.map((value: any, idx: any) => {

          return (
            <tr key={value.id} className="border-1">
              <td className="text-center">{idx + 1}</td>
              <td className="text-center text-blue-400"><Link href={`post/${value.id}/details`} className="underline underline-offset-1">{value.title}</Link></td>
              <td className="text-center">{value.gameTag}</td>
              <td className="text-center">{value.user.name}</td>
              {value.userId == userId ? <td className="justify-items-center"><Button onClick={() => onClick(value.id)}>削除</Button></td> : <></>}
            </tr>
          )
        }) : <></>}
      </tbody>
    </table>
  );
}