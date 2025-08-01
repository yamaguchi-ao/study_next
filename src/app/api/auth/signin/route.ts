// ログイン用API
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ログイン呼び出しAPI
export const GET = (body: { email: string, password: string }) => {
    
}