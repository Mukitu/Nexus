import { useState } from 'react';
import { motion } from 'framer-motion';
import { BadgeCheck } from 'lucide-react';
import { User } from '@/lib/types';
import { suggestedUsers } from '@/lib/mock-data';
import { cn, formatNumber } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface UserCardProps {
  user: User;
}

function UserCard({ user }: UserCardProps) {
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center justify-between py-3"
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-11 w-11">
          <AvatarImage src={user.avatar} alt={user.displayName} />
          <AvatarFallback>{user.displayName[0]}</AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-1">
            <span className="font-semibold text-sm">{user.username}</span>
            {user.verified && (
              <BadgeCheck className="h-4 w-4 text-primary fill-primary/20" />
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate max-w-[140px]">
            {user.bio || `${formatNumber(user.followersCount)} followers`}
          </p>
        </div>
      </div>
      <Button
        variant={isFollowing ? 'outline' : 'default'}
        size="sm"
        onClick={() => setIsFollowing(!isFollowing)}
        className={cn(
          'rounded-full text-xs font-semibold h-8 px-4',
          !isFollowing && 'gradient-primary text-primary-foreground hover:opacity-90'
        )}
      >
        {isFollowing ? 'Following' : 'Follow'}
      </Button>
    </motion.div>
  );
}

export function SuggestedUsers() {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-sm text-muted-foreground">Suggested for you</h3>
        <button className="text-xs font-semibold text-foreground hover:text-muted-foreground transition-colors">
          See All
        </button>
      </div>
      <div className="divide-y divide-border">
        {suggestedUsers.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}
