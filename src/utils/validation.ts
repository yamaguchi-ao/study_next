// バリデーション用
import { z } from "zod";

// 新規登録用バリデーション
export const UserSchema = z.object({
    username: z.string().min(1, { message: "ユーザーネームを入力してください" }),
    email: z.email("有効なメールアドレスで入力してください。").min(1, "メールアドレスを入力してください"),
    password: z.string().min(8, { message: "8桁以上入力して下さい。" }),
    confirm: z.string().min(1, "パスワード再確認を入力してください。")
}).refine((data) => data.password === data.confirm, {
    path: ["confirm"],
    message: "異なるパスワードです。"
});

export type UserSchema = z.infer<typeof UserSchema>;

// ログイン用バリデーション
export const LoginSchema = z.object({
    email: z.email("有効なメールアドレスで入力してください。").min(1, "メールアドレスを入力してください"),
    password: z.string().min(8, { message: "8桁以上入力して下さい。" }),
});

export type LoginSchema = z.infer<typeof LoginSchema>;

// ゲーム用バリデーション
export const GameSchema = z.object({
    name: z.string().min(1, "ゲームタイトルを入力してください。"),
    rank: z.string().min(1, "ランクを入力してください。"),
});

export type GameSchema = z.infer<typeof GameSchema>;

export const GameUpdateSchema = z.object({
    rank: z.string().min(1, "ランクを入力してください。"),
});

export type GameUpdateSchema = z.infer<typeof GameUpdateSchema>;

// 投稿用バリデーション
export const PostSchema = z.object({
    title: z.string().min(1, "タイトルを入力してください。"),
    post: z.string().min(1, "投稿内容は必ず1文字以上入力してください。"),
    game: z.string().min(1, "ゲームタグを入力してください。").nullish(),
});

export type PostSchema = z.infer<typeof PostSchema>;

// コメント用バリデーション
export const CommentSchema = z.object({
    comment: z.string().min(1, "コメントは必ず1文字以上入力してください。"),
});

export type CommentSchema = z.infer<typeof CommentSchema>;