import Link from "next/link";

export function Username({ username, userId }: { username: string, userId: number }) {
    return (
        <>
            <Link href={`/user/${userId}/details`} className="hover:underline p-5">
                {username}
            </Link>
        </>
    );
}