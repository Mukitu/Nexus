import { User, Post, Story } from './types';

export const currentUser: User = {
  id: 'u1',
  username: 'alexchen',
  displayName: 'Alex Chen',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  bio: 'Building the future 🚀 | Design & Code',
  verified: true,
  followersCount: 12400,
  followingCount: 890,
  postsCount: 342,
};

export const mockUsers: User[] = [
  {
    id: 'u2',
    username: 'sarahdesigns',
    displayName: 'Sarah Miller',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    bio: 'UX Designer @Meta',
    verified: true,
    followersCount: 45200,
    followingCount: 1200,
    postsCount: 892,
  },
  {
    id: 'u3',
    username: 'techwave',
    displayName: 'Marcus Tech',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    bio: 'Tech Entrepreneur | AI Enthusiast',
    verified: false,
    followersCount: 8900,
    followingCount: 340,
    postsCount: 156,
  },
  {
    id: 'u4',
    username: 'creativemind',
    displayName: 'Emma Creative',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    bio: 'Artist & Dreamer ✨',
    verified: true,
    followersCount: 234000,
    followingCount: 567,
    postsCount: 2100,
  },
  {
    id: 'u5',
    username: 'devlife',
    displayName: 'James Dev',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    bio: 'Full-stack developer',
    verified: false,
    followersCount: 5600,
    followingCount: 890,
    postsCount: 234,
  },
];

export const mockPosts: Post[] = [
  {
    id: 'p1',
    author: mockUsers[0],
    content: 'Just shipped a new design system for our product. Months of work finally paying off! 🎨✨ What do you think about the new look?',
    media: [
      {
        id: 'm1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop',
        aspectRatio: 4/3,
      },
    ],
    likes: 2847,
    comments: 156,
    shares: 89,
    isLiked: false,
    isBookmarked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: 'p2',
    author: mockUsers[1],
    content: 'The future of AI is here. Just tested GPT-5 and my mind is completely blown 🤯 We are living in the most exciting time in tech history.',
    likes: 5621,
    comments: 432,
    shares: 278,
    isLiked: true,
    isBookmarked: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: 'p3',
    author: mockUsers[2],
    content: 'Morning vibes at the studio 🎵 New album coming soon!',
    media: [
      {
        id: 'm2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=800&fit=crop',
        aspectRatio: 1,
      },
    ],
    likes: 18923,
    comments: 1203,
    shares: 567,
    isLiked: false,
    isBookmarked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
  {
    id: 'p4',
    author: mockUsers[3],
    content: 'Just wrapped up my first open source contribution! It feels amazing to give back to the community that has taught me so much. 💚',
    likes: 892,
    comments: 67,
    shares: 23,
    isLiked: false,
    isBookmarked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
  },
  {
    id: 'p5',
    author: currentUser,
    content: 'Building something incredible with an amazing team. Stay tuned for the announcement next week! 🔥',
    media: [
      {
        id: 'm3',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=500&fit=crop',
        aspectRatio: 16/10,
      },
    ],
    likes: 3456,
    comments: 234,
    shares: 145,
    isLiked: true,
    isBookmarked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
];

export const mockStories: Story[] = [
  {
    id: 's1',
    author: currentUser,
    items: [
      { id: 'si1', type: 'image', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=700&fit=crop' },
    ],
    viewed: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: 's2',
    author: mockUsers[0],
    items: [
      { id: 'si2', type: 'image', url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=700&fit=crop' },
    ],
    viewed: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 45),
  },
  {
    id: 's3',
    author: mockUsers[1],
    items: [
      { id: 'si3', type: 'image', url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=700&fit=crop' },
    ],
    viewed: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 120),
  },
  {
    id: 's4',
    author: mockUsers[2],
    items: [
      { id: 'si4', type: 'image', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=700&fit=crop' },
    ],
    viewed: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 180),
  },
  {
    id: 's5',
    author: mockUsers[3],
    items: [
      { id: 'si5', type: 'image', url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=700&fit=crop' },
    ],
    viewed: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 240),
  },
];

export const suggestedUsers = mockUsers.slice(0, 4);
