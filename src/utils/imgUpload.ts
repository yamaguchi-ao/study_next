import path from "path";
import supabase from "@/lib/supabase";

//　ストレージに画像をアップロードする
export async function imageUpload(userId: number, file: File, storage: string) {

    // ファイル命名＋保存先指定
    const ext = path.extname(file.name);
    const fileName = `${crypto.randomUUID()}${ext}`;

    const { error } = await supabase.storage.from(storage).upload(`${userId}/${fileName}`, file);

    if (error) {
        console.log("エラー内容：" + error);
        return null;
    }

    // // アップロード時に作成したURLをテーブルに登録
    const { data } = await supabase.storage.from(storage).getPublicUrl(`${userId}/${fileName}`);
    const filePath = data?.publicUrl ?? null;

    return filePath;
}

// ストレージから自身のデータを削除する
export async function imageRemove(userId: number, fileUrl: string, storage: string) {
    const imageFolderName = `${storage}/`;
    const index = fileUrl.indexOf(`${imageFolderName}${userId}/`);
    const folderName = fileUrl.substring(index + imageFolderName.length);

    const { error } = await supabase.storage.from(storage).remove([folderName]);

    if (error) {
        console.log("エラー内容：" + error);
        return false;
    } else {
        return true;
    }
}