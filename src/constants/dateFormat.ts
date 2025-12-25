// タイムスタンプを日時表記に変更

export function dateformat(value: string) {
    const createdAt = new Date(value);
    const date = createdAt.toLocaleDateString('ja-Jp', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    return date;
}