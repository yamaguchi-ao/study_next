import { getCookies } from "@/app/actions/action";
import { getUserData } from "@/app/actions/user-action";
import { Sidebar } from "@/components/layout/sidebar"
import { ReturnButton, UpdateButton } from "@/components/ui/button";
import { redirect } from "next/navigation";

// ユーザー詳細
export default async function UserDetails({ params }: { params: Promise<{ id: Number }> }) {

    const userId = (await params).id;
    const data = await getUserData(userId);

    const cookies = await getCookies();

    if (cookies === null) {
        return redirect("/login?error=true");
    }

    // cookieからログインしているIDを取得
    const loginId = cookies?.id;

    // ログインしているユーザーとURLのIDを比較
    if (Number(userId) !== loginId) {
        // 違ったら投稿画面に戻す
        return redirect("/post");
    }

    return (
        <>
            <title>ユーザー 詳細</title>
            <div className="flex h-main overflow-hidden">
                <Sidebar />
                <div className="w-full p-7 flex flex-col justify-center items-center">
                    <div className="w-1/2">
                        <div className="flex pb-10 items-center">
                            <div className="w-1/2">ユーザー名：</div>
                            <h1 className="text-2xl pl20">{data.name}</h1>
                        </div>
                        <div className="flex pb-10 items-center">
                            <div className="w-1/2">メールアドレス：</div>
                            <h1 className="text-2xl pl20">{data.email}</h1>
                        </div>
                        <div className="flex pb-10 items-center">
                            <div className="w-1/2">パスワード：</div>
                            <h1 className="text-2xl pl20">**********</h1>
                        </div>
                        <div className="flex justify-between">
                            <ReturnButton />
                            <UpdateButton type={"user"} id={userId} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}