export interface User {
  id: string;
  username: string;
  displayName: string;
  email?: string;
  avatar: string;
  bio?: string;
  verified?: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
}

export interface Post {
  id: string;
  author: User;
  content: string;
  media?: MediaItem[];
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: Date;
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  aspectRatio?: number;
}

export interface Story {
  id: string;
  author: User;
  items: StoryItem[];
  viewed: boolean;
  createdAt: Date;
}

export interface StoryItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  duration?: number;
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  likes: number;
  isLiked: boolean;
  createdAt: Date;
  replies?: Comment[];
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention';
  actor: User;
  post?: Post;
  read: boolean;
  createdAt: Date;
}
