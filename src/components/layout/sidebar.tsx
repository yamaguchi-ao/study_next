"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigation = [
    { id: 1, name: "投稿", href: "/post" },
    { id: 2, name: "ゲーム", href: "/game" },
]

export function Sidebar() {
    const param = usePathname();
    const [state, setState] = useState(true);

    const onClick = () => {
        if (state) {
            setState(false);
        } else {
            setState(true);
        }
    }

    return (
        <>
            <div className="w-30">
                <button className={`w-30 bg-cyan-50 border-r flex justify-end p-3 duration-800 ${!state ? "slide-20" : ""}`} onClick={onClick}>三</button>
                <aside className={`bg-cyan-50 h-full overflow-y-auto pt-4 pb-4 font-semibold border-r duration-800 ${!state ? "slide-20" : ""}`} id="sidenav">
                    <ul className="text-[18px] ">
                        {navigation.map(({ href, name, id }) => (
                            <li key={id} className={`p-2 ${state ? param.indexOf(href) !== -1 ? "bg-cyan-600/30" : "bg-cyan-50" : ""}`}>
                                {param.indexOf(href) !== -1 ? <div>{name}</div>  : <Link href={href} className=""> {name}</Link>}
                            </li>
                        ))}
                    </ul>
                </aside>
            </div>
        </>
    );
}