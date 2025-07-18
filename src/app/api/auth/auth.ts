import NextAuth, { DefaultSession } from "next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers:[],
})

declare module 'next-auth' {
    interface Session {
        user?: {
            id: '123456';
        } & DefaultSession['user'];
    }

    interface Jwt {
        id: string;
    }
}