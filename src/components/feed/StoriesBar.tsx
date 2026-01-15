import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { mockStories } from '@/lib/mock-data';
import { StoryRing } from './StoryRing';
import { Button } from '@/components/ui/button';

export function StoriesBar() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === 'left' ? -200 : 200;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <div className="relative mb-6">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden md:block">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full glass"
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      <motion.div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide py-2 px-1"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {mockStories.map((story, index) => (
          <StoryRing
            key={story.id}
            story={story}
            isOwn={index === 0}
            onClick={() => console.log('Open story:', story.id)}
          />
        ))}
      </motion.div>

      <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden md:block">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full glass"
          onClick={() => scroll('right')}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
