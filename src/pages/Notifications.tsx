import { motion } from 'framer-motion';
import { Heart, MessageCircle, UserPlus, AtSign, BadgeCheck } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { mockUsers } from '@/lib/mock-data';
import { cn, formatTimeAgo } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface NotificationItemData {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention';
  user: typeof mockUsers[0];
  content?: string;
  time: Date;
  read: boolean;
}

const notifications: NotificationItemData[] = [
  {
    id: '1',
    type: 'like',
    user: mockUsers[0],
    content: 'liked your post',
    time: new Date(Date.now() - 1000 * 60 * 5),
    read: false,
  },
  {
    id: '2',
    type: 'follow',
    user: mockUsers[1],
    content: 'started following you',
    time: new Date(Date.now() - 1000 * 60 * 30),
    read: false,
  },
  {
    id: '3',
    type: 'comment',
    user: mockUsers[2],
    content: 'commented: "This is amazing! 🔥"',
    time: new Date(Date.now() - 1000 * 60 * 60),
    read: true,
  },
  {
    id: '4',
    type: 'mention',
    user: mockUsers[3],
    content: 'mentioned you in a post',
    time: new Date(Date.now() - 1000 * 60 * 60 * 3),
    read: true,
  },
  {
    id: '5',
    type: 'like',
    user: mockUsers[0],
    content: 'and 12 others liked your post',
    time: new Date(Date.now() - 1000 * 60 * 60 * 5),
    read: true,
  },
];

const iconMap = {
  like: Heart,
  comment: MessageCircle,
  follow: UserPlus,
  mention: AtSign,
};

const colorMap = {
  like: 'text-accent',
  comment: 'text-primary',
  follow: 'text-green-500',
  mention: 'text-yellow-500',
};

function NotificationItem({ notification }: { notification: NotificationItemData }) {
  const Icon = iconMap[notification.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        'flex items-center gap-4 p-4 rounded-xl transition-colors cursor-pointer',
        notification.read ? 'bg-transparent hover:bg-secondary/50' : 'bg-primary/5 hover:bg-primary/10'
      )}
    >
      <div className="relative">
        <Avatar className="h-12 w-12">
          <AvatarImage src={notification.user.avatar} alt={notification.user.displayName} />
          <AvatarFallback>{notification.user.displayName[0]}</AvatarFallback>
        </Avatar>
        <div className={cn(
          'absolute -bottom-1 -right-1 p-1 rounded-full bg-background',
          colorMap[notification.type]
        )}>
          <Icon className="h-3 w-3" />
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm">
          <span className="font-semibold inline-flex items-center gap-1">
            {notification.user.username}
            {notification.user.verified && (
              <BadgeCheck className="h-4 w-4 text-primary fill-primary/20" />
            )}
          </span>
          {' '}
          <span className="text-muted-foreground">{notification.content}</span>
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {formatTimeAgo(notification.time)}
        </p>
      </div>

      {notification.type === 'follow' && (
        <Button size="sm" className="rounded-full gradient-primary text-primary-foreground">
          Follow
        </Button>
      )}
    </motion.div>
  );
}

export default function Notifications() {
  return (
    <AppLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Notifications</h1>
          <button className="text-sm text-primary font-medium hover:underline">
            Mark all as read
          </button>
        </div>

        <div className="glass rounded-2xl divide-y divide-border overflow-hidden">
          {notifications.map((notification, i) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <NotificationItem notification={notification} />
            </motion.div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground py-4">
          You're all caught up! 🎉
        </p>
      </div>
    </AppLayout>
  );
}
