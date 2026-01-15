import { useState } from 'react';
import { motion } from 'framer-motion';
import { Image, Video, Smile, MapPin } from 'lucide-react';
import { currentUser } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export function CreatePost() {
  const [content, setContent] = useState('');

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-4 mb-6"
    >
      <div className="flex gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={currentUser.avatar} alt={currentUser.displayName} />
          <AvatarFallback>{currentUser.displayName[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full bg-transparent resize-none outline-none text-sm placeholder:text-muted-foreground min-h-[60px]"
            rows={2}
          />
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-9 w-9 text-primary hover:text-primary">
                <Image className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 text-accent hover:text-accent">
                <Video className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 text-yellow-500 hover:text-yellow-500">
                <Smile className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 text-green-500 hover:text-green-500">
                <MapPin className="h-5 w-5" />
              </Button>
            </div>
            <Button 
              disabled={!content.trim()}
              className="gradient-primary text-primary-foreground font-medium px-6 rounded-full hover:opacity-90 transition-opacity"
            >
              Post
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
