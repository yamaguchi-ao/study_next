import { getCookies } from "@/app/actions/action";
import { getUserData } from "@/app/actions/user-action";
import { Sidebar } from "@/components/layout/sidebar"
import { ReturnButton, UpdateButton } from "@/components/ui/button";
import { redirect } from "next/navigation";
import DataList from "./dataList";

// ユーザー詳細
export default async function UserDetails({ params }: { params: Promise<{ id: Number }> }) {

    const userId = (await params).id;
    const cookies = await getCookies();

    // cookieがない場合はログイン画面にリダイレクト
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

    // IDからユーザーデータを取得
    const data = await getUserData(userId);

    if (!data) {
        // 
        return redirect("/post");
    }

    const posts = data.posts;
    const comments = data.comments;

    return (
        <>
            <title>ユーザー 詳細</title>
            <div className="flex h-main overflow-hidden">
                <Sidebar />
                <div className="w-full p-7 flex flex-col ">
                    <div className="w-full">
                        <div className="flex justify-evenly pb-9">
                            <div className="flex items-center">
                                <div className="pl-2.5">ユーザー名：</div>
                                <h1 className="text-2xl pl20">{data.name}</h1>
                            </div>
                            <div className="flex items-center">
                                <div className="pl-2.5">メールアドレス：</div>
                                <h1 className="text-2xl pl20">{data.email}</h1>
                            </div>
                        </div>

                        {/* 自身の投稿と自身がコメントしたリスト */}
                        <DataList posts={posts} comments={comments} />

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