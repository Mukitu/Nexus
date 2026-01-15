import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, Volume2, VolumeX, Play, Pause, Music2, BadgeCheck } from 'lucide-react';
import { cn, formatNumber } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useInView } from 'react-intersection-observer';

interface Reel {
  id: string;
  author: {
    username: string;
    displayName: string;
    avatar: string;
    verified: boolean;
  };
  videoUrl: string;
  caption: string;
  audioName: string;
  likes: number;
  comments: number;
  shares: number;
}

interface ReelCardProps {
  reel: Reel;
  isActive: boolean;
}

function ReelCard({ reel, isActive }: ReelCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [showHeart, setShowHeart] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [isActive]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleDoubleTap = () => {
    if (!isLiked) {
      setIsLiked(true);
    }
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);
  };

  return (
    <div className="relative w-full h-full snap-start snap-always bg-black">
      <video
        ref={videoRef}
        src={reel.videoUrl}
        className="w-full h-full object-cover"
        loop
        muted={isMuted}
        playsInline
        onClick={togglePlay}
        onDoubleClick={handleDoubleTap}
      />

      {/* Heart animation */}
      <AnimatePresence>
        {showHeart && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <Heart className="h-24 w-24 text-white fill-white drop-shadow-lg" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Play/Pause indicator */}
      <AnimatePresence>
        {!isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/20"
          >
            <div className="p-4 rounded-full bg-black/40">
              <Play className="h-12 w-12 text-white" fill="white" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Right side actions */}
      <div className="absolute right-4 bottom-32 flex flex-col items-center gap-6">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsLiked(!isLiked)}
          className="flex flex-col items-center gap-1"
        >
          <div className={cn(
            'p-3 rounded-full bg-black/30 backdrop-blur-sm',
            isLiked && 'text-accent'
          )}>
            <Heart className={cn('h-7 w-7', isLiked && 'fill-current')} />
          </div>
          <span className="text-white text-xs font-medium">{formatNumber(reel.likes)}</span>
        </motion.button>

        <button className="flex flex-col items-center gap-1">
          <div className="p-3 rounded-full bg-black/30 backdrop-blur-sm">
            <MessageCircle className="h-7 w-7 text-white" />
          </div>
          <span className="text-white text-xs font-medium">{formatNumber(reel.comments)}</span>
        </button>

        <button className="flex flex-col items-center gap-1">
          <div className="p-3 rounded-full bg-black/30 backdrop-blur-sm">
            <Share2 className="h-7 w-7 text-white" />
          </div>
          <span className="text-white text-xs font-medium">{formatNumber(reel.shares)}</span>
        </button>

        <button
          onClick={() => setIsMuted(!isMuted)}
          className="p-3 rounded-full bg-black/30 backdrop-blur-sm"
        >
          {isMuted ? (
            <VolumeX className="h-6 w-6 text-white" />
          ) : (
            <Volume2 className="h-6 w-6 text-white" />
          )}
        </button>

        <div className="w-10 h-10 rounded-lg overflow-hidden border-2 border-white animate-pulse-ring">
          <img src={reel.author.avatar} alt="" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-8 left-4 right-20 text-white">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-10 w-10 border-2 border-white">
            <AvatarImage src={reel.author.avatar} />
            <AvatarFallback>{reel.author.displayName[0]}</AvatarFallback>
          </Avatar>
          <span className="font-semibold flex items-center gap-1">
            {reel.author.username}
            {reel.author.verified && (
              <BadgeCheck className="h-4 w-4 text-primary fill-primary/20" />
            )}
          </span>
          <Button variant="outline" size="sm" className="rounded-full border-white text-white hover:bg-white/20 h-8">
            Follow
          </Button>
        </div>

        <p className="text-sm mb-3 line-clamp-2">{reel.caption}</p>

        <div className="flex items-center gap-2">
          <Music2 className="h-4 w-4" />
          <div className="overflow-hidden">
            <motion.span
              animate={{ x: [0, -100, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              className="text-sm whitespace-nowrap"
            >
              {reel.audioName}
            </motion.span>
          </div>
        </div>
      </div>
    </div>
  );
}

const mockReels: Reel[] = [
  {
    id: 'r1',
    author: {
      username: 'creativemind',
      displayName: 'Emma Creative',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      verified: true,
    },
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    caption: 'Check out this amazing sunset view! 🌅 #nature #sunset #vibes',
    audioName: 'Original Audio - creativemind',
    likes: 45200,
    comments: 892,
    shares: 234,
  },
  {
    id: 'r2',
    author: {
      username: 'techwave',
      displayName: 'Marcus Tech',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      verified: false,
    },
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    caption: 'Building the future with AI 🤖 #tech #ai #innovation',
    audioName: 'Tech Vibes - TechWave',
    likes: 12300,
    comments: 456,
    shares: 123,
  },
  {
    id: 'r3',
    author: {
      username: 'sarahdesigns',
      displayName: 'Sarah Miller',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
      verified: true,
    },
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    caption: 'Design tip of the day! ✨ #design #ux #tips',
    audioName: 'Trending Sound - Viral',
    likes: 89000,
    comments: 2340,
    shares: 567,
  },
];

export default function Reels() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="fixed inset-0 bg-black z-50 overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
      {mockReels.map((reel, index) => {
        const { ref, inView } = useInView({
          threshold: 0.5,
        });

        useEffect(() => {
          if (inView) {
            setActiveIndex(index);
          }
        }, [inView, index]);

        return (
          <div key={reel.id} ref={ref} className="h-screen w-full">
            <ReelCard reel={reel} isActive={inView} />
          </div>
        );
      })}
    </div>
  );
}
