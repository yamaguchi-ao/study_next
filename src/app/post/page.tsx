"use client"

import { Sidebar } from "@/components/layout/sidebar";
import { Suspense, useActionState, useEffect, useState } from "react";
import { Button, SearchButton } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Loading from "../loading";
import { postDelete, postListSearch } from "../actions/post-action";
import { getCookies } from "../actions/action";
import { CancelIcon, CommentIcon } from "@/components/ui/icons";
import Link from "next/link";
import Modal from "@/components/ui/modal";

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
        <form className="flex-1 flex flex-col overflow-y-scroll" action={searchAction}>
          <div className="flex p-5 justify-center">
            <div className="flex items-center pr-5">
              <div className="pr-5">ゲーム</div>
              <input className="border" name="game" defaultValue={game} onChange={(e) => setGame(e.target.value)}></input>
            </div>

            <div className="flex">
              <div className="pl-5">
                <SearchButton type="submit" disabled={isPending}></SearchButton>
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
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // 投稿一覧取得
  return (
    <>
      <Modal isOpen={isOpen} data={data} setIsOpenAction={setIsOpen} type="confirm"></Modal>
      <div className="grid grid-cols-3 justify-items-center gap-y-10">
        {data !== undefined ? data.map((value: any, idx: any) => {
          return (
            <div key={value.id} className="flex flex-col flex-wrap transition delay-70 duration-300 hover:scale-110">
              <div className="w-[20em] h-[8em] rounded-t-lg bg-blue-900">
                <div className="relative -top-[5px] left-[295px] size-8 rounded-full bg-white">
                  <CancelIcon className="relative size-7 rounded-full bg-gray-300 top-[2px] left-[2px] hover:fill-current hover:text-red-500" color="white"
                  onClick={() => setIsOpen(true)}/>
                </div>
              </div>
              <Link href={`post/${value.id}/details`} >
                <div className="w-[20em] h-25 p-[13px] rounded-b-lg bg-gray-200">
                  <p className="h-[50px] font-bold truncate">{value.title}</p>
                  <div className="flex justify-between">
                    <div className="flex items-center text-xs">
                      <p>投稿者：{value.user.name}</p>
                      <p className="pl-[5px]">ゲーム：{value.gameTag}</p>
                    </div>

                    <div className="flex justify-end">
                      <CommentIcon className="size-5 mt-[3px]" />
                      <p className="pl-2">{value.comments.length}</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )
        }) : <></>}
      </div>
    </>
  );
}