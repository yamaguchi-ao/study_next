"use client"

import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import Image from "next/image";
import Img from "@/public/file.svg";
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
      <div className="h-screen flex">
        <div className="flex-1 flex flex-col">
          <Header title={"投稿 一覧"} username={username ? username : ""} onClick={(() => Logout())} />
          <div className="flex-1 flex overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col">
              <Image src={Img} alt="" width="100" height="100" priority={true} className="">
              </Image>
              
            </div>
          </div>
        </div>
      </div>
    </>
  )
}