"use client"

import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { errorToast, infoToast } from "@/utils/toast";
import type { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const List: NextPage = () => {
  const router = useRouter();
  const [token, setToken] = useState(false);
  const [name, setName] = useState(String);
  const [id, setId] = useState(0);

  useEffect(() => {
    // ローカルストレージにある情報取得
    const signIn = localStorage.getItem("access_token");

    if (!signIn) {
      // 無いならログインに戻る
      errorToast("ログインしていません。");
      router.replace('/login');
    } else {
      // JWTからペイロードのみを取得
      const payload = signIn?.split('.')[1];

      // JWTをデコード
      const decodePayload = atob(payload!);

      // 元がJSONなのでパース
      const userData = JSON.parse(decodePayload);

      setName(userData.name);
      setId(userData.id);
      setToken(true);
    }
  }, [router]);

  const logout = () => {
    localStorage.removeItem("access_token");
    infoToast("ログアウトしました。");
    router.push("/login");
  }

  return token ? (
    <>
      <title>投稿 一覧</title>
      <div className="h-screen flex">
        <div className="flex-1 flex flex-col">
          <Header title={"一覧"} username={name} onClick={(() => logout())} />
          <div className="flex-1 flex overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col">
              
            </div>
          </div>
        </div>
      </div>
    </>
  ) : (<></>)
}

export default List