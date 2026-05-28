"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Bar3Icon } from "../ui/icons";
import { navigation } from "@/constants/context";

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
            <div className={`bg-cyan-50 border-r duration-800 ${!state ? "w-10" : "w-30"}`}>
                <button className={`flex justify-end p-3 duration-800 ${!state ? "w-10" : "w-30"}`} onClick={onClick}>
                    <Bar3Icon className="size-7" />
                </button>
                <aside className={`overflow-y-auto pt-4 pb-4 font-semibold duration-800 ${!state ? "-translate-x-20" : ""}`} id="sidenav">
                    <ul className="text-[18px] ">
                        {navigation.map(({ href, name, id }) => {
                            if (href !== "/user") {
                                return (
                                    <li key={id} className={`p-2 ${state ? param.indexOf(href) !== -1 ? "bg-cyan-600/30" : "bg-cyan-50" : ""}`}>
                                        {param.indexOf(href) !== -1 ? <div>{name}</div> : <Link href={href} className=""> {name}</Link>}
                                    </li>
                                )
                            }
                        })}
                    </ul>
                </aside>
            </div>
        </>
    );
}