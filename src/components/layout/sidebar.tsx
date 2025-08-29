import Link from "next/link";

export function Sidebar() {
    return (
        <aside className="h-full overflow-y-auto p-4 w-50 font-semibold border-r">
            <li>
                <Link href="/list">投稿</Link>
            </li>

            <li>
                <Link href="/list/game">ゲーム</Link>
            </li>
        </aside>
    );
}