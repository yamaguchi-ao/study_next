// バリデーション用

import { z } from "zod";

export const userSchema = z.object({
    username: z.string().min(1, { message: "ユーザーネームを入力してください" }),
    email: z.email(),
    password: z.string().min(8, { message: "8桁以上入力して下さい。" }),
    confirm: z.string()
}).refine((data) => data.password === data.confirm, {
    path: ["confirm"],
    message: "異なるパスワードです。"
});

export type userValues = z.infer<typeof userSchema>;