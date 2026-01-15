import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Image, 
  Video, 
  MapPin, 
  Users, 
  Hash, 
  X, 
  Upload,
  Sparkles
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { currentUser } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function Create() {
  const [content, setContent] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setSelectedImages(prev => [...prev, ...newImages].slice(0, 4));
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files) {
      const newImages = Array.from(files)
        .filter(file => file.type.startsWith('image/'))
        .map(file => URL.createObjectURL(file));
      setSelectedImages(prev => [...prev, ...newImages].slice(0, 4));
    }
  };

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <h1 className="text-xl font-bold">Create Post</h1>

        <div className="glass rounded-2xl p-6 space-y-6">
          {/* Author */}
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={currentUser.avatar} alt={currentUser.displayName} />
              <AvatarFallback>{currentUser.displayName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{currentUser.displayName}</p>
              <select className="text-sm text-muted-foreground bg-transparent outline-none cursor-pointer">
                <option>Public</option>
                <option>Followers only</option>
                <option>Close friends</option>
              </select>
            </div>
          </div>

          {/* Content */}
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="min-h-[150px] text-lg border-0 p-0 focus-visible:ring-0 resize-none bg-transparent"
          />

          {/* Media Upload Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-2xl transition-colors ${
              isDragging ? 'border-primary bg-primary/5' : 'border-border'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleImageSelect}
              className="hidden"
            />

            <AnimatePresence mode="wait">
              {selectedImages.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-2 gap-2 p-2"
                >
                  {selectedImages.map((img, i) => (
                    <motion.div
                      key={img}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative aspect-square rounded-xl overflow-hidden"
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeImage(i)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))}
                  {selectedImages.length < 4 && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-xl border-2 border-dashed border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                    >
                      <Upload className="h-8 w-8" />
                    </button>
                  )}
                </motion.div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-12 flex flex-col items-center justify-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <div className="p-4 rounded-full bg-secondary">
                    <Upload className="h-8 w-8" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium">Add photos or videos</p>
                    <p className="text-sm">Drag and drop or click to browse</p>
                  </div>
                </button>
              )}
            </AnimatePresence>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => fileInputRef.current?.click()}
            >
              <Image className="h-4 w-4 mr-2" /> Photo
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              <Video className="h-4 w-4 mr-2" /> Video
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              <MapPin className="h-4 w-4 mr-2" /> Location
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              <Users className="h-4 w-4 mr-2" /> Tag
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              <Hash className="h-4 w-4 mr-2" /> Hashtag
            </Button>
          </div>

          {/* Post Button */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <Sparkles className="h-4 w-4 mr-2" /> AI Assist
            </Button>
            <Button
              disabled={!content.trim() && selectedImages.length === 0}
              className="gradient-primary text-primary-foreground font-semibold px-8 rounded-full hover:opacity-90 transition-opacity"
            >
              Post
            </Button>
          </div>
        </div>
      </motion.div>
    </AppLayout>
  );
}
