import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MoreHorizontal,
  BadgeCheck
} from 'lucide-react';
import { Post } from '@/lib/types';
import { cn, formatNumber, formatTimeAgo } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked);
  const [showHeart, setShowHeart] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleDoubleTap = () => {
    if (!isLiked) {
      setIsLiked(true);
      setLikesCount(prev => prev + 1);
    }
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 ring-2 ring-primary/20">
            <AvatarImage src={post.author.avatar} alt={post.author.displayName} />
            <AvatarFallback>{post.author.displayName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-sm">{post.author.username}</span>
              {post.author.verified && (
                <BadgeCheck className="h-4 w-4 text-primary fill-primary/20" />
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {formatTimeAgo(post.createdAt)}
            </span>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>

      {/* Content */}
      {post.content && (
        <p className="px-4 pb-3 text-sm leading-relaxed">{post.content}</p>
      )}

      {/* Media */}
      {post.media && post.media.length > 0 && (
        <div 
          className="relative cursor-pointer"
          onDoubleClick={handleDoubleTap}
        >
          <img
            src={post.media[0].url}
            alt="Post media"
            className="w-full object-cover"
            style={{ aspectRatio: post.media[0].aspectRatio || 1 }}
          />
          <AnimatePresence>
            {showHeart && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Heart className="h-24 w-24 text-white fill-white drop-shadow-lg" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <motion.button
              onClick={handleLike}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full hover:bg-secondary/50 transition-colors"
            >
              <Heart
                className={cn(
                  'h-6 w-6 transition-colors',
                  isLiked ? 'fill-accent text-accent' : 'text-foreground'
                )}
              />
            </motion.button>
            <button className="p-2 rounded-full hover:bg-secondary/50 transition-colors">
              <MessageCircle className="h-6 w-6" />
            </button>
            <button className="p-2 rounded-full hover:bg-secondary/50 transition-colors">
              <Share2 className="h-6 w-6" />
            </button>
          </div>
          <motion.button
            onClick={() => setIsBookmarked(!isBookmarked)}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full hover:bg-secondary/50 transition-colors"
          >
            <Bookmark
              className={cn(
                'h-6 w-6 transition-colors',
                isBookmarked && 'fill-foreground'
              )}
            />
          </motion.button>
        </div>

        {/* Stats */}
        <div className="space-y-1">
          <p className="font-semibold text-sm">{formatNumber(likesCount)} likes</p>
          <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            View all {formatNumber(post.comments)} comments
          </button>
        </div>
      </div>
    </motion.article>
  );
}
