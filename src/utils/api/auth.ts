import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

/** DB接続用 **/
export const connect = async () => {
    try {
        prisma.$connect();
    } catch (error) {
        return Error("DB接続失敗");
    }
}

export const GET = async (req: Request) => {
    try {
        await connect();
        const users = await prisma.users.findMany();

        return NextResponse.json({ users }, { status: 200 });
    } catch (error) {
        return NextResponse.json({message: "Error"}, {status: 500});
    } finally {
        await prisma.$disconnect();
    }
}