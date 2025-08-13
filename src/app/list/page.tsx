"use client"

import { Header } from "@/components/layout/header";
import { errorToast, infoToast } from "@/utils/toast";
import type { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const List: NextPage = () => {
  const router = useRouter();
  const [token, setToken] = useState(false);

  useEffect(() => {
    // ローカルストレージにある情報取得
    const signIn = localStorage.getItem("access_token");

    if (!signIn) {
      // 無いならログインに戻る
      errorToast("ログインしていません。");
      router.replace('/login');
    } else {
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
      <title>一覧</title>
      <div>
        <Header title={"一覧"} onClick={(() => logout())}>
          
        </Header>

      </div>
    </>
  ) : (<></>)
}

export default List