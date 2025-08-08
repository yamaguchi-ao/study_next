
import { Button } from "@/components/ui/button";
import { infoToast } from "@/utils/toast";
import type { NextPage } from "next";
import { useRouter } from "next/navigation";

const List: NextPage = () => {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("access_token");
    infoToast("ログアウトしました。");
    router.push("/login");
  }

  return (
    <>
      <title>一覧</title>
      <div>
        <h1>まだ何も決めてない</h1>
        <Button className="" onClick={logout}>
          ログアウト
        </Button>
      </div>
    </>
  )
}

export default List