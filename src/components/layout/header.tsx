import { Button } from "../ui/button";
import Image from "next/image";
import icon from "@/public/test_icon.png"
import { getCookies } from "@/app/actions/action";

// ヘッダー
export async function Header({ title }: any) {
    const user = await getCookies();
    const username = user?.name;

    return (
        <header>
            <div className="w-auto h-15 bg-cyan-500/50 flex justify-between items-center">
                <div className="flex items-center">
                    <Image src={icon} alt="" width={50} height={50} className="pl-5" />
                    <h1 className="pl-5 text-2xl">{title}</h1>
                </div>
                <div className="flex pr-5 items-center">
                    <h2 className="pr-5">{username}</h2>
                    <Button onClick={"logout"}>ログアウト</Button>
                </div>
            </div>
        </header>
    );
}