"use client"

import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Logout } from "../actions/form-action";
import { useEffect, useState } from "react";
import { getCookies } from "../actions/action";

export default function List() {

  const [username, setUsername] = useState(String);

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
      <Header title={"投稿 一覧"} username={username ? username : ""} onClick={(() => Logout())} />
      <div className="flex h-main overflow-hidden">
        <Sidebar />
        <div className="w-full">
          
        </div>
      </div>
    </>
  )
}