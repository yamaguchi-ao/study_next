// ログインに遷移

import { redirect } from "next/navigation";

export default function Home() {
    return redirect('/login');
};