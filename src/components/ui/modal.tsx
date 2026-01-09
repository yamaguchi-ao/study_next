"use client";

import React, { useActionState, useEffect, useRef, useState } from "react";
import { Button } from "./button";
import { addComment } from "@/app/actions/comment-action";
import { useRouter } from "next/navigation";
import { WarningIcon } from "./icons";

// モーダル本体
export default function Modal({ isOpen, setIsOpenAction, data, type }: { data: { id: number, userId: number }, isOpen: boolean, setIsOpenAction: React.Dispatch<React.SetStateAction<boolean>>, type: string }) {
    const modalRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (modalRef.current && !(modalRef.current as HTMLElement).contains(event.target as Node)
                || (event.target as HTMLElement).getAttribute("name") === "cancel") {
                setIsOpenAction(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [modalRef, setIsOpenAction]);

    useEffect(() => {
        if (!isOpen) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
    }, [isOpen]);

    return (
        <>
            {isOpen &&
                <div className="fixed z-10 top-0 left-0 w-full h-full bg-black/50 backdrop-blur-sm">
                    {type === "comment" ? <CommentModalContent data={data} setIsOpenAction={setIsOpenAction} ref={modalRef} /> : null}
                    {type === "confirm" ? <ConfirmModalContent data={data} setIsOpenAction={setIsOpenAction} ref={modalRef} /> : null}
                </div>
            }
        </>
    )
}

// コメント用モーダルの中身
export function CommentModalContent({ data, setIsOpenAction, ref }: { data?: { id: number, userId: number }, setIsOpenAction: React.Dispatch<React.SetStateAction<boolean>>, ref: React.RefObject<null> }) {
    const router = useRouter();
    const [anonymous, setAnonymous] = useState(Boolean);

    // 匿名用
    function handleOnChange() {
        if (anonymous) {
            setAnonymous(false);
        } else {
            setAnonymous(true);
        }
    }

    const [state, commentAction, isPending] = useActionState(
        async (_prevState: any, formData: FormData) => {
            const comment = addComment(_prevState, formData, data!.id, data!.userId);
            setIsOpenAction(false);
            router.refresh();
            return comment;
        }, null);

    const errorText = (data: string[]) => {
        const list = [];
        for (let i = 0; i < data.length; i++) {
            list.push(<p key={i} className="p-1 text-xs text-red-600">{data[i]}</p>)
        }
        return list;
    }

    return (
        <div className="relative z-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-h-[95vh] md:max-h-[90vh] w-[97vw] md:w-[80vw] p-4 bg-slate-100 shadow-lg rounded-xl overflow-auto" ref={ref}>
            <div className="text-black">
                <h1 className="text-2xl font-bold mb-4">コメント追加</h1>
                <form action={commentAction}>
                    <div className="mb-4">
                        <textarea id="comment" name="comment" className="w-full p-3 h-[300px] resize-none border-1 border-gray-500 bg-white rounded-md"></textarea>
                        {state?.comment ? errorText(state?.comment) : null}
                    </div>
                    <div className="flex">
                        <div className="flex-1 justify-start items-center flex">
                            <label className="flex cursor-pointer mr-4">
                                <input type="checkbox" className="peer sr-only mr-1" name="anonymous" onChange={() => handleOnChange()} />
                                <span className="block w-[2em] bg-gray-400 rounded-full pt-[2px] pl-[1px] after:block after:h-[1em] after:w-[1em] after: after:rounded-full after:bg-white after:transition peer-checked:bg-blue-500 peer-checked:after:translate-x-[calc(100%-3px)]"></span>
                                <span className="row ml-2 text-sm">匿名で投稿</span>
                            </label>
                        </div>
                        <div className="flex justify-end">
                            <Button type="button" name="cancel" className="mr-4">キャンセル</Button>
                            <Button type="submit" disabled={isPending}>{isPending ? "投稿中..." : "投稿"}</Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export function ConfirmModalContent({ data, setIsOpenAction, ref }: { data?: { id: number, userId: number }, setIsOpenAction: React.Dispatch<React.SetStateAction<boolean>>, ref: React.RefObject<null> }) {

    // const [state, deleteAction, isPending] = useActionState(,);

    return (
        <div className="relative z-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-130 h-50 p-5 bg-slate-100 shadow-lg rounded-xl" ref={ref}>
            <div className="text-black">
                <div className="flex justify-center items-center mb-5">
                    <div className="bg-yellow-400/50 rounded-full size-10">
                        <WarningIcon className="relative top-1 left-[6px] size-7" />
                    </div>
                    <h1 className="text-2xl font-bold ml-5">削除</h1>
                </div>

                <p className="mb-10">削除いたしますがよろしいでしょうか？</p>
                <div className="flex justify-end">
                    <Button type="" className="bg-red-500 mr-4">はい</Button>
                    <Button type="button" name="cancel" className="">いいえ</Button>
                </div>
            </div>
        </div>
    )
}