import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Story } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface StoryRingProps {
  story: Story;
  isOwn?: boolean;
  onClick?: () => void;
}

export function StoryRing({ story, isOwn, onClick }: StoryRingProps) {
  const { author, viewed } = story;

  return (
    <motion.button
      onClick={onClick}
      className="flex flex-col items-center gap-2 min-w-[72px]"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={cn(
        'relative p-[3px] rounded-full',
        viewed 
          ? 'bg-muted' 
          : 'gradient-primary'
      )}>
        <div className="bg-background rounded-full p-[2px]">
          <Avatar className="h-14 w-14">
            <AvatarImage src={author.avatar} alt={author.displayName} />
            <AvatarFallback>{author.displayName[0]}</AvatarFallback>
          </Avatar>
        </div>
        {isOwn && (
          <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full gradient-primary text-primary-foreground shadow-lg">
            <Plus className="h-4 w-4" />
          </div>
        )}
      </div>
      <span className={cn(
        'text-xs font-medium truncate max-w-[64px]',
        viewed ? 'text-muted-foreground' : 'text-foreground'
      )}>
        {isOwn ? 'Your story' : author.username}
      </span>
    </motion.button>
  );
}
