import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Heart, Send, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Story } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';

interface StoryViewerProps {
  stories: Story[];
  initialIndex?: number;
  onClose: () => void;
}

export function StoryViewer({ stories, initialIndex = 0, onClose }: StoryViewerProps) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialIndex);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [reply, setReply] = useState('');

  const currentStory = stories[currentStoryIndex];
  const currentItem = currentStory?.items[currentItemIndex];
  const duration = currentItem?.duration || 5000;

  const goToNextItem = useCallback(() => {
    if (currentItemIndex < currentStory.items.length - 1) {
      setCurrentItemIndex(prev => prev + 1);
      setProgress(0);
    } else if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
      setCurrentItemIndex(0);
      setProgress(0);
    } else {
      onClose();
    }
  }, [currentItemIndex, currentStory, currentStoryIndex, stories.length, onClose]);

  const goToPrevItem = useCallback(() => {
    if (currentItemIndex > 0) {
      setCurrentItemIndex(prev => prev - 1);
      setProgress(0);
    } else if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
      const prevStory = stories[currentStoryIndex - 1];
      setCurrentItemIndex(prevStory.items.length - 1);
      setProgress(0);
    }
  }, [currentItemIndex, currentStoryIndex, stories]);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (duration / 100));
        if (newProgress >= 100) {
          goToNextItem();
          return 0;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPaused, duration, goToNextItem]);

  const handleTap = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isLeft = x < rect.width / 3;
    const isRight = x > (rect.width * 2) / 3;

    if (isLeft) {
      goToPrevItem();
    } else if (isRight) {
      goToNextItem();
    } else {
      setIsPaused(prev => !prev);
    }
  };

  if (!currentStory || !currentItem) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
      >
        <div className="relative w-full h-full max-w-md mx-auto">
          {/* Progress bars */}
          <div className="absolute top-4 left-4 right-4 z-10 flex gap-1">
            {currentStory.items.map((_, idx) => (
              <div key={idx} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-100"
                  style={{
                    width: idx < currentItemIndex ? '100%' : idx === currentItemIndex ? `${progress}%` : '0%'
                  }}
                />
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="absolute top-8 left-4 right-4 z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-white">
                <AvatarImage src={currentStory.author.avatar} />
                <AvatarFallback>{currentStory.author.displayName[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-white font-semibold text-sm">{currentStory.author.username}</p>
                <p className="text-white/60 text-xs">Just now</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="p-2 text-white/80 hover:text-white"
              >
                {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
              </button>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 text-white/80 hover:text-white"
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>
              <button onClick={onClose} className="p-2 text-white/80 hover:text-white">
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Story content */}
          <div 
            className="w-full h-full cursor-pointer"
            onClick={handleTap}
            onMouseDown={() => setIsPaused(true)}
            onMouseUp={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            {currentItem.type === 'image' ? (
              <img
                src={currentItem.url}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                src={currentItem.url}
                autoPlay
                muted={isMuted}
                loop
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Navigation arrows */}
          {currentStoryIndex > 0 && (
            <button
              onClick={goToPrevItem}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 text-white/60 hover:text-white z-10"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
          )}
          {currentStoryIndex < stories.length - 1 && (
            <button
              onClick={goToNextItem}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white/60 hover:text-white z-10"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          )}

          {/* Reply */}
          <div className="absolute bottom-8 left-4 right-4 z-10 flex items-center gap-3">
            <Input
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder={`Reply to ${currentStory.author.username}...`}
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-full"
            />
            <button className="p-2 text-white/80 hover:text-white">
              <Heart className="h-6 w-6" />
            </button>
            <button className="p-2 text-white/80 hover:text-white">
              <Send className="h-6 w-6" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
