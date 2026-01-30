import type { Comments, Users, Games, Posts } from '@prisma/client';

export type CommentsWithUsers = Comments & {
    user: Users & [games: Games[]];
}

export type PostsWithUsers = Posts & {
    user: Users & [games: Games[]];
    comments: Comments[];
}

export type GamesWithUsers = Games & {
    user : Users;
}