"use client"

import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import Modal, { CommentModalContent, ConfirmModalContent } from './modal';
import { errorToast, successToast } from '@/utils/toast';
import { commentDelete, commentUpdate } from '@/app/actions/comment-action';
import { CommentBadIcon, CommentLikeIcon, LikeIcon, ReplyIcon, SearchIcon } from './icons';
import { CommentsType } from '@/types';
import { likeUpdate } from '@/app/actions/post-action';
import { deleteUser } from '@/utils/api/user';
import { logout } from '@/utils/api/auth';

// モーダルボタン用
interface ModalButtonProps {
    className: string
    data?: CommentsType,
    id?: number,
}

// 複数ボタン用
interface ManyButtonProps {
    className?: string,
    type?: string,
    id?: Number,
    userId?: number,
    disabled?: boolean
}

// 大元のボタン用
interface ButtonProps {
    children?: React.ReactNode,
    className?: string,
    type?: string,
    onClick?: () => void,
    disabled?: boolean,
    name?: string
}

// 評価ボタン用
interface EvaluationButtonProps {
    isCurrentPost?: boolean;
    isCurrentComment?: boolean;
    postId: number;
    commentId?: number;
    like: string;
    bad?: string;
    pressedFlg?: boolean;
    pressedType?: string;
}

// ボタンの種類によって処理を分けるためのコンポーネント

// ボタンレイアウト用
export function Button({ children, className, type, onClick, ...rest }: ButtonProps) {
    return (
        <button
            {...rest}
            className={clsx(
                'flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-400 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 disabled:bg-blue-400',
                className,
            )}
            type={type === "submit" ? type : "button"}
            onClick={onClick}>
            {children}
        </button >
    );
}

/** 検索用ボタン */
export function SearchButton({ type, disabled }: ManyButtonProps) {
    return <Button type={type} disabled={disabled}>
        <SearchIcon className="mr-[2px] size-4" />
        {disabled ? "検索中..." : "検索"}
    </Button>
}

/** 更新用ボタン */
export function UpdateButton({ className, type, id }: ManyButtonProps) {
    const router = useRouter();
    return <Button className={className} onClick={() => router.push(`/${type}/${id}/update`)}>更新</Button>
}

/** 戻る用ボタン */
export function ReturnButton({ type }: ManyButtonProps) {
    const router = useRouter();

    if (type) {
        return <Button onClick={() => router.push(`/${type}`)}>
            <ReplyIcon className='mr-[4px]' />戻る
        </Button>
    } else {
        return <Button onClick={() => router.back()}>
            <ReplyIcon className='mr-[4px]' />戻る
        </Button>
    }
}

/** 削除用ボタン */
export function DeleteButton({ className, type, id }: ManyButtonProps) {
    const router = useRouter();

    async function onDelete(id: number) {
        // 取得したタイプの条件で削除する
        if (type === "comment") {
            const req = await commentDelete(id);

            const success = req.success ? req.success : "";
            const message = req.message ? req.message : "";
            const login = req.login ? req.login : false;

            router.refresh();

            if (success) {
                successToast(message);
            } else {
                // ログインしているときのみエラー表示
                if (login) {
                    errorToast(message);
                }
            }
        } else if (type === "user") {
            // ログインしている自身を削除？

        }
    }

    return <Button className={className} onClick={() => onDelete(id! as number)}>削除</Button>
}

/** モーダル用ボタン */
export function ModalButton({ className, data }: ModalButtonProps) {
    const modalRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setIsOpen(true)} className={className}>コメント</Button>
            <Modal isOpen={isOpen} setIsOpenAction={setIsOpen} ref={modalRef}>
                <CommentModalContent data={data!} setIsOpenAction={setIsOpen} ref={modalRef} />
            </Modal>
        </>
    );
}

/**　削除モーダル用ボタン */
export function DeleteModalButton({ className, id }: ModalButtonProps) {
    const router = useRouter();
    const modalRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    // 削除処理
    async function onDelete(id: number) {
        const res = await deleteUser(id);
        setIsOpen(false);
        if (res?.success) {
            successToast(res?.message);
            // ログイン時につけていたセッションを削除
            await logout();
            router.push("/login");
        } else {
            errorToast(res?.message);
        }
    }

    return (
        <>
            <Button onClick={() => setIsOpen(true)} className={className}>削除</Button>
            <Modal isOpen={isOpen} setIsOpenAction={setIsOpen} ref={modalRef}>
                <ConfirmModalContent handleClickAction={() => onDelete(id! as number)} ref={modalRef} />
            </Modal>
        </>
    );
}

/** 投稿評価用ボタン */
export function EvaluationButton({ isCurrentPost, postId, like, pressedFlg }: EvaluationButtonProps) {
    const [likeCount, setLikeCount] = useState(parseInt(like));

    // ボタン押下時処理
    const onLike = () => {
        if (pressedFlg) {
            return;
        }
        setLikeCount(likeCount + 1);
        likeUpdate(postId, likeCount + 1);
    }

    return (
        <>
            <div className="text-sm text-gray-500 justify-end flex flex-col items-center">
                <button className={` ${isCurrentPost ? 'cursor-not-allowed' : pressedFlg ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    type='button' onClick={() => onLike()} disabled={isCurrentPost ? true : pressedFlg ? true : false} >
                    <LikeIcon className={`size-8 ${isCurrentPost ? 'text-gray-500/30' : pressedFlg ? 'text-red-400' : 'hover:text-red-400 hover:scale-125 transition-transform'} `} />
                </button>
                <span className="text-sm text-gray-500">{likeCount}</span>
            </div>
        </>
    )
}

// コメント評価ボタン
export function CommentEvaluationButton({ postId, commentId, like, bad, pressedFlg, pressedType }: EvaluationButtonProps) {
    const [likeCount, setLikeCount] = useState(parseInt(like));
    const [badCount, setBadCount] = useState(parseInt(bad!));

    // ボタン押下時処理
    const onLike = () => {
        if (pressedFlg) {
            return;
        }
        setLikeCount(likeCount + 1);
        commentUpdate(postId, commentId!, likeCount + 1, "like");
    }

    const onBad = () => {
        if (pressedFlg) {
            return;
        }
        setBadCount(badCount + 1);
        commentUpdate(postId, commentId!, badCount + 1, "bad");
    }

    return (
        <>
            <div className='flex justify-center items-center'>
                <button className={`mr-3 cursor-pointer`} type='button' onClick={() => onLike()}>
                    <CommentLikeIcon className={`size-7 ${pressedFlg === true && pressedType === "like" ? 'text-blue-600' : 'text-gray-500/30  hover:text-blue-600 active:scale-125 transition-transform'}`} />
                </button>
                <span className="text-sm mr-5 text-gray-500">{likeCount}</span>

                <button className={`mr-3 cursor-pointer`} type='button' onClick={() => onBad()}>
                    <CommentBadIcon className={`size-7 ${pressedFlg === true && pressedType === "bad" ? 'text-red-600' : 'text-gray-500/30 hover:text-red-600 active:scale-125 transition-transform'} `} />
                </button>
                <span className="text-sm text-gray-500">{badCount}</span>
            </div>
        </>
    )
}