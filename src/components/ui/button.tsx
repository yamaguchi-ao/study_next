"use client"
import { Logout } from '@/app/actions/form-action';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { SetStateAction, useRef, useState } from 'react';
import Modal, { CommentModalContent } from './modal';
import { errorToast, successToast } from '@/utils/toast';
import { commentDelete } from '@/app/actions/comment-action';
import { ReplyIcon, SearchIcon } from './icons';

// ボタンレイアウト用
export function Button({ children, className, type, onClick, ...rest }: any) {
    return (
        <button
            {...rest}
            className={clsx(
                'flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-400 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 disabled:bg-blue-400',
                className,
            )}
            type={type ? type : "button"}
            onClick={onClick == "logout" ? (() => Logout()) : onClick}
        >
            {children}
        </button >
    );
}

/** 検索用ボタン */
export function SearchButton({ type, disabled }: any) {
    return <Button type={type} disabled={disabled}>
        <SearchIcon className="mr-[2px] size-4" />
        {disabled ? "検索中..." : "検索"}
    </Button>
}

/** 更新用ボタン */
export function UpdateButton({ type, id }: any) {
    const router = useRouter();
    return <Button onClick={() => router.push(`/${type}/${id}/update`)}>更新</Button>
}

/** 戻る用ボタン */
export function ReturnButton({ type }: any) {
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
export function DeleteButton({ type, id }: any) {
    const router = useRouter();

    async function onDelete(id: number) {
        // 取得したタイプの条件で削除する
        if (type == "comment") {
            const req = await commentDelete(id);

            const success = req.success ? req.success : "";
            const message = req.message ? req.message : "";

            router.refresh();

            if (success) {
                successToast(message);
            } else {
                errorToast(message);
            }
        }
    }

    return <Button onClick={() => onDelete(id)}>削除</Button>
}

/** モーダル用ボタン */
export function ModalButton({ className, data }: any) {
    const modalRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setIsOpen(true)} className={className}>コメント</Button>
            <Modal isOpen={isOpen} setIsOpenAction={setIsOpen} ref={modalRef}>
                <CommentModalContent data={data} setIsOpenAction={setIsOpen} ref={modalRef} />
            </Modal>
        </>
    );
}