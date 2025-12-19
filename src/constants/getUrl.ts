import { headers } from "next/headers";

// URL取得用
export async function getUrl() {
    const headersData = headers();
    const protocol = (await headersData).get("x-forwarded-proto") || "http";
    const host = (await headersData).get("host");

    const baseUrl = `${protocol}://${host}`;
    return baseUrl;
}