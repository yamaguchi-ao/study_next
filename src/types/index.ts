import type { Comments, Users, Games, Posts } from '@prisma/client';

export type CommentsWithUsers = Comments & {
    user: Users & [games: Games[]];
}

export type PostsWithUsers = Posts & {
    user: Users & [games: Games[]];
    comments: Comments[];
}

export type GamesWithUsers = Games & {
    user: Users;
}

export type UserNameType = {
    title?: string;
    username: string;
    userId: number;
}

export type CommentsType = {
    id: number,
    userId: number,
    postRank: string,
    yourRank: string,
    game: string
}

export type IsOpenActionType = React.Dispatch<React.SetStateAction<boolean>>;

export type RefType = React.RefObject<null>;

export type ActionType = () => Promise<void>;