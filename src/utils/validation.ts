// フロント用バリデーション
import { z } from "zod";

// 新規登録用定数
const MIN_DIGIT = 8;

// ファイル用定数
const IMAGE_TYPE = ["image/png", "image/jpeg", "image/webp"]
const MAX_MB = 5;
const MAX_SIZE = 1024 * 1024 * MAX_MB;

// ユーザ登録バリデーション
export const UserSchema = z.object({
    username: z.string().min(1, { message: "ユーザーネームを入力してください" }),
    email: z.email("有効なメールアドレスで入力してください。").min(1, "メールアドレスを入力してください"),
    password: z.string().min(MIN_DIGIT, { message: "8桁以上入力して下さい。" }),
    confirm: z.string().min(1, "パスワード再確認を入力してください。"),
    mainGame: z.string().min(1, "ゲームタグを選択してください。").nullish(),
}).refine((data) => data.password === data.confirm, {
    path: ["confirm"],
    message: "異なるパスワードです。"
});

export type UserSchema = z.infer<typeof UserSchema>;

// ユーザー更新用
export const UserUpdateSchema = z.object({
    username: z.string().min(1, { message: "ユーザーネームを入力してください" }),
    email: z.email("有効なメールアドレスで入力してください。").min(1, "メールアドレスを入力してください"),
    password: z.string().nullish(),
    newPassword: z.string().nullish(),
    confirm: z.string().nullish(),
}).superRefine((data, ctx) => {
    const { password, newPassword, confirm } = data;

    if (password && password.length < MIN_DIGIT) {
        ctx.addIssue({
            code: "custom",
            path: ["password"],
            message: "現在のパスワードは8桁以上で入力してください。"
        });
    }

    if (!password && newPassword && confirm) {
        ctx.addIssue({
            code: "custom",
            path: ["password"],
            message: "現在のパスワードを入力してください。"
        });
    }

    if (newPassword && newPassword.length < MIN_DIGIT) {
        ctx.addIssue({
            code: "custom",
            path: ["newPassword"],
            message: "新しいパスワードは8桁以上で入力してください。"
        });
    }

    if (password) {
        if ((newPassword && !confirm) || (!newPassword && confirm) || (!newPassword && !confirm)) {
            ctx.addIssue({
                code: "custom",
                path: ["confirm"],
                message: "新しいパスワードと確認用パスワードを両方入力してください。"
            });
        }
    }

    if (password && newPassword && confirm) {
        if (password === newPassword && newPassword === confirm) {
            ctx.addIssue({
                code: "custom",
                path: ["newPassword"],
                message: "現在のパスワードと同じパスワードは使用できません。"
            });
        }
    }

    if (newPassword && confirm && newPassword !== confirm) {
        ctx.addIssue({
            code: "custom",
            path: ["confirm"],
            message: "新しいパスワードと確認用パスワードが一致しません。"
        });
    }
});

export type UserUpdateSchema = z.infer<typeof UserUpdateSchema>;

// ログイン用バリデーション
export const LoginSchema = z.object({
    email: z.email("有効なメールアドレスで入力してください。").min(1, "メールアドレスを入力してください"),
    password: z.string().min(MIN_DIGIT, { message: "8桁以上入力して下さい。" }),
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
    file: z.any().nullable().optional()
        .refine((file) => file != null || IMAGE_TYPE.includes(file.type), {
            message: "画像ファイルを選択してください。"
        })
        .refine((file) => file == null || file.size <= MAX_SIZE, {
            message: "ファイルサイズは5MB以下にしてください。"
        })
}).superRefine((data, ctx) => {
    if (data.game === null) {
        ctx.addIssue({
            code: "custom",
            path: ["game"],
            message: "ゲームタグが表示されていない場合は、登録を行ってください。"
        });
    }
});

export type PostSchema = z.infer<typeof PostSchema>;

// コメント用バリデーション
export const CommentSchema = z.object({
    comment: z.string().min(1, "コメントは必ず1文字以上入力してください。").max(500, "コメントは500文字以内で入力してください。"),
    postRank: z.number().min(0, "ランクを入力してください。"),
    yourRank: z.number().min(0, "ランクを入力してください。"),
}).refine((data) => data.yourRank >= data.postRank, {
    path: ["yourRank"],
    message: "あなたのランクは投稿者のランク以上でなければなりません。",
});

export type CommentSchema = z.infer<typeof CommentSchema>;

// 削除用APIバリデーション
export const DeleteSchema = z.object({
    userId: z.number().min(1, "ユーザは必ず指定してください。"),
    id: z.number().min(1, "対象を必ず指定してください。")
});

export type DeleteSchema = z.infer<typeof DeleteSchema>;

// 共通で使用されるエラーメッセージ
export enum commonErrorMessage {
    W001 = "",
    W002 = "",
    W003 = "",
    login = "ログインしていません。",
    valid = "入力内容に問題があります。",

}