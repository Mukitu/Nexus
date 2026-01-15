import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Edit, BadgeCheck, Check, CheckCheck } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { mockUsers, currentUser } from '@/lib/mock-data';
import { cn, formatTimeAgo } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface Conversation {
  id: string;
  user: typeof mockUsers[0];
  lastMessage: string;
  time: Date;
  unread: boolean;
  isOnline: boolean;
}

const conversations: Conversation[] = [
  {
    id: '1',
    user: mockUsers[0],
    lastMessage: 'That sounds great! Let me check my schedule.',
    time: new Date(Date.now() - 1000 * 60 * 5),
    unread: true,
    isOnline: true,
  },
  {
    id: '2',
    user: mockUsers[1],
    lastMessage: 'The design looks perfect 👌',
    time: new Date(Date.now() - 1000 * 60 * 45),
    unread: false,
    isOnline: true,
  },
  {
    id: '3',
    user: mockUsers[2],
    lastMessage: 'You: Thanks for the feedback!',
    time: new Date(Date.now() - 1000 * 60 * 60 * 2),
    unread: false,
    isOnline: false,
  },
  {
    id: '4',
    user: mockUsers[3],
    lastMessage: 'Let\'s catch up soon!',
    time: new Date(Date.now() - 1000 * 60 * 60 * 24),
    unread: false,
    isOnline: false,
  },
];

function ConversationItem({ conversation }: { conversation: Conversation }) {
  return (
    <motion.div
      whileHover={{ backgroundColor: 'hsl(var(--secondary) / 0.5)' }}
      className={cn(
        'flex items-center gap-4 p-4 cursor-pointer transition-colors rounded-xl',
        conversation.unread && 'bg-primary/5'
      )}
    >
      <div className="relative">
        <Avatar className="h-14 w-14">
          <AvatarImage src={conversation.user.avatar} alt={conversation.user.displayName} />
          <AvatarFallback>{conversation.user.displayName[0]}</AvatarFallback>
        </Avatar>
        {conversation.isOnline && (
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className={cn(
            'font-semibold text-sm flex items-center gap-1',
            conversation.unread && 'text-foreground'
          )}>
            {conversation.user.displayName}
            {conversation.user.verified && (
              <BadgeCheck className="h-4 w-4 text-primary fill-primary/20" />
            )}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatTimeAgo(conversation.time)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <p className={cn(
            'text-sm truncate',
            conversation.unread ? 'text-foreground font-medium' : 'text-muted-foreground'
          )}>
            {conversation.lastMessage}
          </p>
          {!conversation.unread && conversation.lastMessage.startsWith('You:') && (
            <CheckCheck className="h-4 w-4 text-primary flex-shrink-0" />
          )}
        </div>
      </div>

      {conversation.unread && (
        <div className="w-3 h-3 rounded-full gradient-primary" />
      )}
    </motion.div>
  );
}

export default function Messages() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <AppLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Messages</h1>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Edit className="h-5 w-5" />
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages..."
            className="pl-10 h-11 rounded-xl bg-secondary/50 border-0"
          />
        </div>

        <div className="glass rounded-2xl overflow-hidden divide-y divide-border">
          {conversations.map((conversation, i) => (
            <motion.div
              key={conversation.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <ConversationItem conversation={conversation} />
            </motion.div>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground py-4">
          End-to-end encrypted
        </p>
      </div>
    </AppLayout>
  );
}
