import { apiGetPosts, apiCreatePost, apiLikePost, apiCommentPost } from './api';

export interface Post {
  id: string;
  userId: string;
  username: string;
  rank: string;
  type: 'workout_complete' | 'rank_up' | 'pr' | 'streak' | 'lock_in' | 'status';
  message: string;
  xp?: number;
  likes: number;
  likedBy: string[];
  comments: Comment[];
  createdAt: number;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  text: string;
  createdAt: number;
}

export async function getFeed(): Promise<Post[]> {
  return (await apiGetPosts()) || [];
}

export async function createPost(post: Omit<Post, 'id' | 'likes' | 'likedBy' | 'comments' | 'createdAt'>): Promise<Post[]> {
  await apiCreatePost(post);
  return await getFeed();
}

export async function likePost(postId: string, userId: string): Promise<Post[]> {
  await apiLikePost(postId, userId);
  return await getFeed();
}

export async function addComment(postId: string, userId: string, username: string, text: string): Promise<Post[]> {
  await apiCommentPost(postId, { userId, username, text });
  return await getFeed();
}

export async function autoPostWorkout(name: string, xp: number, userId: string, username: string, rank: string): Promise<void> {
  const messages = [
    `Completed ${name} · +${xp} XP`,
    `${name} finished. +${xp} XP earned.`,
    `Victory in ${name}. ${xp} XP gained.`,
  ];
  await createPost({
    userId,
    username,
    rank,
    type: 'workout_complete',
    message: messages[Math.floor(Math.random() * messages.length)],
    xp,
  });
}

export async function autoPostRankUp(newRank: string, userId: string, username: string): Promise<void> {
  await createPost({
    userId,
    username,
    rank: newRank,
    type: 'rank_up',
    message: `Ascended to ${newRank}! The path deepens.`,
  });
}

export async function autoPostStreak(streak: number, userId: string, username: string, rank: string): Promise<void> {
  await createPost({
    userId,
    username,
    rank,
    type: 'streak',
    message: `${streak}-day streak. Consistency is the warrior's way.`,
  });
}
