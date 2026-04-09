"use client"

import { postDelete } from "@/app/actions/post-action";
import { Button, DeleteButton } from "@/components/ui/button";
import Modal, { ConfirmModalContent } from "@/components/ui/modal";
import { dateformat } from "@/constants/dateFormat";
import { errorToast, successToast } from "@/utils/toast";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

interface DataListProps {
    posts: string[];
    comments: string[];
}

// ユーザーデータのリスト
export default function DataList({ posts, comments }: DataListProps) {
    const [tab, setTab] = useState(1);

    const handleTabChange = (selectedTab: number) => {
        setTab(selectedTab);
    };

    return (
        <>
            <div className="text-body pb-5">
                <ul className="flex flex-wrap text-center text-sm font-semibold">
                    <li>
                        <button className={`px-4 py-2 w-[150px] text-[20px] rounded-tl-2xl rounded-tr-2xl
                            ${tab === 1 ? "bg-cyan-600 text-white" : "bg-gray-200 text-gray-700"}`} onClick={() => handleTabChange(1)}>
                            投稿
                        </button>
                    </li>
                    <li>
                        <button className={`px-4 py-2 w-[150px] text-[20px] rounded-tl-2xl rounded-tr-2xl
                            ${tab === 2 ? "bg-cyan-600 text-white" : "bg-gray-200 text-gray-700"}`} onClick={() => handleTabChange(2)}>
                            コメント
                        </button>
                    </li>
                </ul>
                {tab === 1 && <PostList posts={posts} />}
                {tab === 2 && <CommentList comments={comments} />}
            </div>
        </>
    );
}

// 投稿タブのリスト
function PostList({ posts }: { posts: string[] }) {

    const router = useRouter();
    const modalRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number>(0);

    // 削除処理
    async function onDelete(id: number) {
        setIsOpen(false);
        const res = await postDelete(id);
        if (res?.success) {
            router.refresh();
            successToast(res?.message);
        } else {
            errorToast(res?.message);
        }
    }

    const openModal = (id: number) => {
        setSelectedId(id);
        setIsOpen(true);
    }

    return (
        <>
            <Modal isOpen={isOpen} setIsOpenAction={setIsOpen} ref={modalRef} >
                <ConfirmModalContent handleClickAction={() => onDelete(selectedId)} ref={modalRef} />
            </Modal>
            <div className="h-[400px] overflow-auto">
                <table className="w-full mb-2 text-[15px]">
                    <thead className="bg-cyan-600 flex items-center p-3 text-white h-10 sticky top-0">
                        <tr className="w-1/10 place-items-center"><th>投稿ID</th></tr>
                        <tr className="w-1/2 place-items-center"><th>投稿タイトル</th></tr>
                        <tr className="w-1/6 place-items-center"><th>投稿日</th></tr>
                        <tr className="w-1/6 place-items-center"><th>更新日</th></tr>
                        <tr className="w-1/12 place-items-center"><th></th></tr>
                    </thead>
                    {posts.length > 0 ? posts.map((post: any, index: number) => {
                        const createdDate = dateformat(post.createdAt);
                        const updatedDate = dateformat(post.updatedAt);
                        return (
                            <tbody key={index} className={`flex items-center p-3
                            ${index % 2 === 1 ? "bg-white" : "bg-cyan-600/40"} h-15 `}>
                                <tr className="w-1/10 place-items-center">
                                    <td>{post.id}</td>
                                </tr>
                                <tr className="w-1/2 place-items-center overflow-ellipsis">
                                    <td className="line-clamp-1">{post.title}</td>
                                </tr>
                                <tr className="w-1/6 place-items-center">
                                    <td>{createdDate}</td>
                                </tr>
                                <tr className="w-1/6 place-items-center overflow-ellipsis">
                                    <td className="line-clamp-1">{updatedDate}</td>
                                </tr>
                                <tr className="w-1/12 place-items-center">
                                    <td>
                                        <Button type="button" onClick={() => openModal(post.id)}>削除</Button>
                                    </td>
                                </tr>
                            </tbody>
                        );
                    }) : <tbody className="flex items-center p-3 line-clamp-1 justify-center">
                        <tr>
                            <td colSpan={5} className="text-center">
                                投稿をしていません。
                            </td>
                        </tr>
                    </tbody>}
                </table>
            </div>
        </>
    );
}

// コメントタブのリスト
function CommentList({ comments }: { comments: string[] }) {
    return (
        <>
            <div className="h-[400px] overflow-auto">
                <table className="table-fixed w-full mb-2 text-[15px]">
                    <thead className="bg-cyan-600 flex items-center p-3 text-white h-10 sticky top-0">
                        <tr className="w-1/10 place-items-center"><th>コメントID</th></tr>
                        <tr className="w-1/3 place-items-center"><th>コメント内容</th></tr>
                        <tr className="w-1/6 place-items-center"><th>コメント日</th></tr>
                        <tr className="w-1/3 place-items-center"><th>投稿タイトル</th></tr>
                        <tr className="w-1/10 place-items-center"><th></th></tr>
                    </thead>
                    {comments.length > 0 ? comments.map((comment: any, index: number) => {

                        const date = dateformat(comment.createdAt);

                        return (
                            <tbody key={index} className={`flex items-center p-3 line-clamp-1
                            ${index % 2 === 0 ? "bg-white" : "bg-cyan-600/40"} h-15`}>
                                <tr className="w-1/10 place-items-center">
                                    <td>{comment.id}</td>
                                </tr>
                                <tr className="w-1/3 place-items-center overflow-ellipsis">
                                    <td className="line-clamp-1">{comment.comment}</td>
                                </tr>
                                <tr className="w-1/6 place-items-center">
                                    <td>{date}</td>
                                </tr>
                                <tr className="w-1/3 place-items-center overflow-ellipsis">
                                    <td className="line-clamp-1">{comment.post.title}</td>
                                </tr>
                                <tr className="w-1/10 place-items-center">
                                    <td>
                                        <DeleteButton id={comment.id} type={"comment"} />
                                    </td>
                                </tr>
                            </tbody>
                        );
                    }) : <tbody className="flex items-center p-3 line-clamp-1 justify-center">
                        <tr>
                            <td colSpan={5} className="text-center">
                                コメントをしていません。
                            </td>
                        </tr>
                    </tbody>}
                </table>
            </div>
        </>
    );
}