"use client"
import { Logout } from '@/app/actions/form-action';
import clsx from 'clsx';
import { redirect, useRouter } from 'next/navigation';

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

/** 更新用ボタン */
export function UpdateButton({ type, id }: any) {
    const router = useRouter();
    return <Button onClick={() => router.push(`/${type}/${id}/update`)}>更新</Button>
}

/** 戻る用ボタン */
export function ReturnButton({ type }: any) {
    const router = useRouter();
    return <Button onClick={() => router.back()}>戻る</Button>
}