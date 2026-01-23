"use client";

import React, { useActionState, useEffect, useState } from "react";
import { Button } from "./button";
import { addComment } from "@/app/actions/comment-action";
import { useRouter } from "next/navigation";
import { WarningIcon } from "./icons";
import { gameNameFixed, supportedGamesMap } from "@/constants/context";

// モーダル本体（モーダル外を押下時の処理等と中身の表示）
export default function Modal({ isOpen, setIsOpenAction, children, ref }: { isOpen: boolean, setIsOpenAction: React.Dispatch<React.SetStateAction<boolean>>, children: React.ReactNode, ref: React.RefObject<null> }) {

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !(ref.current as HTMLElement).contains(event.target as Node)
                || (event.target as HTMLElement).getAttribute("name") === "cancel") {
                setIsOpenAction(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, setIsOpenAction]);

    useEffect(() => {
        if (!isOpen) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
    }, [isOpen]);

    return (
        <>
            {isOpen && (
                <div className="fixed z-10 top-0 left-0 w-full h-full bg-black/50 backdrop-blur-sm">
                    {children}
                </div>
            )}
        </>
    )
}

// コメント用モーダルの中身
export function CommentModalContent({ data, setIsOpenAction, ref }: { data?: { id: number, userId: number, postRank: string, yourRank: string, game: string }, setIsOpenAction: React.Dispatch<React.SetStateAction<boolean>>, ref: React.RefObject<null> }) {
    const router = useRouter();
    const [anonymous, setAnonymous] = useState(Boolean);
    const [dispRank, setDispRank] = useState(Boolean);

    // 匿名用
    function handleOnChange() {
        if (anonymous) {
            setAnonymous(false);
        } else {
            setAnonymous(true);
        }
    }

    // ランク非表示用
    function handleOnChangeDispRank() {
        if (dispRank) {
            setDispRank(false);
        } else {
            setDispRank(true);
        }
    }

    // コメント追加APIアクション
    const [state, commentAction, isPending] = useActionState(
        async (_prevState: any, formData: FormData) => {
            const comment = await addComment(_prevState, formData, data!.id, data!.userId);
            if (comment?.comment || comment?.yourRank) {
                return comment;
            }
            setIsOpenAction(false);
            router.refresh();
            return comment;
        }, null);

    //　バリデーションエラー時のテキスト
    const errorText = (data: string[]) => {
        const list = [];
        for (let i = 0; i < data.length; i++) {
            list.push(<p key={i} className="p-1 text-xs text-red-600">{data[i]}</p>)
        }
        return list;
    }

    const rankToNumber = (game: string, rank: string) => {
        // 取得したゲームからランクマップを取得
        const rankMap = supportedGamesMap(game);

        // 現在のランクを数値として取得
        const rankNumber = rankMap?.find((item) => {
            if (item.key === rank) {
                return item.value;
            }
        });
        return rankNumber ? Number(rankNumber.value) : 0;
    }

    return (
        <div className="relative z-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-h-[95vh] md:max-h-[90vh] w-[97vw] md:w-[80vw] p-4 bg-slate-100 shadow-lg rounded-xl overflow-auto" ref={ref}>
            <div className="text-black">
                <h1 className="text-2xl font-bold mb-4">コメント追加</h1>
                <form action={commentAction}>
                    <div className="mb-4">
                        <textarea id="comment" name="comment" className="w-full p-3 h-[300px] resize-none border-1 border-gray-500 bg-white rounded-md"></textarea>
                        {state?.comment ? errorText(state?.comment) : null}
                        {state?.yourRank ? errorText(state?.yourRank) : null}
                    </div>
                    <div className="flex">
                        <div className="justify-start items-center flex">
                            <label className="flex cursor-pointer mr-4">
                                <input type="checkbox" className="peer sr-only mr-1" name="anonymous" onChange={() => handleOnChange()} />
                                <span className="block w-[2em] bg-gray-400 rounded-full pt-[2px] pl-[1px] after:block after:h-[1em] after:w-[1em] after: after:rounded-full after:bg-white after:transition peer-checked:bg-blue-500 peer-checked:after:translate-x-[calc(100%-3px)]"></span>
                                <span className="row ml-2 text-sm">匿名で投稿</span>
                            </label>
                        </div>
                        <div className="justify-start items-center flex">
                            <label className="flex cursor-pointer mr-4">
                                <input type="checkbox" className="peer sr-only mr-1" name="dispRank" onChange={() => handleOnChangeDispRank()} />
                                <span className="block w-[2em] bg-gray-400 rounded-full pt-[2px] pl-[1px] after:block after:h-[1em] after:w-[1em] after: after:rounded-full after:bg-white after:transition peer-checked:bg-blue-500 peer-checked:after:translate-x-[calc(100%-3px)]"></span>
                                <span className="row ml-2 text-sm">ランクを非表示</span>
                            </label>
                        </div>
                        <input type="hidden" name="postRank" value={rankToNumber(data?.game ?? "", data?.postRank ?? "")} />
                        <input type="hidden" name="yourRank" value={rankToNumber(data?.game ?? "", data?.yourRank ?? "")} />
                        <div className="flex flex-1 justify-end">
                            <Button type="button" name="cancel" className="mr-4">キャンセル</Button>
                            <Button type="submit" disabled={isPending}>{isPending ? "投稿中..." : "投稿"}</Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

// 削除確認用モーダル内部
export function ConfirmModalContent({ handleClick, ref }: { handleClick: any, ref: React.RefObject<null> }) {
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
                    <Button type="button" className="bg-red-500 mr-4 hover:opacity-75 hover:bg-red-400" onClick={handleClick}>
                        はい
                    </Button>
                    <Button type="button" name="cancel" className="">いいえ</Button>
                </div>
            </div>
        </div>
    )
}