import { getCookies } from "@/app/actions/action";
import { Sidebar } from "@/components/layout/sidebar";
import { getDetailDistribution } from "@/utils/api/distribution";
import { redirect } from "next/navigation";
import DisplayData from "./details/page";
import { ReturnButton } from "@/components/ui/button";
import { errorToast } from "@/utils/toast";

// 分布の詳細取得
export default async function DetailDistribution({ params }: { params: Promise<{ name: string }> }) {

    const userId = (await getCookies())?.id;
    if (!userId) {
        return redirect("/login?error=true");
    }

    // Getパラメータから選択してゲーム名を取得
    const name = (await params).name;

    // 取得したゲームを登録しているuserをすべて取得
    const detailData = await getDetailDistribution({ name });

    // 取得結果判定
    if (!detailData.success) {
        // 失敗した場合
        errorToast("取得時に例外が発生しました。");
        return redirect("/distribution");
    } else {
        // 成功した場合
        if (!detailData.data) {
            // 取得したデータが無い場合
            errorToast(detailData.message);
            return redirect("/distribution");
        }
    }

    // トータルの割合
    const total = detailData.data!.length;

    return (
        <>
            <title>ゲーム 詳細分布</title>
            <div className="flex h-main overflow-hidden">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between p-4">
                            <div className="flex items-center">
                                <h1 className="text-2xl font-bold">{detailData.game}</h1>
                                <h1 className="pl-4">総勢：{total}人</h1>
                            </div>
                            <ReturnButton type={"distribution"} />
                        </div>
                        <DisplayData id={userId} name={detailData.game!} data={detailData.data!} />
                    </div>
                </div>
            </div>
        </>
    );
}
